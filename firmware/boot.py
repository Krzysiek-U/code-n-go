import machine
import network
import time

# --- SEKCJA WYŚWIETLACZA (Dla S3 / LCD) ----
try:
    from gc9a01 import GC9A01
    # Piny dla Waveshare 2.1 (na Lolin32 wywali błąd i przejdzie dalej)
    spi = machine.SPI(1, baudrate=40000000, sck=machine.Pin(12), mosi=machine.Pin(11))
    lcd = GC9A01(spi, dc=machine.Pin(8), cs=machine.Pin(10), rst=machine.Pin(14), bl=machine.Pin(2))
    lcd.fill(0x0000)
    lcd.text("code-n-go", 80, 110, 0xFFFF)
    lcd.text("WIFI AP START...", 65, 130, 0x07E0)
    lcd.show()
    print("LCD initialized")
except Exception as e:
    print("LCD not found or error:", e)
    lcd = None # Żeby main.py wiedział, że nie ma ekranu

# --- SEKCJA WI-FI ACCESS POINT (Dla każdego ESP32) ---
ap = network.WLAN(network.AP_IF)
ap.active(True)
# Nazwa sieci i hasło (min. 8 znaków)
ap.config(essid="codengo-robot", password="robotech-edu-pl")

print("--- SYSTEM code-n-go ---")
print("Sieć: codengo-robot")
print("IP Robota:", ap.ifconfig()[0]) # Zazwyczaj 192.168.4.1

if lcd:
    lcd.fill(0x0000)
    lcd.text("IP: " + ap.ifconfig()[0], 60, 120, 0xFFFF)
    lcd.show()
