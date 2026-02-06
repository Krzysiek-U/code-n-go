import asyncio
import os
from microdot import Microdot, send_file

app = Microdot()

# Funkcja pomocnicza do sprawdzania czy plik istnieje
def file_exists(path):
    try:
        os.stat(path)
        return True
    except OSError:
        return False

# Obsługa plików statycznych (JS, GZIP)
@app.route('/static/<path:path>')
async def static(request, path):
    file_path = '/web/static/' + path
    gz_path = file_path + '.gz'
    
    # Jeśli mamy wersję GZIP, wysyłamy ją z nagłówkiem
    if file_exists(gz_path):
        return send_file(gz_path, content_type='application/javascript', content_encoding='gzip')
    return send_file(file_path)

@app.route('/')
async def index(request):
    return send_file('/web/index.html')

@app.route('/run', methods=['POST'])
async def run(request):
    code = request.body.decode('utf-8')
    print("--- URUCHAMIANIE KODU ---")
    try:
        exec(code)
        return 'OK'
    except Exception as e:
        print("Błąd:", e)
        return str(e), 500

async def start_os():
    print("code-n-go OS: Serwer startuje na porcie 80...")
    await app.start_server(port=80)

if __name__ == '__main__':
    asyncio.run(start_os())
