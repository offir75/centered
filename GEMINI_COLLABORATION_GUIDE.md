# Guide: Optimal AI Collaboration with Gemini for Centered

## Overview
This guide provides structured templates and best practices for communicating with Gemini (or any external AI) about the Centered project. Clear, structured prompts produce better code that aligns with your architecture.

---

## Part 1: Project Context Template

**When starting a new conversation with Gemini**, provide this upfront:

```markdown
# Centered Project Context

## Architecture Summary
- **Framework**: React 19 + Vite + TypeScript
- **Styling**: CSS Modules (BEM methodology, no globals)
- **i18n**: Custom system, NOT react-i18n
- **Language Support**: Hebrew (RTL) + English (LTR)
- **Mobile-First**: Responsive, touch-optimized buttons (min 64px)

## Project Structure
```
src/
├── features/          # Feature modules (onboarding, tokens, wheel, etc.)
├── components/
│   ├── common/        # Reusable (Button, Slider, HamburgerMenu)
│   └── layout/        # Layout wrappers (PhoneContainer)
├── i18n.ts            # Centralized translations
├── App.tsx            # Main routing & state
├── index.css          # Global styles only
└── main.tsx           # React entry
```

## Translation System Pattern
**Do NOT pass translations to components.** Instead:

```typescript
// In App.tsx (parent)
const locale = translations[language];

// Pass to child
<MyComponent locale={locale} currentLang={language} />

// In component
const t = locale.myFeature;
```

Add your feature strings to `src/i18n.ts` following this pattern:

```typescript
myFeature: {
  title: string;
  subtitle: string;
  // ... more fields
}
```

## Component Typing Pattern
```typescript
import type { Language, Translations } from '../../i18n';

interface MyComponentProps {
  currentLang: Language;
  locale: Translations;
  onEvent: (data: SomeType) => void;
}
```

## Styling Rules
- Use CSS Modules: `SomeName.module.css`
- BEM naming: `.container`, `.primaryButton`, `.container--rtl`
- No inline styles (except critical animations)
- Mobile-first approach
- RTL support: Use `direction: rtl` in `.container--rtl`
- Responsive: Include `@media (max-width: 640px)` queries

## File Naming
- Components: PascalCase (`NotNowTimer.tsx`)
- Modules: kebab-case (`not-now/`)
- Styles: `.module.css` suffix

## Key Principles
1. **Type Safety**: Strict TypeScript, no `any`
2. **Accessibility**: ARIA labels, semantic HTML, keyboard support
3. **Performance**: Memoization where needed, cleanup intervals/timeouts
4. **Consistency**: Match existing code style exactly
5. **Mobile UX**: Touch targets, no hover-only interactions
```

---

## Part 2: Feature Request Template

**When asking Gemini to build a feature**, use this format:

```markdown
# Feature Request: [Feature Name]

## Therapeutic Purpose
[Explain the psychological/wellness principle behind this feature]

## User Flow
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Visual States
- **State A**: [Description + visual elements]
- **State B**: [Description + visual elements]
- **State C**: [Description + visual elements]

## Data Structure (if applicable)
```typescript
interface MyFeatureData {
  fieldName: type;
  // ...
}
```

## Integration Requirements
- [ ] Add strings to `src/i18n.ts` (both `en` and `he` sections)
- [ ] Create component in `src/features/[feature-name]/`
- [ ] CSS Module with RTL support
- [ ] Props should accept `locale: Translations` and `currentLang: Language`
- [ ] Emit callbacks for parent state management (no Redux/Context)

## Specific Interactions
- [Button behavior]
- [Input handling]
- [State transitions]

## Acceptance Criteria
- [ ] Component renders in both languages
- [ ] RTL text flows correctly
- [ ] Mobile touch targets are ≥64px
- [ ] All intervals/timeouts cleanup on unmount
- [ ] No console errors
```

---

## Part 3: Code Review Checklist Template

**When Gemini provides code**, review it against:

