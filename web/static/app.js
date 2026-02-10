let pythonEdited = false;
let joyCommands = {}; 

// 1. Inicjalizacja Toolboxa (Stała)
const ROBOTECH_TOOLBOX = `
<xml id="toolbox" style="display: none">
    <category name="Robot" colour="#e67e22">
        <block type="pilot_add_button"></block>
        <block type="pilot_on_joy"></block>
        <block type="led_on"></block>
        <block type="led_off"></block>
        <block type="wait_ms"></block>
        <block type="servo_move"></block>
    </category>
    <category name="Ekran" colour="#3498db">
        <block type="screen_print"></block>
        <block type="screen_rect"></block>
        <block type="screen_clear"></block>
    </category>
    <category name="Logika" colour="#5b80a5"><block type="controls_if"></block></category>
    <category name="Pętle" colour="#5ba55b">
        <block type="controls_repeat_ext">
            <value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
        </block>
    </category>
</xml>`;

// 2. Inicjalizacja Blockly
var workspace = Blockly.inject('blocklyDiv', { 
    toolbox: ROBOTECH_TOOLBOX, 
    theme: Blockly.Themes.Zelos, 
    renderer: 'zelos',
    zoom: { controls: true, wheel: true, startScale: 0.8 }
});

if (Blockly.Python) {
    Blockly.Python.INDENT = '    ';
    logStatus("Generator Python gotowy.");
}

// --- FUNKCJE POMOCNICZE ---

function logStatus(msg, isError = false) {
    const msgDiv = document.getElementById('status-msg');
    if (!msgDiv) return;
    msgDiv.innerText = msg;
    msgDiv.style.color = isError ? "#e74c3c" : "#2ecc71";
}

function highlightPython(code) {
    if(!code) return "";
    let clean = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return clean
        .replace(/(#.*)/g, '<span style="color:#6a9955;">$1</span>')
        .replace(/\b(import|from|def|if|else|elif|for|while|return|machine|time|screen|servo)\b/g, '<span style="color:#c586c0;">$1</span>')
        .replace(/("(.*?)"|'(.*?)')/g, '<span style="color:#ce9178;">$1</span>')
        .replace(/\b(\d+)\b/g, '<span style="color:#b5cea8;">$1</span>');
}

// --- ZAKŁADKI I EDYTOR ---

function switchTab(tab) {
    const divs = ['blocklyDiv', 'panelDiv', 'pilotDiv', 'pythonDiv'];
    divs.forEach(div => { document.getElementById(div).style.display = 'none'; });
    
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');

    let targetId = (tab === 'blocks') ? 'blocklyDiv' : tab + 'Div';
    document.getElementById(targetId).style.display = (tab === 'python') ? 'flex' : 'block';

    if (tab === 'blocks') setTimeout(() => { Blockly.svgResize(workspace); }, 50);
    if (tab === 'python') updatePythonPreview();
}

function updatePythonPreview() {
    if (pythonEdited) return;
    const code = Blockly.Python.workspaceToCode(workspace);
    const editor = document.getElementById('pythonEditor');
    const highlight = document.getElementById('pythonHighlight');
    if (editor) editor.value = code;
    if (highlight) highlight.innerHTML = highlightPython(code);
}

// -------------------
// --- 1. NOWY PROJEKT ---
function newProject() {
    if (confirm("Czy chcesz wyczyścić obszar roboczy? Niezapisane zmiany przepadną.")) {
        workspace.clear();
        logStatus("Obszar roboczy wyczyszczony.");
    }
}

// --- 2. ZAPISYWANIE ---
function saveProject() {
    let name = prompt("Podaj nazwę projektu:");
    if (!name) return;
    if (!name.endsWith('.xml')) name += '.xml';

    let xml = Blockly.Xml.workspaceToDom(workspace);
    let xmlText = Blockly.Xml.domToText(xml);

    fetch('/save_project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, data: xmlText })
    })
    .then(res => res.json())
    .then(() => logStatus("Zapisano: " + name))
    .catch(err => logStatus("Błąd zapisu!", true));
}

// --- 3. OTWIERANIE (PYTANIE O PLIK) ---
function openProject() {
    fetch('/list_projects')
    .then(res => res.json())
    .then(files => {
        let xmlFiles = files.filter(f => f.endsWith('.xml'));
        if (xmlFiles.length === 0) return alert("Brak zapisanych projektów.");
        
        let msg = "Wybierz projekt:\n" + xmlFiles.join('\n');
        let choice = prompt(msg);
        if (choice) loadProject(choice);
    });
}

// --- 1. OTWIERANIE MODALA Z LISTĄ PLIKÓW ---
function listProjects() {
    const modal = document.getElementById('fileModal');
    const list = document.getElementById('fileList');
    
    if (!modal || !list) {
        logStatus("BŁĄD: Brak elementu fileModal w HTML!", true);
        return;
    }

    logStatus("Pobieram listę projektów...");
    fetch('/list_projects')
        .then(res => res.json())
        .then(files => {
            list.innerHTML = ""; // Czyścimy listę przed dodaniem nowych
            let xmlFiles = files.filter(f => f.endsWith('.xml'));

            if (xmlFiles.length === 0) {
                list.innerHTML = '<div style="padding:10px;">Brak plików .xml</div>';
            } else {
                xmlFiles.forEach(file => {
                    let div = document.createElement('div');
                    div.style.padding = "12px";
                    div.style.borderBottom = "1px solid #444";
                    div.style.cursor = "pointer";
                    div.style.background = "#34495e";
                    div.style.margin = "5px";
                    div.style.borderRadius = "5px";
                    div.innerText = file.replace('.xml', '');
                    
                    // Po kliknięciu w nazwę pliku
                    div.onclick = function() {
                        loadProjectFile(file);
                        modal.style.display = 'none'; // Zamknij modal
                    };
                    
                    // Efekt hover (opcjonalnie)
                    div.onmouseover = () => div.style.background = "#3498db";
                    div.onmouseout = () => div.style.background = "#34495e";
                    
                    list.appendChild(div);
                });
            }
            
            modal.style.display = 'flex'; // Pokaż okno (używamy flex dla centrowania)
            logStatus("Wybierz projekt z listy.");
        })
        .catch(err => logStatus("Błąd połączenia z listą!", true));
}

// --- 2. WCZYTYWANIE WYBRANEGO PLIKU ---
function loadProjectFile(filename) {
    logStatus("Wczytuję: " + filename);
    fetch('/load_project?name=' + filename)
        .then(res => {
            if (!res.ok) throw new Error("Nie znaleziono pliku");
            return res.text();
        })
        .then(xmlText => {
            workspace.clear();
            let xml = Blockly.utils.xml.textToDom(xmlText);
            Blockly.Xml.domToWorkspace(xml, workspace);
            
            // Odświeżenie dla Zelosa (wygląd MakeCode)
            if(workspace.refreshToolboxSelection) {
                workspace.refreshToolboxSelection();
            }
            
            logStatus("Wczytano projekt: " + filename);
            // Upewnij się, że jesteśmy w zakładce bloki
            switchTab('blocks'); 
        })
        .catch(err => logStatus("Błąd wczytywania: " + err.message, true));
}

// --- URUCHAMIANIE I DYNAMIKA ---

function runCode() {
    const code = pythonEdited ? document.getElementById('pythonEditor').value : Blockly.Python.workspaceToCode(workspace);
    logStatus("Wysyłam kod...");

    fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: code
    })
    .then(res => res.text())
    .then(data => {
        logStatus("Kod uruchomiony pomyślnie!");
        refreshButtons(); // <--- ODŚWIEŻA PRZYCISKI PO KAŻDYM RUN
    })
    .catch(err => logStatus("Błąd połączenia!", true));
}

