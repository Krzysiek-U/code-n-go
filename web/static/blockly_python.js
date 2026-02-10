// --- GENERATOR: PILOT / PAD ---

Blockly.Python.forBlock['pilot_add_button'] = function(block) {
  var label = block.getFieldValue('LABEL').replace(/\s+/g, '_'); 
  var branch = Blockly.Python.statementToCode(block, 'DO') || "    pass\n";
  
  // Tworzymy czystą funkcję def
  var funcName = "btn_" + label;
  var code = "def " + funcName + "():\n" + branch + "\n";
  
  // Rejestrujemy definicję, która trafi na górę okienka Python
  Blockly.Python.definitions_['btn_def_' + label] = code;

  // NIC NIE ZWRACAMY w miejscu klocka (usuwamy słownik buttons)
  return ""; 
};



Blockly.Python.forBlock['pilot_on_joy'] = function(block) {
  var key = block.getFieldValue('KEY');
  var branch = Blockly.Python.statementToCode(block, 'DO') || "    pass\n";
  
  var funcName = "btn_" + key;
  var code = "def " + funcName + "():\n" + branch + "\n";
  
  Blockly.Python.definitions_['btn_def_' + key] = code;
  return ""; 
};



// --- GENERATOR: LED ---

Blockly.Python.forBlock['led_on'] = function(block) {
  Blockly.Python.definitions_['import_machine'] = 'import machine';
  return "machine.Pin(22, machine.Pin.OUT).value(0)\n";
};

Blockly.Python.forBlock['led_off'] = function(block) {
  Blockly.Python.definitions_['import_machine'] = 'import machine';
  return "machine.Pin(22, machine.Pin.OUT).value(1)\n";
};

// --- GENERATOR: CZAS I PĘTLE ---

Blockly.Python.forBlock['wait_ms'] = function(block) {
  var ms = block.getFieldValue('MS');
  Blockly.Python.definitions_['import_time'] = 'import time';
  return "time.sleep_ms(" + ms + ")\n";
};

Blockly.Python.forBlock['controls_repeat_ext'] = function(block) {
  var repeats = Blockly.Python.valueToCode(block, 'TIMES', Blockly.Python.ORDER_NONE) || '0';
  var branch = Blockly.Python.statementToCode(block, 'DO') || "  pass\n";
  return 'for count in range(' + repeats + '):\n' + branch;
};

// --- GENERATOR: SERWO ---

Blockly.Python.forBlock['servo_move'] = function(block) {
    var pin = block.getFieldValue('PIN');
    var angle = block.getFieldValue('ANGLE');
    var varName = 'srv_' + pin;

    // 1. IMPORTY - Używamy stałych kluczy, aby Blockly je scaliło w jeden
    Blockly.Python.definitions_['import_servo'] = 'from servo import Servo';
    Blockly.Python.definitions_['import_machine'] = 'import machine';

    // 2. INICJALIZACJA - Tutaj klucz musi być unikalny dla PINU (init_srv_27)
    // Dzięki temu dla każdego pinu powstanie tylko jedna linia if
    Blockly.Python.definitions_['init_' + varName] = 
        'if "' + varName + '" not in globals(): ' + varName + ' = Servo(machine.Pin(' + pin + '))';

    return varName + '.write_angle(' + angle + ')\n';
};


// --- GENERATOR: EKRAN (LCD) ---

Blockly.Python.forBlock['screen_print'] = function(block) {
  var msg = block.getFieldValue('MSG');
  var line = block.getFieldValue('LINE');
  var col = block.getFieldValue('COL');
  Blockly.Python.definitions_['import_screen'] = 'import screen';
  return "screen.print_line('" + msg + "', " + line + ", " + col + ")\n";
};

Blockly.Python.forBlock['screen_rect'] = function(block) {
  var x = block.getFieldValue('X');
  var y = block.getFieldValue('Y');
  var w = block.getFieldValue('W');
  var h = block.getFieldValue('H');
  var col = block.getFieldValue('COL');
  Blockly.Python.definitions_['import_screen'] = 'import screen';
  // Dodajemy zabezpieczenie, by nie wywaliło błędu gdyby LCD nie był zainicjowany
  return "if screen.fb: screen.fb.fill_rect(" + x + ", " + y + ", " + w + ", " + h + ", " + col + ")\n";
};

Blockly.Python.forBlock['screen_clear'] = function(block) {
  Blockly.Python.definitions_['import_screen'] = 'import screen';
  return "screen.fill(0x0000)\n";
};