```markdown
# Code Review: [Feature]

## ✅ Must Have
- [ ] Imports are from correct relative paths
- [ ] TypeScript types match `Translations` interface
- [ ] `language` prop is `Language` type (not `string`)
- [ ] RTL support: `.container--rtl` and `.container--ltr` classes
- [ ] Mobile breakpoint: `@media (max-width: 640px)`
- [ ] All `useEffect`, `setInterval`, `setTimeout` cleanup on unmount
- [ ] No `any` types
- [ ] CSS Module imported as `styles`

## ⚠️ Common Issues to Watch
- Using hardcoded strings instead of `locale` object
- Missing `.module.css` suffix
- Assuming global CSS exists (use CSS Modules instead)
- Not handling RTL properly
- `useEffect` dependencies missing or incorrect
- Not cleaning up timers/intervals
- Touch targets < 64px
- Using `react-i18n` instead of custom system

## 🔍 Architecture Fit
- [ ] Component placed in correct `src/features/` folder
- [ ] i18n strings added to both EN and HE
- [ ] Parent component passes `locale` and `currentLang`
- [ ] No prop drilling beyond 2 levels
- [ ] Callbacks lift state up (no Redux)
```

---

## Part 4: Refactoring Request Template

**When you have existing code to refactor**, provide:

```markdown
# Refactor Request

## Current Code
[Paste existing code or link to file]

## Target Architecture
- [ ] Match [specific feature] structure
- [ ] Use custom i18n system (not react-i18n)
- [ ] Move hardcoded strings → `locale` object
- [ ] Ensure TypeScript strict mode compliance
- [ ] Add RTL support

## Specific Changes
- [What needs to change]
- [What needs to be added]
- [What needs to be removed]

## Files Affected
- `src/features/[name]/Component.tsx` → refactored
- `src/i18n.ts` → add [fields]
- `src/features/[name]/Component.module.css` → ensure mobile breakpoints
```

---

## Part 5: Feedback Loop Template

**After receiving code from Gemini**:

1. **Copy code into your project** exactly as provided
2. **Run your dev server**: `npm run dev`
3. **Test in both languages** (toggle in UI)
4. **Test on mobile** (DevTools device mode)
5. **Provide specific feedback** using this format:

```markdown
# Feedback on [Feature]

## ❌ Issues Found
1. [Issue]: [Where it occurs] → [Expected vs actual]
2. [Issue]: [Where it occurs] → [Expected vs actual]

## ✅ What Works Well
- [Positive observation]
- [Positive observation]

## 🔧 Refinements Needed
- [Change]: [Reason]
- [Change]: [Reason]

## Code Snippet for Fix (if you have one)
[Paste corrected code]
```

---

## Part 6: Multi-Language Testing Checklist

**When reviewing any component**, always test:

```markdown
## English (LTR)
- [ ] Text flows left-to-right
- [ ] Buttons align correctly
- [ ] No text cutoff
- [ ] Touch targets ≥ 64px

## Hebrew (RTL)
- [ ] Text flows right-to-left
- [ ] Text alignment flipped (`.container--rtl`)
- [ ] No text cutoff
- [ ] Touch targets ≥ 64px
- [ ] Icons remain in same logical position

## Common RTL Mistakes to Avoid
- ❌ Using `margin-left` → ✅ Use `margin-inline-start`
- ❌ Using `text-align: left` → ✅ Use `direction: rtl` with auto-align
- ❌ Hardcoding margin/padding on one side → ✅ Use logical properties
```

---

## Part 7: Example: Asking for a Complete Feature

Here's a complete example request combining the above:

