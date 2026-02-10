// --- BLOKI STEROWANIA (PAD / PILOT) ---

Blockly.Blocks['pilot_add_button'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Dodaj przycisk:")
        .appendField(new Blockly.FieldTextInput("AKCJA"), "LABEL");
    this.appendStatementInput("DO")
        .appendField("wykonaj:");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#e67e22");
  }
};

Blockly.Blocks['pilot_on_joy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Kiedy na PILOCIE kliknę:")
        .appendField(new Blockly.FieldDropdown([
            ["▲ Góra", "GÓRA"], 
            ["▼ Dół", "DÓŁ"], 
            ["◀ Lewo", "LEWO"], 
            ["▶ Prawo", "PRAWO"],
            ["■ STOP", "STOP"],      // Środkowy przycisk 3x3
            ["Przycisk 1", "1"], 
            ["Przycisk 2", "2"], 
            ["Przycisk 3", "3"], 
            ["Przycisk 4", "4"]
        ]), "KEY");
    this.appendStatementInput("DO")
        .appendField("wykonaj:");
    this.setPreviousStatement(true); 
    this.setNextStatement(true); 
    this.setColour("#2c3e50");
  }
};

// --- BLOKI WYKONAWCZE (LED / SERWO / CZEKAJ) ---

Blockly.Blocks['led_on'] = {
  init: function() {
    this.appendDummyInput().appendField("Włącz LED");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#2c3e50");
  }
};

Blockly.Blocks['led_off'] = {
  init: function() {
    this.appendDummyInput().appendField("Wyłącz LED");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#2c3e50");
  }
};

Blockly.Blocks['wait_ms'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("czekaj")
        .appendField(new Blockly.FieldTextInput("200"), "MS")
        .appendField("ms");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#f1c40f");
  }
};

Blockly.Blocks['servo_move'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Serwo pin")
        .appendField(new Blockly.FieldTextInput("27"), "PIN")
        .appendField("kąt")
        .appendField(new Blockly.FieldNumber(90, 0, 180), "ANGLE");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#ff5722");
  }
};

// --- BLOKI EKRANU (LCD) ---

Blockly.Blocks['screen_print'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Pisz:")
        .appendField(new Blockly.FieldTextInput("Hej!"), "MSG");
    this.appendDummyInput()
        .appendField("linia")
        .appendField(new Blockly.FieldDropdown([["0","0"],["1","1"],["2","2"],["3","3"]]), "LINE");
    this.appendDummyInput()
        .appendField("kolor")
        .appendField(new Blockly.FieldDropdown([
            ["Biały","0xFFFF"],
            ["Zielony","0x07E0"],
            ["Czerwony","0xF800"],
            ["Niebieski","0x001F"]
        ]), "COL"); // Zmienione z COLOR na COL, by pasowało do Twojego generatora
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#3498db");
  }
};

Blockly.Blocks['screen_rect'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Prostokąt X:")
        .appendField(new Blockly.FieldTextInput("10"), "X")
        .appendField("Y:")
        .appendField(new Blockly.FieldTextInput("10"), "Y");
    this.appendDummyInput()
        .appendField("Szer:")
        .appendField(new Blockly.FieldTextInput("50"), "W")
        .appendField("Wys:")
        .appendField(new Blockly.FieldTextInput("50"), "H");
    this.appendDummyInput()
        .appendField("kolor")
        .appendField(new Blockly.FieldDropdown([["Biały","0xFFFF"],["Zielony","0x07E0"],["Czerwony","0xF800"]]), "COL");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#3498db");
  }
};

Blockly.Blocks['screen_clear'] = {
  init: function() {
    this.appendDummyInput().appendField("Wyczyść ekran");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#3498db");
  }
};
