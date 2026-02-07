var joyCommands = {}; 
var workspace = Blockly.inject('blocklyDiv', { 
    toolbox: document.getElementById('toolbox'), 
    theme: Blockly.Themes.Zelos, 
    renderer: 'zelos' 
});

function switchTab(tab) {
    document.getElementById('blocklyDiv').style.display = (tab === 'blocks') ? 'block' : 'none';
    document.getElementById('panelDiv').style.display = (tab === 'panel') ? 'block' : 'none';
    document.getElementById('pilotDiv').style.display = (tab === 'pilot') ? 'block' : 'none';
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    if (tab === 'blocks') Blockly.svgResize(workspace);
}

function sendJoy(key) {
    if (joyCommands[key]) { fetch('/run', { method: 'POST', body: joyCommands[key] }); }
}

function runCode() {
    var fullCode = Blockly.Python.workspaceToCode(workspace);
    var lines = fullCode.split('\n');
    joyCommands = {};
    document.getElementById('customButtons').innerHTML = '';

    lines.forEach(line => {
        if (line.startsWith("#PANEL:")) {
            var parts = line.split(':');
            let btn = document.createElement('button'); btn.className = 'btn-control'; btn.innerHTML = parts[1];
            let rawCode = atob(parts[2]);
            let cleanCode = "import machine, time\n" + rawCode.split('\n').map(l => l.startsWith('  ') ? l.substring(2) : l).join('\n');
            btn.onclick = function() { fetch('/run', { method: 'POST', body: cleanCode }); };
            document.getElementById('customButtons').appendChild(btn);
        } else if (line.startsWith("#JOY:")) {
            var parts = line.split(':');
            let rawCode = atob(parts[2]);
            joyCommands[parts[1]] = "import machine, time\n" + rawCode.split('\n').map(l => l.startsWith('  ') ? l.substring(2) : l).join('\n');
        }
    });
    alert("Zsynchronizowano!");
}

function trySetLocale() {
    if (typeof Blockly.Msg !== 'undefined' && Blockly.Msg['pl']) { Blockly.setLocale(Blockly.Msg['pl']); }
    else { setTimeout(trySetLocale, 500); }
}
trySetLocale();
