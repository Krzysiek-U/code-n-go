let pythonEdited = false; // Flaga śledząca ręczne zmiany
var joyCommands = {}; 
var workspace = Blockly.inject('blocklyDiv', { 
    toolbox: document.getElementById('toolbox'), 
    theme: Blockly.Themes.Zelos, 
    renderer: 'zelos' 
});

if (Blockly.Python) {
    Blockly.Python.INDENT = '    ';
    logStatus("Generator Python załadowany.");
} else {
    logStatus("BŁĄD: Brak biblioteki python_compressed.js!", true);
}

// --- FUNKCJA PASKA STATUSU ---
function logStatus(msg, isError = false) {
    const msgDiv = document.getElementById('status-msg');
    if (!msgDiv) return;
    msgDiv.innerText = msg;
    msgDiv.style.color = isError ? "#e74c3c" : "#2ecc71";
    setTimeout(() => { msgDiv.style.color = "#bdc3c7"; }, 3000);
}

// --- KOLOROWANIE SKŁADNI (WIZUALNE) ---
function highlightPython(code) {
    if(!code) return "";
    
    // 1. Zamiana znaków specjalnych na bezpieczne encje (zapobiega błędom HTML)
    let clean = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // 2. Kolorowanie - używamy prostych zamian, które nie gryzą się ze sobą
    return clean
        .replace(/(#.*)/g, '<span style="color:#6a9955;">$1</span>') // Komentarze
        .replace(/\b(import|from|def|if|else|elif|for|while|return|async|await|try|except|machine|time|uart|onewire)\b/g, '<span style="color:#c586c0;">$1</span>') // Słowa kluczowe
        .replace(/("(.*?)"|'(.*?)')/g, '<span style="color:#ce9178;">$1</span>') // Stringi
        .replace(/\b(\d+)\b/g, '<span style="color:#b5cea8;">$1</span>'); // Tylko całe liczby (nie w kolorach!)
}


// --- AKTUALIZACJA EDYTORA (LINIE + KOLORY) ---
function updateEditor() {
    const editor = document.getElementById('pythonEditor');
    const highlight = document.getElementById('pythonHighlight');
    const lineNumbers = document.getElementById('lineNumbers');
    if (!editor) return;

    const code = editor.value;
    
    // Numery linii
    const lines = code.split('\n');
    lineNumbers.innerHTML = lines.map((_, i) => i + 1).join('<br>');

    // Kolorowanie (pod spodem)
    if (highlight) {
        highlight.innerHTML = highlightPython(code) + "\n";
    }
}

// --- PRZEŁĄCZANIE ZAKŁADEK ---

function switchTab(tab) {
    const activeTabBtn = document.querySelector('.tab.active');
    const currentTab = activeTabBtn ? activeTabBtn.id.replace('tab-', '') : 'blocks';

    // 1. Walidacja powrotu z edycji ręcznej
    if (currentTab === 'python' && tab === 'blocks' && pythonEdited) {
        if (!confirm("Zmiany wprowadzone ręcznie w Pythonie NIE zostaną przeniesione do klocków. Czy na pewno chcesz wrócić i utracić te zmiany?")) {
            return; 
        }
        pythonEdited = false; 
    }

    // 2. Zarządzanie widocznością kontenerów
    const divs = ['blocklyDiv', 'panelDiv', 'pilotDiv', 'pythonDiv'];
    divs.forEach(div => {
        const el = document.getElementById(div);
        if (el) el.style.display = 'none';
    });

    let targetId = (tab === 'blocks') ? 'blocklyDiv' : tab + 'Div';
    const targetEl = document.getElementById(targetId);
    if (targetEl) targetEl.style.display = (tab === 'python') ? 'flex' : 'block';

    // 3. Aktualizacja przycisków i PASKA STANU (Nowość!)
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');

    const infoDiv = document.getElementById('status-info');
    if (infoDiv) {
        if (tab === 'blocks') {
            infoDiv.innerText = "EDYCJA: Blockly (.xml)";
            infoDiv.style.color = "#3498db"; 
        } else if (tab === 'python') {
            infoDiv.innerText = "EDYCJA: Python (.py)";
            infoDiv.style.color = "#f1c40f"; 
        } else {
            infoDiv.innerText = "WIDOK: " + tab.toUpperCase();
            infoDiv.style.color = "#bdc3c7";
        }
    }

    // 4. Logika specyficzna dla zakładki
    if (tab === 'blocks') {
        setTimeout(() => { Blockly.svgResize(workspace); }, 50);
    } 
    else if (tab === 'python') {
        if (!pythonEdited) {
            try {
                let rawCode = Blockly.Python.workspaceToCode(workspace);
                const editor = document.getElementById('pythonEditor');
                const lineNumbers = document.getElementById('lineNumbers');

                if (editor) {
                    let displayCode = "";
                    const lines = rawCode.split('\n');

                    lines.forEach(line => {
                        if (line.startsWith("#PANEL:") || line.startsWith("#JOY:")) {
                            let parts = line.split(':');
                            try {
                                let decoded = atob(parts[2]); 
                                displayCode += `${parts[0]}:${parts[1]}:\n`;
                                displayCode += decoded.split('\n').map(l => "    " + l).join('\n') + "\n";
                            } catch(e) { displayCode += line + "\n"; }
                        } else {
                            displayCode += line + "\n";
                        }
                    });

                    editor.value = displayCode.trim() || "# Przeciągnij bloki...";
                    const lineCount = editor.value.split('\n').length;
                    lineNumbers.innerHTML = Array.from({length: lineCount}, (_, i) => i + 1).join('<br>');
                }
                logStatus("Podgląd Python gotowy.");
            } catch (e) {
                logStatus("Błąd konwersji!", true);
                console.error(e);
            }
        } else {
            logStatus("Tryb edycji ręcznej - klocki są zablokowane.");
        }
    }
}




// --- SYNCHRONIZACJA I URUCHAMIANIE ---
function runCode() {
    let codeToRun = "";
    const activeTabBtn = document.querySelector('.tab.active');
    const isPythonTab = activeTabBtn && activeTabBtn.id === 'tab-python';

    if (isPythonTab) {
        codeToRun = document.getElementById('pythonEditor').value;
        logStatus("Uruchamiam kod z edytora...");
    } else {
        codeToRun = Blockly.Python.workspaceToCode(workspace);
        logStatus("Synchronizuję i uruchamiam...");
        
        // Parsowanie PANEL/JOY (tylko przy uruchomieniu z bloków)
        var lines = codeToRun.split('\n');
        joyCommands = {};
        const cb = document.getElementById('customButtons');
        if(cb) cb.innerHTML = '';
        
        lines.forEach(line => {
            if (line.startsWith("#PANEL:")) {
                var parts = line.split(':');
                let btn = document.createElement('button'); 
                btn.className = 'btn-control'; 
                btn.innerHTML = parts[1];
                let rawCode = atob(parts[2]);
                let cleanCode = "import machine, time\n" + rawCode.split('\n').map(l => l.startsWith('  ') ? l.substring(2) : l).join('\n');
                btn.onclick = function() { fetch('/run', { method: 'POST', body: cleanCode }); };
                cb.appendChild(btn);
            } else if (line.startsWith("#JOY:")) {
                var parts = line.split(':');
                let rawCode = atob(parts[2]);
                joyCommands[parts[1]] = "import machine, time\n" + rawCode.split('\n').map(l => l.startsWith('  ') ? l.substring(2) : l).join('\n');
            }
        });
    }

    fetch('/run', { method: 'POST', body: codeToRun });
}

// --- EVENTY EDYTORA ---
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('pythonEditor');
    if (editor) {
        // Zdarzenie wpisywania tekstu
        editor.addEventListener('input', () => {
            pythonEdited = true; // Flaga: użytkownik edytuje ręcznie
            updateEditor();      // Odśwież numery linii
            logStatus("Tryb edycji ręcznej (Bloki odłączone)");
        });

        // Synchronizacja przewijania (jeśli używasz warstwy highlight)
        editor.addEventListener('scroll', () => {
            const highlight = document.getElementById('pythonHighlight');
            if (highlight) highlight.scrollTop = editor.scrollTop;
        });

        // Obsługa klawisza TAB (z zachowaniem flagi edycji)
        editor.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                pythonEdited = true; // Tabulator to też edycja!
                var start = this.selectionStart;
                var end = this.selectionEnd;
                this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 4;
                updateEditor();
            }
        });
    }
});


