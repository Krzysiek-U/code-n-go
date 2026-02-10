Blockly.Python['pilot_add_button'] = function(block) {
  var label = block.getFieldValue('LABEL');
  var branch = (Blockly.Python.statementToCode(block, 'DO') || "pass\n").trim();
  return "#PANEL:" + label + ":" + btoa(branch) + "\n";
};

Blockly.Python['pilot_on_joy'] = function(block) {
  var key = block.getFieldValue('KEY');
  var branch = (Blockly.Python.statementToCode(block, 'DO') || "pass\n").trim();
  return "#JOY:" + key + ":" + btoa(branch) + "\n";
};

// --- LED ON ---
Blockly.Python['led_on'] = function(block) {
  // To sprawi, że 'import machine' pojawi się na samym początku skryptu (tylko raz)
  Blockly.Python.definitions_['import_machine'] = 'import machine';
  return "machine.Pin(22, machine.Pin.OUT).value(0)\n";
};

// --- LED OFF ---
Blockly.Python['led_off'] = function(block) {
  Blockly.Python.definitions_['import_machine'] = 'import machine';
  return "machine.Pin(22, machine.Pin.OUT).value(1)\n";
};

// --- CZEKAJ MS ---
Blockly.Python['wait_ms'] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';
  var ms = block.getFieldValue('MS');
  return "time.sleep_ms(" + ms + ")\n";
};

// --- PĘTLA (Upewnij się, że tak wygląda) ---
Blockly.Python['controls_repeat_ext'] = function(block) {
  var repeats = Blockly.Python.valueToCode(block, 'TIMES', Blockly.Python.ORDER_NONE) || '0';
  var branch = Blockly.Python.statementToCode(block, 'DO') || "  pass\n";
  return 'for count in range(' + repeats + '):\n' + branch;
};

Blockly.Python['servo_move'] = function(block) {
  var pin = block.getFieldValue('PIN');
  var angle = block.getFieldValue('ANGLE');
  var varName = 'srv_' + pin;

  // Importy i inicjalizacja obiektu w jednej sekcji
  Blockly.Python.definitions_['import_servo_' + pin] = 
    'from servo import Servo; import machine; global ' + varName + '; ' +
    varName + ' = Servo(machine.Pin(' + pin + '))';

  // Zwracamy tylko ruch
  return varName + '.write_angle(' + angle + ')\n';
};



//---- LCD --

//---- LCD POPRAWIONY ----

// Klocek: Wypisz tekst (Pobiera z pola wewnątrz klocka)
Blockly.Python['screen_print'] = function(block) {
  var msg = block.getFieldValue('MSG');  // MSG zgadza się z definicją wyżej
  var line = block.getFieldValue('LINE');
  var col = block.getFieldValue('COL');
  Blockly.Python.definitions_['import_screen'] = 'import screen';
  return "screen.print_line('" + msg + "', " + line + ", " + col + ")\n";
};

// Klocek: Rysuj prostokąt (Pobiera liczby z pól wewnątrz klocka)
Blockly.Python['screen_rect'] = function(block) {
  var x = block.getFieldValue('X');
  var y = block.getFieldValue('Y');
  var w = block.getFieldValue('W');
  var h = block.getFieldValue('H');
  var col = block.getFieldValue('COL');
  Blockly.Python.definitions_['import_screen'] = 'import screen';
  return "if screen.fb: screen.fb.fill_rect(" + x + ", " + y + ", " + w + ", " + h + ", " + col + ")\n";
};
