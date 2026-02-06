# coden'go 🚀

**coden'go** to autorski, nowoczesny system operacyjny dla robotów opartych na układach **ESP32-S3**, stworzony z myślą o przełamywaniu barier w edukacji technologicznej.

## 🛠 Filozofia Projektu
W świecie zdominowanym przez gotowe, zamknięte rozwiązania, **coden'go** przywraca radość z prawdziwej inżynierii. Łączymy "starą dobrą szkołę" (szacunek do mechaniki i optymalizacji) z nowoczesnymi technologiami (MicroPython, Blockly, LVGL).

### Kluczowe cechy:
*   **Modern Blockly (Zelos Style):** Interfejs programowania wizualnego zainspirowany MakeCode – przyjazny, kolorowy i responsywny.
*   **Okrągły Wyświetlacz (Effect WOW):** Pełne wsparcie dla okrągłych ekranów LCD (np. GC9A01), tworzące efekt "inteligentnego oka" robota.
*   **MicroPython Engine:** Szybki, asynchroniczny system operacyjny wykorzystujący pełną moc ESP32-S3 i pamięci PSRAM.
*   **Hardware Freedom:** System zoptymalizowany pod kątem autorskich konstrukcji, gdzie inżynier decyduje o każdym milimetrze kodu i kabla.

## Architektura Techniczna
Projekt wykorzystuje architekturę **Full-stack Embedded**:
*   **Backend:** MicroPython v1.22+ działający na dedykowanej tablicy partycji (16MB Flash / 8MB PSRAM).
*   **Communication:** Serwer Microdot (asyncio) zapewniający błyskawiczną wymianę kodu między przeglądarką a robotem.
*   **Frontend:** Nowoczesny edytor Blockly v10+ serwowany bezpośrednio z urządzenia lub przez CDN.

## Misja Robotech
Uczymy dzieciaki, że technologia to nie tylko konsumpcja, ale przede wszystkim tworzenie. **coden'go** to narzędzie dla przyszłych inżynierów, którzy nie boją się "pobrudzić rąk" kodem i elektroniką.

---
*Created with Passion by [Robotech](https://robotech.edu.pl)*