```markdown
# Feature: Gratitude Gamelet

## Therapeutic Purpose
Interrupt rumination with immediate positive focus. Random pause to notice 3 small things to be grateful for.

## User Flow
1. User taps "Grateful" button on home screen
2. Screen shows: "Find 3 things you're grateful for right now"
3. User types/thinks of 3 things
4. Submit button reveals: "You earned +1 Here & Now Token"
5. Return home

## Visual States
- **Intro**: Title + prompt + input fields (3x)
- **Submit State**: Button shows loading spinner
- **Success**: Trophy emoji + token award message

## Data Structure
```typescript
interface GratitudeEntry {
  items: [string, string, string];
  completedAt: Date;
}
```

## Integration Requirements
- Add to `src/features/gratitude/GratitudeComponent.tsx`
- Add i18n strings to `notNow` section (gratitude object)
- Import `{ Translations, Language }` from i18n
- Accept `locale: Translations, currentLang: Language`
- Emit `onCompleted(tokensEarned: number)` callback

## Interactions
- Text input should clear/focus on Enter
- Submit button disabled until all 3 fields filled
- RTL support for text input direction
- Mobile: Large touch targets for input fields

## Acceptance Criteria
- [ ] Works in both EN and HE
- [ ] RTL text input direction correct
- [ ] All timers/intervals cleaned up
- [ ] No console errors
```

---

## Part 8: When Gemini Provides Code You Don't Like

**Don't just say "I don't like it." Instead:**

```markdown
# Code Feedback: [Feature]

## Problem
[What doesn't work or what you want different]

## Example
Here's what I expected:
[Paste desired code or describe structure]

## Reasoning
[Why this approach is better for your project]

## References
- Similar pattern used in [existing feature]
- Matches [architectural requirement]
```

---

## Part 9: Gemini Communication Best Practices

### ✅ DO:
- Provide context upfront (copy this template)
- Show existing patterns (share similar feature code)
- Be specific: "Button is 48px, should be 64px" not "Button is small"
- Include file paths in requests
- Paste relevant existing code so Gemini can match it
- Ask for TypeScript first, refactor later if needed
- Request both EN + HE translations in one ask

### ❌ DON'T:
- Change the response mid-conversation without context
- Use generic prompts ("build a timer")
- Ask for CSS Framework (you use CSS Modules)
- Paste entire project structure in each message (use context section once)
- Assume Gemini knows your i18n pattern (show example)
- Ask for localStorage/APIs without specifying integration
- Mix multiple features in one request

---

## Part 10: Exporting This Guide to Gemini

**At the start of each new Gemini session**, paste:

```markdown
# Important: Read This First

You are helping develop "Centered," a React + Vite wellness app.

**Rules:**
1. Use CSS Modules (not styled-components or inline styles)
2. All translations come from a `locale: Translations` prop (not hardcoded)
3. TypeScript strict mode: no `any` types
4. RTL support: `.container--rtl` and `.container--ltr`
5. Mobile-first: All touch targets ≥ 64px
6. Cleanup: All effects and intervals must cleanup on unmount
7. No Redux, Context, or external state: use props + callbacks

**When I provide code, ensure it follows the project structure shown below:**

[Copy relevant parts from Part 1]

**Template for feature requests:**

[Copy relevant parts from Part 2]
```

Then save this as `GEMINI_RULES.md` in your project root and reference it in each conversation.

---

## Quick Checklists by Task

### Building a New Component
```
[ ] Feature template filled out
[ ] i18n strings added (EN + HE)
[ ] Component created in src/features/[feature]/
[ ] CSS Module with RTL support
[ ] Props use Language & Translations types
[ ] Effects cleanup properly
[ ] Mobile breakpoints tested
```

### Integrating Gemini Code
```
[ ] Code copied to correct file location
[ ] npm run dev → no errors
[ ] Tested in both EN and HE
[ ] Mobile device mode → touch works
[ ] No console warnings
```

### Reviewing Component Behavior
```
[ ] All strings from locale object
[ ] RTL works correctly
[ ] Touch targets ≥ 64px
[ ] Animations smooth
[ ] No lag on input
[ ] Intervals/timeouts cleanup
```

---

**Summary**: Use these templates consistently, and Gemini will produce code that matches your architecture exactly.
