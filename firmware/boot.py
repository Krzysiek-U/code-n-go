import machine
from gc9a01 import GC9A01

# Pinout dla Waveshare ESP32-S3-2.1
# Dopasuj piny, jeśli Twoja wersja 1.28 ma inne!
SPI_BUS = 1
SCK = 12
MOSI = 11
MISO = 13 # Zazwyczaj nieużywane w LCD
CS = 10
DC = 8
RST = 14
BL = 2

try:
    spi = machine.SPI(SPI_BUS, baudrate=40000000, sck=machine.Pin(SCK), mosi=machine.Pin(MOSI))
    lcd = GC9A01(spi, dc=machine.Pin(DC), cs=machine.Pin(CS), rst=machine.Pin(RST), bl=machine.Pin(BL))
    
    # Testowy obrazek na start
    lcd.fill(0x0000) # Czarny
    lcd.text("code-n-go", 80, 110, 0xFFFF)
    lcd.text("SYSTEM START...", 65, 130, 0x07E0) # Zielony
    lcd.show()
    print("LCD initialized successfully")
except Exception as e:
    print(f"LCD Init failed: {e}")

# Tutaj możesz dodać skanowanie I2C dla dotyku (CST816S)

