# Centered

A bilingual (English/Hebrew), mobile-first wellness web app. Provides short "gamelets" — Four Elements onboarding, Not Now Timer (impulse-control breathing exercise), Wheel of Life assessment — that help users self-regulate in under a minute. No backend, no auth; everything runs client-side.

## Stack
- React 19 + TypeScript (strict) + Vite, built with `tsc -b && vite build`
- No state library — state lives in `App.tsx` and flows down via props/callbacks. Don't introduce Redux or Context.
- Styling: CSS Modules only (`Component.module.css`), BEM-ish class names. No styled-components, no inline styles.
- i18n: hand-rolled, centralized in [src/i18n.ts](src/i18n.ts) — never hardcode user-facing strings.

## Structure
```
src/
  features/<name>/<Name>.tsx + <Name>.module.css   # one folder per gamelet
  components/common/    # Button, Slider, HamburgerMenu
  components/layout/    # PhoneContainer
  i18n.ts               # all translations, both languages, single source of truth
  App.tsx               # routing (a simple activeView state machine) + top-level state
```

## i18n pattern
Always pass the whole locale object down, never a translated string in isolation:
```tsx
interface MyComponentProps {
  currentLang: Language;     // 'en' | 'he'
  locale: Translations;      // full translations object
}
const t = locale.myFeature;  // pull the feature's nested slice
const isRtl = currentLang === 'he';
```
Add new copy under its own key in both `en` and `he` blocks of `src/i18n.ts` — never leave one language stubbed.

## CSS conventions
- RTL/LTR via modifier classes: `container--rtl` / `container--ltr`, driven by `currentLang`.
- Touch targets: `min-height: 64px` (56px is the absolute floor on the `@media (max-width: 640px)` breakpoint).
- Use logical properties (`margin-inline-start`, not `margin-left`) so RTL works for free.

## TypeScript rules
- No `any`.
- Timer/interval refs: `useRef<ReturnType<typeof setInterval> | null>(null)` — not `NodeJS.Timeout`, this is a browser app with no Node types wired into tsconfig. Always clear the ref in the effect cleanup.

## Known incomplete areas
- Token economy: `NotNowTimer` and `WheelOfLife` report results via `onCompleted`/`onSave` callbacks, but `App.tsx` only `console.log`s them (search for `// TODO` in `App.tsx`) — tokens aren't persisted or shown anywhere yet.
- No data persistence layer (no localStorage, no backend) — anything saved is lost on refresh.
- No tests, no CI.

## Prior workflow
This project was previously developed by copy-pasting prompts into Gemini (see `GEMINI_QUICK_START.md`, `GEMINI_COLLABORATION_GUIDE.md` for historical context on conventions) before moving to Claude Code. Those documents describe the same conventions captured above.