// --- STANDARDOWE FUNKCJE SYSTEMOWE ---
function trySetLocale() {
    if (typeof Blockly.Msg !== 'undefined' && Blockly.Msg['pl']) { 
        Blockly.setLocale(Blockly.Msg['pl']); 
        logStatus("System gotowy.");
    }
    else { setTimeout(trySetLocale, 500); }
}
trySetLocale();

async function saveProject() {
    const activeTab = document.querySelector('.tab.active').id;
    let name, data, extension;

    if (activeTab === 'tab-python') {
        name = prompt("Podaj nazwę skryptu Python (bez .py):", "moj_skrypt");
        if (!name) return;
        data = document.getElementById('pythonEditor').value;
        extension = ".py";
    } else {
        name = prompt("Podaj nazwę projektu klocków:", "moj_projekt");
        if (!name) return;
        const xml = Blockly.Xml.workspaceToDom(workspace);
        data = Blockly.Xml.domToText(xml);
        extension = ".xml";
    }

    // Czyścimy nazwę z ewentualnych kropek wpisanych przez użytkownika
    let cleanName = name.split('.')[0];
    const fileName = cleanName + extension;

    try {
        const response = await fetch('/save_project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: fileName, data: data }) // USUNIĘTO + ".xml"
        });
        
        if (response.ok) {
            logStatus("Zapisano plik: " + fileName);
            if (activeTab === 'tab-python') pythonEdited = false;
        } else {
            logStatus("Błąd serwera przy zapisie!", true);
        }
    } catch (e) { 
        logStatus("Błąd połączenia!", true); 
    }
}




