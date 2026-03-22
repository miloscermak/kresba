# Kresba – AI konverze fotek na kresby

## Co to je
Webová aplikace pro převod fotografií na umělecké kresby pomocí Google Gemini API.
Uživatel nahraje fotku, vybere styl (komiks / jedna čára) a dostane vygenerovanou kresbu.

## Tech stack
- **Frontend:** React 18 + TypeScript
- **Build:** Vite 5
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Ikony:** Lucide React
- **Routing:** React Router v6
- **AI:** Google Gemini 2.5 Flash Image API
- **Konverze:** heic2any (HEIC → JPEG pro iPhone fotky)

## Struktura projektu
```
src/
├── pages/          # Stránky (Index, NotFound)
├── components/     # Aplikační komponenty
│   ├── ui/         # shadcn/ui komponenty
│   ├── ImageUpload.tsx
│   ├── ImagePreview.tsx
│   ├── APIKeyInput.tsx
│   └── StyleSelector.tsx
├── services/       # API komunikace (geminiService.ts)
├── hooks/          # Custom hooks
├── lib/            # Utility funkce
├── App.tsx         # Root s routingem
└── main.tsx        # Entry point
```

## Spuštění
```bash
npm install
npm run dev        # Vývojový server na http://localhost:8080
npm run build      # Produkční build
```

## API klíč
Gemini API klíč se zadává přímo v UI a ukládá do `localStorage` (`gemini_api_key`).
Není potřeba žádný .env soubor.

## Deployment
- Hosting: Netlify (automatický deploy z `main` větve)
- Konfigurace: `netlify.toml`
- Build: `npm run build` → `dist/`

## Pravidla pro vývoj
- Komentáře v kódu česky
- Commit messages anglicky v imperativu
- UI texty česky
- Jednoduchá řešení, žádný overengineering
