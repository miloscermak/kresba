# Kresba – AI konverze fotek na kresby

## Co to je
Webová aplikace pro převod fotografií na umělecké kresby pomocí Google Gemini API.
Uživatel nahraje fotku, vybere styl (komiks / jedna čára) a dostane vygenerovanou kresbu.

## Tech stack
- **Frontend:** React 18 + TypeScript
- **Build:** Vite 5
- **Styling:** Tailwind CSS 3 + shadcn/ui (Radix UI primitives)
- **Ikony:** Lucide React
- **AI:** Google Gemini 2.5 Flash Image API
- **Konverze:** heic2any (HEIC → JPEG pro iPhone fotky)
- **Hosting:** Netlify (automatický deploy z `main` větve)

## Struktura projektu
```
src/
├── pages/
│   └── Index.tsx           # Hlavní stránka (upload → styl → generování → stažení)
├── components/
│   ├── ui/                 # shadcn/ui komponenty (button, input, label, radio-group, toast)
│   ├── ImageUpload.tsx     # Upload fotek s HEIC konverzí
│   ├── ImagePreview.tsx    # Zobrazení obrázku s error state
│   ├── APIKeyInput.tsx     # Správa Gemini API klíče (localStorage)
│   └── StyleSelector.tsx   # Výběr stylu kresby (komiks / jedna čára)
├── services/
│   └── geminiService.ts    # Komunikace s Gemini API
├── hooks/
│   ├── use-toast.ts        # Toast notifikace
│   └── use-mobile.tsx      # Detekce mobilního zařízení
├── lib/
│   └── utils.ts            # Utility (cn helper pro Tailwind)
├── App.tsx                 # Root komponenta
├── main.tsx                # Entry point
└── index.css               # Tailwind base + CSS proměnné pro shadcn/ui
```

## Spuštění
```bash
npm install
npm run dev        # Vývojový server na http://localhost:8080
npm run build      # Produkční build do dist/
npm run preview    # Náhled produkčního buildu
```

## API klíč
Gemini API klíč se zadává přímo v UI a ukládá do `localStorage` (`gemini_api_key`).
Není potřeba žádný .env soubor – vše běží client-side.

## Deployment
- **Hosting:** Netlify
- **Konfigurace:** `netlify.toml` (SPA redirect, build command)
- **Build:** `npm run build` → `dist/`
- **Branch:** deploy z `main`

## Pravidla pro vývoj
- Komentáře v kódu česky
- Commit messages anglicky v imperativu
- UI texty česky
- Jednoduchá řešení, žádný overengineering
- Žádné console.log v produkčním kódu
