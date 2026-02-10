import time
from micropython import const
import ustruct as struct
import machine
import gc
import f8

gc.collect()

# Komendy sterownika
ST77XX_SWRESET = const(0x01)
ST77XX_SLPOUT  = const(0x11)
ST77XX_INVON   = const(0x21)
ST77XX_INVOFF  = const(0x20)
ST77XX_CASET   = const(0x2A)
ST77XX_RASET   = const(0x2B)
ST77XX_RAMWR   = const(0x2C)
ST77XX_COLMOD  = const(0x3A)
ST7789_MADCTL  = const(0x36)

# Kolory
BLACK   = const(0x0000)
WHITE   = const(0xFFFF)

_ENCODE_PIXEL = ">H"
_ENCODE_POS   = ">HH"
_BUFFER_SIZE  = const(256)

class ST77xx():
    def __init__(self, spi, width, height, reset, dc, cs, backlight=None):
        self.width = width
        self.height = height
        self.spi = spi
        self.reset = reset
        self.dc = dc
        self.cs = cs
        self.start_x = 0
        self.start_y = 0

    def write(self, command=None, data=None):
        self.cs(0)
        if command is not None:
            self.dc(0)
            self.spi.write(bytes([command]))
        if data is not None:
            self.dc(1)
            self.spi.write(data)
        self.cs(1)

    def hard_reset(self):
        self.reset(1)
        time.sleep_ms(50)
        self.reset(0)
        time.sleep_ms(50)
        self.reset(1)
        time.sleep_ms(150)

    def init(self):
        self.hard_reset()
        self.write(ST77XX_SWRESET)
        time.sleep_ms(150)
        self.write(ST77XX_SLPOUT)
        time.sleep_ms(10)
        self.write(ST77XX_COLMOD, b'\x55') # 16-bit color
        self.write(0x29) # Display ON

    def set_window(self, x0, y0, x1, y1):
        x0 += self.start_x
        x1 += self.start_x
        y0 += self.start_y
        y1 += self.start_y
        self.write(ST77XX_CASET, struct.pack(_ENCODE_POS, x0, x1))
        self.write(ST77XX_RASET, struct.pack(_ENCODE_POS, y0, y1))
        self.write(ST77XX_RAMWR)

    def fill_rect(self, x, y, width, height, color):
        # Ograniczenie rysowania do granic ekranu
        if x >= self.width or y >= self.height: return
        width = min(width, self.width - x)
        height = min(height, self.height - y)
        
        self.set_window(x, y, x + width - 1, y + height - 1)
        pixel = struct.pack(_ENCODE_PIXEL, color)
        num_pixels = width * height
        chunks, rest = divmod(num_pixels, _BUFFER_SIZE)
        
        self.dc(1)
        self.cs(0)
        if chunks:
            data = pixel * _BUFFER_SIZE
            for _ in range(chunks):
                self.spi.write(data)
        if rest:
            self.spi.write(pixel * rest)
        self.cs(1)

    def fill(self, color):
        self.fill_rect(0, 0, self.width, self.height, color)

    def pixel(self, x, y, color):
        if 0 <= x < self.width and 0 <= y < self.height:
            self.set_window(x, y, x, y)
            self.write(None, struct.pack(_ENCODE_PIXEL, color))

    def znak(self, litera, x_start, y_start, color):
        if ord(litera) not in f8.font_x8: return
        char_data = f8.font_x8[ord(litera)]
        for l in range(5): # Font f8 ma 5 bajtów szerokości
            line = char_data[l]
            for bit in range(8):
                if line & (1 << bit):
                    # Rysujemy powiększony pixel 2x2 dla czytelności
                    px = x_start + (l * 2)
                    py = y_start - (bit * 2)
                    self.fill_rect(px, py, 2, 2, color)

    def txt(self, tekst, x, y, color):
        tekst = str(tekst)
        cursor_x = x
        for char in tekst:
            self.znak(char, cursor_x, y, color)
            cursor_x += 12 # Odstęp między znakami
