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
        .appendField(new Blockly.FieldDropdown([
            ["▲ Góra", "GÓRA"], 
            ["▼ Dół", "DÓŁ"], 
            ["◀ Lewo", "LEWO"], 
            ["▶ Prawo", "PRAWO"],
            ["■ STOP", "STOP"],      // <--- Dodany środkowy przycisk
            ["Przycisk 1", "1"], 
            ["Przycisk 2", "2"], 
            ["Przycisk 3", "3"], 
            ["Przycisk 4", "4"]
        ]), "KEY");
    this.appendStatementInput("DO").appendField("wykonaj:");
    this.setPreviousStatement(true); 
    this.setNextStatement(true); 
    this.setColour("#2c3e50");
  }
};



Blockly.Blocks['servo_move'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Serwo pin")
        .appendField(new Blockly.FieldTextInput("27"), "PIN")
        .appendField("kąt")
        .appendField(new Blockly.FieldNumber(90, 0, 180), "ANGLE"); // Zwykłe pole liczbowe
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#ff5722");
  }
};

// === BLOKI ekran start ===

Blockly.Blocks['screen_print'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Pisz:")
        .appendField(new Blockly.FieldTextInput("Hej!"), "MSG") // KLUCZ: MSG
        .appendField("linia")
        .appendField(new Blockly.FieldDropdown([["0","0"],["1","1"],["2","2"],["3","3"]]), "LINE") // KLUCZ: LINE
        .appendField("kolor")
        .appendField(new Blockly.FieldDropdown([["Zielony","0x07E0"],["Czerwony","0xF800"],["Biały","0xFFFF"]]), "COL"); // KLUCZ: COL
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#3498db");
  }
};

Blockly.Blocks['screen_rect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Prostokąt X:")
        .appendField(new Blockly.FieldTextInput("10"), "X") // KLUCZ: X
        .appendField("Y:")
        .appendField(new Blockly.FieldTextInput("10"), "Y") // KLUCZ: Y
        .appendField("Szer:")
        .appendField(new Blockly.FieldTextInput("50"), "W") // KLUCZ: W
        .appendField("Wys:")
        .appendField(new Blockly.FieldTextInput("50"), "H") // KLUCZ: H
        .appendField("Kolor")
        .appendField(new Blockly.FieldDropdown([["Czerwony","0xF800"],["Zielony","0x07E0"]]), "COL"); // KLUCZ: COL
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#3498db");
  }
};


Blockly.Blocks['screen_clear'] = {
  init: function() {
    this.appendDummyInput().appendField("Wyczyść ekran");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#3498db");
  }
};

// ==== ekran koniec ========

Blockly.Blocks['led_on'] = { init: function() { this.appendDummyInput().appendField("Włącz LED"); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour("#2c3e50"); } };
Blockly.Blocks['led_off'] = { init: function() { this.appendDummyInput().appendField("Wyłącz LED"); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour("#2c3e50"); } };
Blockly.Blocks['wait_ms'] = { init: function() { this.appendDummyInput().appendField("czekaj").appendField(new Blockly.FieldTextInput("200"), "MS").appendField("ms"); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour("#f1c40f"); } };
