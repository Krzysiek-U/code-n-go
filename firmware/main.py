import asyncio
import os
from microdot import Microdot, send_file

app = Microdot()

def file_exists(path):
    try:
        os.stat(path)
        return True
    except OSError:
        return False

# Obsługa bibliotek Blockly z Gzip
@app.route('/static/<path:path>')
async def static(request, path):
    file_path = '/web/static/' + path
    gz_path = file_path + '.gz'
    
    if file_exists(gz_path):
        # Wysyłamy spakowany plik i mówimy przeglądarce, żeby go rozpakowała
        return send_file(gz_path, content_type='application/javascript', content_encoding='gzip')
    return send_file(file_path)

@app.route('/')
async def index(request):
    return send_file('/web/index.html')

@app.route('/run', methods=['POST'])
async def run(request):
    code = request.body.decode('utf-8')
    print("--- WYKONUJĘ KOD Z BLOCKLY ---")
    print(code)
    try:
        exec(code)
        return 'OK'
    except Exception as e:
        return str(e), 500

async def start():
    print("Serwer code-n-go gotowy na porcie 80")
    await app.start_server(port=80)

if __name__ == '__main__':
    asyncio.run(start())
