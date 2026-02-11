import sys
import json
import machine
import time

# --- 1. WYKRYWANIE SPRZĘTU ---
def get_hardware_profile():
    machine_name = sys.implementation._machine.lower()
    is_s3 = 'esp32s3' in machine_name
    
    try:
        with open('config.json', 'r') as f:
            config = json.load(f)
        profile_key = 'S3' if is_s3 else 'LOLIN32_LITE'
        return config['profiles'].get(profile_key)
    except:
        return None

CURRENT_PROFILE = get_hardware_profile()

# --- 2. LOGIKA URUCHAMIANIA (ROUTER) ---
if CURRENT_PROFILE:
    print(f"Startuje system dla: {CURRENT_PROFILE['name']}")
    
    if CURRENT_PROFILE.get('bus') == 'QSPI':
        # --- OPCJA A: NOWOCZESNY WAVESHARE 1.85 (LVGL) ---
        try:
            import lvgl as lv
            import lcd_bus
            # Tutaj wywołujesz funkcję inicjalizacji ekranu QSPI, którą robiliśmy
            # a potem np. exec(open("apps/modern_ui.py").read())
            print("Zaladowano sterowniki LVGL + QSPI")
        except ImportError:
            print("BLAD: Brak firmware z LVGL! Ekran nie ruszy.")
            
    else:
        # --- OPCJA B: STARY ROBOTECH (STANDARD SPI) ---
        from machine import SPI, Pin
        # Tutaj inicjalizujesz zwykłe SPI (ST7789)
        # a potem np. exec(open("apps/classic_ui.py").read())
        print("Zaladowano sterowniki SPI")
else:
    print("Nie rozpoznano plytki. Tryb awaryjny (Safe Mode).")
