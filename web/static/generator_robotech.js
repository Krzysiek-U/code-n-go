Blockly.Python['pilot_add_button'] = function(block) {
  var label = block.getFieldValue('LABEL');
  var branch = Blockly.Python.statementToCode(block, 'DO') || "  pass\n";
  return "#PANEL:" + label + ":" + btoa(branch) + "\n";
};

Blockly.Python['pilot_on_joy'] = function(block) {
  var key = block.getFieldValue('KEY');
  var branch = Blockly.Python.statementToCode(block, 'DO') || "  pass\n";
  return "#JOY:" + key + ":" + btoa(branch) + "\n";
};

Blockly.Python['led_on'] = function(block) { return "machine.Pin(22, machine.Pin.OUT).value(0)\n"; };
Blockly.Python['led_off'] = function(block) { return "machine.Pin(22, machine.Pin.OUT).value(1)\n"; };
Blockly.Python['wait_ms'] = function(block) { return "time.sleep_ms(" + block.getFieldValue('MS') + ")\n"; };
