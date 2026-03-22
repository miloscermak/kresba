# Kresba

AI aplikace pro konverzi fotografií na umělecké kresby pomocí Google Gemini API.

## Co to dělá

Nahrajete fotku, vyberete styl kresby (komiks nebo jedna čára) a aplikace vygeneruje kresbu pomocí Gemini 2.5 Flash. Výsledek si můžete stáhnout.

## Spuštění

```bash
npm install
npm run dev
```

Aplikace běží na `http://localhost:8080`.

## API klíč

Aplikace potřebuje Google Gemini API klíč. Zadáváte ho přímo v UI – ukládá se do `localStorage` v prohlížeči, nikam se neodesílá.

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Google Gemini API (gemini-2.5-flash-image)
- heic2any (konverze iPhone fotek)

## Deployment

Projekt je deploynutý na Netlify. Push do `main` větve automaticky spustí nový deploy.
