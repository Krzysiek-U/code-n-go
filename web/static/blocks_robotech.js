Blockly.Blocks['pilot_add_button'] = {
  init: function() {
    this.appendDummyInput().appendField("Dodaj przycisk:").appendField(new Blockly.FieldTextInput("AKCJA"), "LABEL");
    this.appendStatementInput("DO").appendField("wykonaj:");
    this.setPreviousStatement(true); this.setNextStatement(true); this.setColour("#e67e22");
  }
};

Blockly.Blocks['pilot_on_joy'] = {
  init: function() {
    this.appendDummyInput().appendField("Kiedy na PILOCIE kliknę:")
        .appendField(new Blockly.FieldDropdown([["▲ Góra","GÓRA"], ["▼ Dół","DÓŁ"], ["◀ Lewo","LEWO"], ["▶ Prawo","PRAWO"], ["Przycisk 1","1"], ["Przycisk 2","2"], ["Przycisk 3","3"], ["Przycisk 4","4"]]), "KEY");
    this.appendStatementInput("DO").appendField("wykonaj:");
    this.setPreviousStatement(true); this.setNextStatement(true); this.setColour("#2c3e50");
  }
};

Blockly.Blocks['led_on'] = { init: function() { this.appendDummyInput().appendField("Włącz LED"); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour("#2c3e50"); } };
Blockly.Blocks['led_off'] = { init: function() { this.appendDummyInput().appendField("Wyłącz LED"); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour("#2c3e50"); } };
Blockly.Blocks['wait_ms'] = { init: function() { this.appendDummyInput().appendField("czekaj").appendField(new Blockly.FieldTextInput("200"), "MS").appendField("ms"); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour("#f1c40f"); } };
