import machine
import gc

# Zmienne globalne
fb = None
bg_color = 0
color = 1

def init():
    global fb, bg_color, color
    if fb is not None: return True
    
    gc.collect()
    
    # 1. PRÓBA: ST7789 (TFT 240x240)
    try:
        import st7789
        spi = machine.SPI(2, baudrate=10000000, polarity=0, phase=0, sck=machine.Pin(18), mosi=machine.Pin(23))
        fb = st7789.ST7789(
            spi, 240, 240,
            reset=machine.Pin(17, machine.Pin.OUT),  
            dc=machine.Pin(16, machine.Pin.OUT),
            cs=machine.Pin(5, machine.Pin.OUT)
        ) 
        bg_color = fb.color565(250,250,250)
        color = fb.color565(20,20,200)
        fb.init()
        fb.fill(bg_color)
        return True
    except:
        fb = None

    # 2. PRÓBA: SSD1306 (OLED I2C)
    if fb is None:
        try:
            from machine import Pin, I2C
            from ssd1306 import SSD1306_I2C
            i2c = I2C(0, scl=Pin(5), sda=Pin(4))
            fb = SSD1306_I2C(128, 64, i2c)
            bg_color, color = 0, 1
            return True
        except:
            fb = None

    # 3. PRÓBA: ILI9163
    if fb is None:
        try:
            from machine import Pin, SPI
            from ili9163 import ILI9163_SPI
            spi = machine.SPI(2, sck=Pin(18), mosi=Pin(23))
            fb = ILI9163_SPI(128, 128, spi, Pin(2), Pin(4), Pin(15))
            bg_color, color = 0, 1
            return True
        except:
            fb = None
    
    return fb is not None

def print_line(msg, line, c=None):
    global color, fb
    if fb is None:
        print('LOG: ' + str(msg))
        return

    if c is None: c = color
    
    # Parametry zależne od typu ekranu
    is_tft = hasattr(fb, 'width') and fb.width == 240
    line_h = 20 if is_tft else 8
    nudge_y = 4
    
    # Czyścimy tło pod linią
    fb.fill_rect(0, line * line_h + nudge_y, fb.width, line_h, bg_color)
    
    # Rysujemy tekst
    if hasattr(fb, 'txt'): # Twoja stara metoda
        fb.txt(str(msg), 8, (line * line_h) + 16, c)
    else: # Standardowy framebuf.text()
        fb.text(str(msg), 8, line * line_h + nudge_y, c)
    
    # KLUCZ: Automatyczne odświeżanie tylko dla małych ekranów. 
    # Dla TFT robimy to raz w pętli głównej Blockly (fb.show())
    if not is_tft and hasattr(fb, 'show'):
        fb.show()

def refresh():
    """Ręczne wymuszenie odświeżenia (potrzebne dla Turbo-TFT)"""
    if fb and hasattr(fb, 'show'):
        fb.show()


# Reszta Twoich funkcji pomocniczych
def fill(c): 
    if fb: fb.fill(c)
def text(t, x, y, c):
    if fb: fb.text(t, x, y, c)
def fill_rect(x, y, w, h, c):
    if fb: fb.fill_rect(x, y, w, h, c)
