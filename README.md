# coden'go

**coden'go** to autorski, nowoczesny system operacyjny dla robotów, IoT opartych na układach **ESP32-S3**, stworzony z myślą o przełamywaniu barier w edukacji technologicznej.

## Filozofia Projektu
W świecie zdominowanym przez gotowe, zamknięte rozwiązania, **coden'go** przywraca radość z prawdziwej inżynierii. Łączymy "starą dobrą szkołę" (szacunek do mechaniki i optymalizacji) z nowoczesnymi technologiami (MicroPython, Blockly, LVGL).

## Architektura Techniczna
Projekt wykorzystuje architekturę **Full-stack Embedded**:
*   **Backend:** MicroPython v1.22+ działający na dedykowanej tablicy partycji (16MB Flash / 8MB PSRAM).
*   **Communication:** Serwer Microdot (asyncio) zapewniający błyskawiczną wymianę kodu między przeglądarką a robotem.
*   **Frontend:** Nowoczesny edytor Blockly v10+ serwowany bezpośrednio z urządzenia lub przez CDN.

---
*Created with Passion by [Robotech](https://robotech.edu.pl)*
