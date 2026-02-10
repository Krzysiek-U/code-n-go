import gc
import os
import time
import json
import sys
import esp32 
import machine
from microdot import Microdot, send_file, Response

# Inicjalizacja serwera
app = Microdot()

# --- OPTYMALIZACJA RAM ---
@app.after_request
def cleanup(request, response):
    gc.collect()
    return response

def file_exists(path):
    try:
        os.stat(path)
        return True
    except OSError:
        return False

# --- PROFILE SPRZĘTOWE ---
def get_hardware_profile():
    # Wykrywanie S3 vs Lolin
    machine_name = sys.implementation._machine.lower()
    is_s3 = 'esp32s3' in machine_name
    try:
        with open('config.json', 'r') as f:
            config = json.load(f)
        return config['profiles']['S3_ROUND'] if is_s3 else config['profiles']['LOLIN32_LITE']
    except:
        return {"name": "Robotech Default", "ui": "rect"}

CURRENT_PROFILE = get_hardware_profile()

# --- TRASY SERWERA ---

@app.route('/get_profile')
def get_profile(request):
    gc.collect()
    try:
        temp_c = (esp32.raw_temperature() - 32) * 5 / 9
    except:
        temp_c = 0
    stats = {
        "name": CURRENT_PROFILE.get('name', 'Robotech'),
        "ui": CURRENT_PROFILE.get('ui', 'rect'),
        "ram_free": f"{gc.mem_free() / 1024:.1f} KB",
        "cpu_temp": f"{temp_c:.1f} °C",
        "cpu_freq": f"{machine.freq() / 1000000:.0f} MHz"
    }
    return json.dumps(stats)

@app.route('/static/<path:path>')
def static(request, path):
    gc.collect()
    gz_path = '/web/static/' + path + '.gz'
    
    # Wykrywanie typu pliku
    if path.endswith('.css'): content_type = 'text/css'
    elif path.endswith('.js'): content_type = 'application/javascript'
    else: content_type = 'application/octet-stream'

    if not file_exists(gz_path):
        return "404", 404

    def stream_gz():
        with open(gz_path, 'rb') as f:
            while True:
                chunk = f.read(1024)
                if not chunk: break
                yield chunk

    return Response(body=stream_gz(), headers={
        'Content-Type': content_type,
        'Content-Encoding': 'gzip'
    })

@app.route('/')
def index(request):
    return send_file('/web/index.html')

@app.route('/save_project', methods=['POST'])
def save_p(request):
    data = request.json
    filename = f"/projects/{data['name'].replace(' ', '_')}" 
    with open(filename, 'w') as f:
        f.write(data['data'])
    return {'status': 'ok'}

@app.route('/list_projects')
def list_p(request):
    return json.dumps(os.listdir('/projects'))

@app.route('/load_project')
def load_p(request):
    name = request.args.get('name')
    path = f"/projects/{name}"
    if file_exists(path):
        return send_file(path, content_type='text/xml')
    return 'Not found', 404

@app.route('/run', methods=['POST'])
def run(request):
    try:
        gc.collect()
        code = request.body.decode('utf-8')
        
        # Czyszczenie starych funkcji przycisków
        to_delete = [name for name in globals().keys() if name.startswith('btn_')]
        for name in to_delete:
            del globals()[name]
        
        gc.collect()
        print("\n--- PROGRAMOWANIE ---")
        print(code)
        
        exec(code, globals())
        gc.collect()
        return 'OK'
    except Exception as e:
        return str(e), 500

@app.route('/click')
def click(request):
    name = request.args.get('name')
    func_name = "btn_" + name
    if func_name in globals():
        globals()[func_name]()
        return "OK"
    return "Błąd: Brak funkcji", 404

@app.route('/get_buttons')
def get_btns(request):
    btns = [name[4:] for name in globals().keys() if name.startswith('btn_')]
    return json.dumps(btns)

# --- START SYSTEMU ---

if __name__ == '__main__':
    # Tworzenie folderu projektów
    if not file_exists('/projects'):
        os.mkdir('/projects')
        
    gc.collect()
    print(f"Start OS. Wolny RAM: {gc.mem_free()/1024:.1f} KB")

    time.sleep(1) # Krótkie czekanie na stabilizację WiFi

    try:
        import screen
        if screen.init():
            screen.print_line(CURRENT_PROFILE.get('name', 'OS'), 0)
            screen.refresh() 
            print("LCD: OK")
    except Exception as e:
        print("LCD SKIP:", e)

    app.run(host='0.0.0.0', port=80, debug=False)
