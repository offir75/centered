# Centered

A bilingual mobile-ready React + Vite app for daily energy self-reflection.

## Overview

`Centered` is a lightweight web app for tracking four energy channels:
- Fire (action and pressure)
- Water (emotion and containment)
- Air (thought and dissociation)
- Earth (body and comfort)

The app supports Hebrew (RTL) and English (LTR), and is designed for mobile use.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL in your browser.

## Build for production

```bash
npm run build
```

The static output is generated to `dist/`.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Create a new Vercel project from the GitHub repo.
3. Use the recommended settings:
   - Build command: `npm run build`
   - Output directory: `dist`

Vercel should detect this as a Vite app automatically.

## Future expansion

- Add a backend or database to store user preferences and results.
- Use Vercel serverless functions or another API layer for persistence.
- Keep the bilingual UI and improve translation content over time.