async function loadProject() {
    try {
        const response = await fetch('/list_projects');
        const files = await response.json();
        const listDiv = document.getElementById('fileList');
        if(!listDiv) return;
        listDiv.innerHTML = ''; 
        
        files.forEach(file => {
            let btn = document.createElement('div');
            btn.innerHTML = file; 
            btn.className = "file-item";
            
            // Stylizacja przycisku (Wysoki i czytelny dla dotyku)
            btn.style.padding = "15px";
            btn.style.margin = "8px";
            btn.style.background = "#34495e";
            btn.style.borderRadius = "10px";
            btn.style.textAlign = "center";
            btn.style.cursor = "pointer";
            btn.style.fontWeight = "bold";

            btn.onclick = async () => {
                document.getElementById('fileModal').style.display = 'none';
                const res = await fetch(`/load_project?name=${file}`);
                const content = await res.text();
                
                // INTELIGENTNE ŁADOWANIE
                if (file.endsWith('.py')) {
                    // 1. To jest skrypt Python
                    switchTab('python'); // Przełącz na zakładkę edytora
                    document.getElementById('pythonEditor').value = content;
                    pythonEdited = true; // Zablokuj automatyczne nadpisywanie przez klocki
                    updateEditor();      // Odśwież numery linii
                    logStatus("Wczytano skrypt Python: " + file);
                } else {
                    // 2. To jest projekt Blockly (XML)
                    workspace.clear();
                    try {
                        const xml = Blockly.utils.xml.textToDom(content);
                        Blockly.Xml.domToWorkspace(xml, workspace);
                    } catch(e) {
                        const xml = Blockly.Xml.textToDom(content);
                        Blockly.Xml.domToWorkspace(xml, workspace);
                    }
                    pythonEdited = false; // Pozwól na generowanie kodu z bloków
                    switchTab('blocks'); // Wróć do widoku klocków
                    logStatus("Wczytano projekt klocków: " + file);
                }
            };
            listDiv.appendChild(btn);
        });
        document.getElementById('fileModal').style.display = 'flex';
    } catch (e) { 
        logStatus("Błąd odczytu listy plików!", true); 
        console.error(e);
    }
}


function newProject() {
    if (confirm("Wyczyścić?")) { workspace.clear(); logStatus("Wyczyszczono."); }
}

function sendJoy(key) {
    if (joyCommands[key]) { fetch('/run', { method: 'POST', body: joyCommands[key] }); }
}


// ==========================================
// INTELIGENTNE BLOKI CODE-N-GO (ATtiny / ESP)
// ==========================================

// --- GENERATOR: Dodaj przycisk PANELU ---
Blockly.Python['pilot_add_button'] = function(block) {
  var label = block.getFieldValue('LABEL');
  var branch = Blockly.Python.statementToCode(block, 'DO');
  // Kodujemy zawartość do Base64 dla Twojego parsera w app.js
  var base64Code = btoa(branch || "pass");
  return '#PANEL:' + label + ':' + base64Code + '\n';
};

// --- GENERATOR: Obsługa JOYSTICKA (Pad) ---
Blockly.Python['pilot_on_joy'] = function(block) {
  var key = block.getFieldValue('KEY');
  var branch = Blockly.Python.statementToCode(block, 'DO');
  var base64Code = btoa(branch || "pass");
  // Twój system rozpozna to jako konfigurację przycisku na Padzie
  return '#JOY:' + key + ':' + base64Code + '\n';
};

// --- GENERATOR: LED ON (z opcją ATtiny w przyszłości) ---
Blockly.Python['led_on'] = function(block) {
  // Tu możesz dodać logikę if(pin >= 30) jak ustalaliśmy
  return "import machine\nmachine.Pin(2, machine.Pin.OUT).value(1) # LED ON\n";
};

// --- GENERATOR: LED OFF ---
Blockly.Python['led_off'] = function(block) {
  return "import machine\nmachine.Pin(2, machine.Pin.OUT).value(0) # LED OFF\n";
};

// --- GENERATOR: Czekaj MS ---
Blockly.Python['wait_ms'] = function(block) {
  var ms = block.getFieldValue('MS');
  return "import time\ntime.sleep_ms(" + ms + ")\n";
};
