import time
import machine
import ustruct as struct

class ST7789:
    def __init__(self, spi, width, height, reset, dc, cs):
        self.spi = spi
        self.width = width
        self.height = height
        self.reset = reset
        self.dc = dc
        self.cs = cs

    def write_cmd(self, cmd, data=None):
        self.dc(0)
        self.cs(0)
        self.spi.write(bytearray([cmd]))
        self.cs(1)
        if data: self.write_data(data)

    def write_data(self, data):
        self.dc(1)
        self.cs(0)
        self.spi.write(data)
        self.cs(1)

    def init(self):
        self.reset(1)
        time.sleep_ms(50)
        self.reset(0)
        time.sleep_ms(50)
        self.reset(1)
        time.sleep_ms(150)
        for cmd, data in [
            (0x01, None), (0x11, None), # SWRESET, SLPOUT
            (0x3A, b'\x55'), (0x36, b'\x00'), # COLMOD 16bit, MADCTL
            (0x21, None), (0x13, None), (0x29, None) # INVON, NORON, DISPON
        ]:
            self.write_cmd(cmd, data)
            if cmd in [0x01, 0x11]: time.sleep_ms(150)

    def color565(self, r, g, b):
        return (r & 0xf8) << 8 | (g & 0xfc) << 3 | r >> 3

    def set_window(self, x, y, w, h):
        self.write_cmd(0x2A, struct.pack(">HH", x, x + w - 1))
        self.write_cmd(0x2B, struct.pack(">HH", y, y + h - 1))
        self.write_cmd(0x2C)

    def text(self, tekst, x, y, color):
        """Wykorzystuje zewnętrzny plik f8.py do rysowania znaków"""
        try:
            import f8
            curr_x = x
            for char in str(tekst):
                self.znak(char, curr_x, y, color)
                curr_x += 10 # Odstęp między literami (czcionka 8px * skala 2 = 16px?)
        except ImportError:
            print("Błąd: Brak pliku f8.py w /lib")

    def znak(self, litera, x_start, y_start, color):
        """Twoja zoptymalizowana metoda rysowania znaku 8x8 w skali x2"""
        import f8
        try:
            char_data = f8.font_x8[ord(litera)]
            for col in range(5): # Standardowa czcionka 5x8
                byte = char_data[col]
                for row in range(8):
                    if byte & (1 << row):
                        # Rysujemy powiększony piksel 2x2 dla czytelności na 240x240
                        self.fill_rect(x_start + col*2, y_start + (7-row)*2, 2, 2, color)
        except:
            pass



    def fill_rect(self, x, y, w, h, color):
        # Zapobieganie błędom zakresu
        w = min(w, self.width - x)
        h = min(h, self.height - y)
        if w <= 0 or h <= 0: return
        self.set_window(x, y, w, h)
        pixel = struct.pack(">H", color)
        self.dc(1)
        self.cs(0)
        line = pixel * w # Turbo: tworzymy całą linię w RAM
        for _ in range(h):
            self.spi.write(line)
        self.cs(1)

    def fill(self, color):
        self.fill_rect(0, 0, self.width, self.height, color)

    def show(self): 
        pass # Kompatybilność z OLED
