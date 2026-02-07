import gc
import os
import time
import json
from microdot import Microdot, send_file, Response

app = Microdot()

# Funkcja pomocnicza
def file_exists(path):
    try:
        os.stat(path)
        return True
    except OSError:
        return False

# Tworzenie folderu na projekty przy starcie
if not file_exists('/projects'):
    try:
        os.mkdir('/projects')
    except:
        pass

@app.route('/static/<path:path>')
def static(request, path):
    gc.collect()
    gz_path = '/web/static/' + path + '.gz'
    
    content_type = 'application/javascript'
    if path.endswith('.css'):
        content_type = 'text/css'
    elif path.endswith('.map'):
        return "Not found", 404

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

# --- NOWE ENDPOINTY DLA BLOCKLY ---

@app.route('/save_project', methods=['POST'])
def save_p(request):
    data = request.json
    # Bierzemy nazwę prosto z JS (tam już jest .py lub .xml)
    name = data['name'].replace(" ", "_") 
    
    # KLUCZOWA ZMIANA: Usuwamy ".xml" z tej linii!
    filename = f"/projects/{name}" 
    
    with open(filename, 'w') as f:
        f.write(data['data'])
    return {'status': 'ok'}


@app.route('/list_projects')
def list_p(request):
    files = os.listdir('/projects')
    return json.dumps(files)

@app.route('/load_project')
def load_p(request, name=None):
    name = request.args.get('name')
    path = f"/projects/{name}"
    if file_exists(path):
        with open(path, 'r') as f:
            return f.read(), 200, {'Content-Type': 'text/xml'}
    return 'Not found', 404

# ---------------------------------

@app.route('/run', methods=['POST'])
def run(request):
    code = request.body.decode('utf-8')
    print("\n--- WYKONUJE KOD Z BLOCKLY ---\n", code)
    # Tu w przyszłości dodasz wysyłanie do ATtiny84
    try:
        exec(code, globals())
    except Exception as e:
        print("Błąd wykonania:", e)
    return 'OK'

if __name__ == '__main__':
    print("--- code-n-go OS na S3 (GZIP + File System) GOTOWY ---")
    app.run(host='0.0.0.0', port=80, debug=True)
