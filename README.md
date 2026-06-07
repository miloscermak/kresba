# Kresba

AI aplikace pro konverzi fotografií na umělecké kresby pomocí xAI Grok Imagine API.

## Co to dělá

Nahrajete fotku, vyberete styl kresby (komiks nebo jedna čára) a aplikace vygeneruje kresbu pomocí modelu `grok-imagine-image-quality`. Výsledek si můžete stáhnout.

## Spuštění

```bash
npm install
npm run dev
```

Aplikace běží na `http://localhost:8080`.

## API klíč

Aplikace potřebuje xAI API klíč. Zadáváte ho přímo v UI – ukládá se do `localStorage` v prohlížeči, nikam se neodesílá.

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- xAI Grok Imagine (`grok-imagine-image-quality`) přes `/v1/images/edits`
- heic2any (konverze iPhone fotek)

## Deployment

Projekt je deploynutý na Netlify. Push do `main` větve automaticky spustí nový deploy.
