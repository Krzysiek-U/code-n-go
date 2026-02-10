import machine
import gc
import st77xx

fb = None
bg_color = 0x0000
color = 0xFFFF

def init_screen():
    global fb, bg_color, color
    gc.collect()
    
    # Konfiguracja dla LoLin32 Lite (Twoje stare piny)
    # SCK=18, MOSI=23, CS=5, DC=16, RST=17
    try:
        spi = machine.SPI(2, baudrate=40000000, sck=machine.Pin(18), mosi=machine.Pin(23))
        fb = st77xx.ST77xx(spi, 240, 240, 
                           reset=machine.Pin(17, machine.Pin.OUT), 
                           dc=machine.Pin(16, machine.Pin.OUT), 
                           cs=machine.Pin(5, machine.Pin.OUT))
        fb.init()
        fb.fill(bg_color)
        print("LCD: Połączono (LoLin32 piny)")
    except:
        # Jeśli nie LoLin, spróbuj piny domyślne dla S3
        try:
            spi = machine.SPI(1, baudrate=40000000, sck=machine.Pin(12), mosi=machine.Pin(11))
            fb = st77xx.ST77xx(spi, 240, 240, 
                               reset=machine.Pin(14, machine.Pin.OUT), 
                               dc=machine.Pin(9, machine.Pin.OUT), 
                               cs=machine.Pin(10, machine.Pin.OUT))
            fb.init()
            fb.fill(bg_color)
            print("LCD: Połączono (S3 piny)")
        except:
            print("LCD: Nie wykryto żadnego ekranu")
            fb = None

# Inicjalizacja przy starcie
init_screen()

def print_line(msg, line, c=None):
    if fb is None: return
    if c is None: c = color
    
    line_h = 20 # Wysokość linii dla fontu f8
    y_pos = (line * line_h) + 16 # Offset y, bo Twój znak rysuje "w górę"
    
    # Czyścimy tło pod linią (Twoja biblioteka ma fill_rect)
    fb.fill_rect(0, line * line_h, 240, line_h, bg_color)
    # Wypisujemy tekst nową metodą txt
    fb.txt(str(msg), 5, y_pos, c)

def fill(c):
    if fb: fb.fill(c)