function refreshButtons() {
    fetch('/get_buttons')
        .then(res => res.json())
        .then(btns => {
            const container = document.getElementById('panelDiv');
            container.innerHTML = '<h3>PANEL STEROWANIA</h3>';
            btns.forEach(name => {
                const btn = document.createElement('button');
                btn.className = 'btn-control';
                btn.innerText = name;
                btn.onclick = () => fetch('/click?name=' + name); // Twój endpoint /click
                container.appendChild(btn);
            });
        })
        .catch(err => console.log("Brak dynamicznych przycisków"));
}

// Obsługa kliknięć na Padzie (Góra, Dół itd.)
function sendJoy(val) {
    fetch('/click?name=' + val)
        .then(res => logStatus("Komenda: " + val))
        .catch(err => logStatus("Błąd sterowania", true));
}

// Inicjalizacja przy zmianach w klockach
workspace.addChangeListener(() => {
    if (document.getElementById('pythonDiv').style.display === 'flex') {
        updatePythonPreview();
    }
});

// Czekamy, aż wszystko (obrazki, skrypty, klocki) się załaduje
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader) {
        // Małe opóźnienie, żeby uczeń nacieszył oko puzzlami
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                logStatus("System gotowy!");
            }, 500); // Czas trwania przejścia CSS
        }, 1000); 
    }
});

// Nasłuchiwanie zmian w klockach dla podglądu Python
workspace.addChangeListener(() => {
    if (document.getElementById('pythonDiv') && document.getElementById('pythonDiv').style.display === 'flex') {
        updatePythonPreview();
    }
});

// --- OBSŁUGA STARTU I PROFILU ---

function initApp() {
    // 1. Pobierz dane o płytce z serwera
    fetch('/get_profile')
        .then(res => res.json())
        .then(data => {
            const msg = document.getElementById('loader-msg');
            if (msg) {
                // Wyświetlamy nazwę i statystyki pod puzzlami
                msg.innerHTML = `
                    <b style="color:#e67e22">${data.name}</b><br>
                    <small style="color:#bdc3c7; font-size:0.8em;">
                        RAM: ${data.ram_free} | CPU: ${data.cpu_temp}
                    </small>`;
            }
            
            // Jeśli to okrągły ekran, możemy dostosować UI
            if (data.ui === 'round') {
                document.body.classList.add('round-screen');
                // Zaokrąglamy puzzle w SVG
                document.querySelectorAll('.piece').forEach(p => p.setAttribute('rx', '20'));
            }
        })
        .catch(err => console.log("Tryb offline lub brak profilu"));

    // 2. Wyłącz loader, gdy cała strona (Blockly) się załaduje
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    logStatus("System gotowy.");
                }, 500);
            }, 1000); // Dajemy 1s na nacieszenie oka animacją
        }
    });
}

// Uruchom inicjalizację
initApp();

// Dokończenie Twojej uciętej funkcji refreshButtons
function refreshButtons() {
    fetch('/get_buttons')
        .then(res => res.json())
        .then(btns => {
            const container = document.getElementById('panelDiv');
            if (!container) return;
            container.innerHTML = '<h3>PANEL STEROWANIA</h3>';
            btns.forEach(name => {
                const btn = document.createElement('button');
                btn.className = 'btn-control';
                btn.innerText = name;
                btn.onclick = () => fetch('/click?name=' + name);
                container.appendChild(btn);
            });
        });
}

