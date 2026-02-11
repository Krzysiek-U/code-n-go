import lvgl as lv
import time
from machine import Pin
import lcd_bus

# 1. Start LVGL (Silnik graficzny)
lv.init()

# 2. Piny Waveshare 1.85 (ST77916 QSPI)
Pin(16, Pin.OUT).value(1) # Podświetlenie ON
rst = Pin(17, Pin.OUT)
rst.value(0); time.sleep_ms(50); rst.value(1); time.sleep_ms(50)

# 3. Magistrala QSPI (Kluczowe dla Waveshare!)
bus = lcd_bus.QSPIBus(sck=46, cs=1, data0=44, data1=43, data2=0, data3=2)

# 4. Ekran 280x456
draw_buf = lv.draw_buf_create(280, 100, lv.COLOR_FORMAT.RGB565, 0)
disp = lv.display_create(280, 456)
disp.set_draw_buf(draw_buf)

# --- TUTAJ TWOJA LOGIKA Z CODE-N-GO ---
scr = lv.screen_active()
lbl = lv.label(scr)
lbl.set_text("Code-n-go: SYSTEM OK")
lbl.align(lv.ALIGN.CENTER, 0, 0)
