# Quick Prompt for Gemini: Copy & Paste at Start of Each Session

---

## PASTE THIS INTO GEMINI TO START A NEW CONVERSATION

```
# You are developing "Centered" - a React + Vite wellness app

## Architecture Rules (MUST FOLLOW)
1. **Framework**: React 19.2 + Vite + TypeScript (strict mode)
2. **Styling**: CSS Modules ONLY (file.module.css) - NO styled-components, NO inline styles
3. **i18n**: Custom system (see pattern below) - NOT react-i18n
4. **Language Support**: Hebrew (RTL) + English (LTR)
5. **Mobile First**: All touch targets ≥ 64px minimum

## Project File Structure
```
src/
├── features/          # Feature modules
│   ├── onboarding/
│   ├── not-now/
│   ├── wheel/
│   └── [others]
├── components/
│   ├── common/        # Button, Slider, HamburgerMenu
│   └── layout/        # PhoneContainer
├── i18n.ts            # ALL translations (NO hardcoding)
├── App.tsx            # Main routing + state
├── main.tsx           # Entry point
└── index.css          # Global only
```

## i18n Pattern (MUST USE)
**Never pass localization object to component. Always use this pattern:**

In parent (App.tsx):
```typescript
import { translations } from './i18n';
import type { Language, Translations } from './i18n';

const locale = translations[language];
<MyComponent locale={locale} currentLang={language} />
```

In component:
```typescript
interface MyComponentProps {
  currentLang: Language;      // Type: 'en' | 'he'
  locale: Translations;       // Entire translations object
  onEvent?: (data: any) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  currentLang, 
  locale,
  onEvent 
}) => {
  const isRtl = currentLang === 'he';
  const t = locale.myFeature;  // Access nested translations
  
  return (
    <div className={`${styles.container} ${isRtl ? styles['container--rtl'] : styles['container--ltr']}`}>
      {t.title}
    </div>
  );
};
```

Add to src/i18n.ts:
```typescript
export type Translations = {
  // ... existing
  myFeature: {
    title: string;
    subtitle: string;
    // ... more fields
  };
};

export const translations = {
  en: {
    // ... existing
    myFeature: {
      title: 'English Title',
      subtitle: 'English Subtitle',
    }
  },
  he: {
    // ... existing
    myFeature: {
      title: 'כותרת עברית',
      subtitle: 'כתוביות בעברית',
    }
  }
};
```

## CSS Module Pattern (MUST USE)
File: `src/features/[name]/Component.module.css`

```css
.container {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  box-sizing: border-box;
}

/* RTL Support */
.container--rtl {
  direction: rtl;
}

.container--ltr {
  direction: ltr;
}

/* BEM Naming */
.primaryButton {
  width: 100%;
  min-height: 64px;  /* Touch target minimum */
  background: #2d3748;
  border: none;
  border-radius: 18px;
  cursor: pointer;
}

.primaryButton:active {
  transform: scale(0.97);
}

/* Mobile Breakpoint */
@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
  
  .primaryButton {
    min-height: 56px;
  }
}
```

## Component Import Pattern
```typescript
// In component file
import React, { useState, useEffect } from 'react';
import styles from './MyComponent.module.css';
import type { Language, Translations } from '../../i18n';

interface MyComponentProps {
  currentLang: Language;
  locale: Translations;
  onCallback?: (data: Type) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  currentLang,
  locale,
  onCallback,
}) => {
  // Component code
};
```

## Effect Cleanup (IMPORTANT - NO MEMORY LEAKS)
```typescript
const timerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  timerRef.current = setInterval(() => {
    // Do something
  }, 1000);

  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, []);
```

## TypeScript Requirements
- NO `any` types
- Use `Language` type for language prop
- Use `Translations` type for locale prop
- Strict null checks enabled
- Interface names: PascalCase
- Variable names: camelCase
- Export type definitions

## Common Mistakes to Avoid
❌ Hardcoding strings → ✅ Use `locale.feature.field`
❌ Separate localization objects → ✅ Use shared translations import
❌ Inline styles → ✅ Use CSS Module
❌ `margin-left` in RTL code → ✅ Use `margin-inline-start`
❌ useEffect without cleanup → ✅ Always cleanup timers/intervals
❌ Touch targets < 64px → ✅ Use min-height: 64px
❌ Using context/Redux → ✅ Use props + callbacks

## When You Receive Code from Me:
1. Check imports match relative paths
2. Verify TypeScript types: `Language` and `Translations`
3. Confirm RTL support via `.container--rtl` and `.container--ltr`
4. Look for mobile breakpoint: `@media (max-width: 640px)`
5. Ensure all intervals/timeouts cleanup on unmount
6. Test in both English and Hebrew

## Feature Request Format
When you need a new component, provide:

**Therapeutic Purpose**: [Why this feature psychologically]
**User Flow**: [1. Step 1] [2. Step 2]
**Visual States**: [State A] [State B] [State C]
**Integration**: [Callbacks needed] [String keys in i18n]
**Interactions**: [Button behavior] [Input handling]
**Acceptance Criteria**: [Mobile works] [RTL works] [No errors]

---

## Example: NotNowTimer Component (Already Built)
- Location: `src/features/not-now/NotNowTimer.tsx`
- Styles: `src/features/not-now/NotNowTimer.module.css`
- Translations: Already in `src/i18n.ts` under `notNow` key
- Props: `currentLang`, `locale`, `onCompleted`, `onCancel`
- Use this as a reference for similar components

---

NOW YOU'RE READY. What would you like me to build?
```

---

## HOW TO USE THIS

1. **Copy the entire section above** (between the backticks)
2. **Open a new Gemini conversation** 
3. **Paste it into the first message**
4. **Add your specific request** after pasting
5. **Gemini will remember these rules** for the entire conversation

## Example First Message:

```
[PASTE THE ABOVE]

---

## Feature Request: Gratitude Gamelet

**Therapeutic Purpose**: Interrupt rumination by anchoring user in present moment gratitude.

**User Flow**:
1. User taps "Grateful" button
2. Screen shows: "Notice 3 things you're grateful for right now"
3. User enters 3 items in text fields
4. Tap Submit → Success screen with +1 token reward
5. Return to home

**Visual States**:
- Intro: Title + 3 input fields + submit button
- Loading: Submit button shows spinner
- Success: Trophy emoji + reward message

[... rest of request ...]
```

---

## Additional Context Template

After pasting the rules, you can provide project context:

```
# Additional Context for This Session

## Existing Components Reference
- **Button.tsx**: Reusable button with loading state
- **Slider.tsx**: Range slider with color change on drag
- **OnboardingWizard.tsx**: Multi-screen wizard pattern

## Token Economy System (Future)
- User earns +1 token per completed micro-practice
- Stored in parent App state
- Passed down via props
- Used in dashboard summary

## Color Palette
- Primary: #2d3748
- Secondary: #718096
- Background: #f7fafc
- Success: #48bb78

## Typography
- Headings: Font-weight 700
- Body: Font-weight 400-600
- Font family: system-ui, -apple-system, BlinkMacSystemFont
```

---

## Save This File

Save as: **`GEMINI_QUICK_START.md`** in your project root

Every time you start a new Gemini conversation, copy-paste the section marked "PASTE THIS INTO GEMINI" and you'll get consistent, well-architected code.
