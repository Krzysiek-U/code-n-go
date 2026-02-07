import network
import gc

# Całkowicie wyłączamy LCD na czas testów
lcd = None 

ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid="codengo-robot", password="robotech-edu-pl")

print("\n--- SYSTEM code-n-go ---")
print("IP Robota:", ap.ifconfig()[0])
gc.collect()
