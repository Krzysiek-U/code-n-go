import machine
import time
import framebuf

class GC9A01(framebuf.FrameBuffer):
    def __init__(self, spi, dc, cs, rst, bl, width=240, height=240):
        self.spi = spi
        self.dc = dc
        self.cs = cs
        self.rst = rst
        self.bl = bl
        self.width = width
        self.height = height
        
        # Buffer: 240x240 @ 16bit (RGB565) to 115200 bajtów. 
        # S3 z PSRAM udźwignie to bez problemu.
        self.buffer = bytearray(self.width * self.height * 2)
        super().__init__(self.buffer, self.width, self.height, framebuf.RGB565SW)
        
        self.init_display()

    def write_cmd(self, cmd):
        self.dc.off()
        self.cs.off()
        self.spi.write(bytearray([cmd]))
        self.cs.on()

    def write_data(self, data):
        self.dc.on()
        self.cs.off()
        self.spi.write(data)
        self.cs.on()

    def init_display(self):
        self.rst.on()
        time.sleep_ms(50)
        self.rst.off()
        time.sleep_ms(50)
        self.rst.on()
        time.sleep_ms(50)

        # Sekwencja startowa zoptymalizowana pod Waveshare
        for cmd, data in [
            (0xEF, b'\x03\x80\x01'),
            (0xEB, b'\x02\x01'),
            (0xFE, b'\x00'),
            (0x3A, b'\x05'), # 16-bit color
            (0x36, b'\x08'), # Orientacja (można zmienić: 0x08, 0x48, 0x88, 0xC8)
            (0x21, b''),     # Inversion On
            (0x11, b''),     # Sleep Out
            (0x29, b''),     # Display On
        ]:
            self.write_cmd(cmd)
            if data: self.write_data(data)
        
        self.bl.on() # Włącz podświetlenie

    def show(self):
        # Ustawienie okna zapisu
        self.write_cmd(0x2A) # Column addr
        self.write_data(bytearray([0, 0, 0, 239]))
        self.write_cmd(0x2B) # Row addr
        self.write_data(bytearray([0, 0, 0, 239]))
        self.write_cmd(0x2C) # Memory write
        self.write_data(self.buffer)
