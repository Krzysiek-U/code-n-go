import network
import gc
#import time
#import screen

# 1. NAJPIERW WIFI (Absolutny priorytet)
ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid="codengo-robot", password="robotech-edu-pl")

print("Radio WiFi START...")

# 2. CZEKAMY NA ODDECH (Bardzo ważne!)
# Dajmy 2 sekundy, żeby telefon zdążył 'dogadać się' z robotem
#time.sleep(10) 

"""
# 3. DOPIERO TERAZ DOTYKAMY LCD
try:
    print("Inicjalizacja LCD...")
    screen.init() 
    screen.fill(0x0000) 
    
    ip = ap.ifconfig()[0]
    screen.print_line("ROBOT READY", 0)
    screen.print_line("IP: " + str(ip), 1)
    print("System gotowy, IP:", ip)
except Exception as e:
    print("LCD Error:", e)
##"""
gc.collect()






"""
import network
import gc
#import time
import screen

# Całkowicie wyłączamy LCD na czas testów
#lcd = None 

screen.print_line('Starting...', 0)


ap = network.WLAN(network.AP_IF)
screen.print_line('Setwork.AP_IF', 1)
ap.active(True)
screen.print_line('True', 12)
ap.config(essid="codengo-robot", password="robotech-edu-pl")

print("\n--- SYSTEM code-n-go ---")
print("IP Robota:", ap.ifconfig()[0])
gc.collect()


"""