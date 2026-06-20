# NotNowTimer Integration Guide

## What Was Done

1. **Refactored Gemini Code** to match your project structure:
   - Component: `src/features/not-now/NotNowTimer.tsx`
   - Styles: `src/features/not-now/NotNowTimer.module.css`
   - Translations: Added to `src/i18n.ts` (EN + HE)

2. **Key Changes from Gemini Output**:
   - ✅ Integrated with your custom i18n system (not separate localization object)
   - ✅ Accepts `locale: Translations` prop (matches your pattern)
   - ✅ Uses `Language` type from i18n
   - ✅ Full RTL/LTR support via `container--rtl` and `container--ltr`
   - ✅ Mobile-optimized (64px touch targets)
   - ✅ Proper TypeScript typing with your conventions
   - ✅ Cleanup of all intervals/timeouts on unmount
   - ✅ CSS Module with mobile breakpoints

## How to Use It

### In App.tsx:

```typescript
import { NotNowTimer } from './features/not-now/NotNowTimer';

const App: React.FC = function() {
  const [language, setLanguage] = useState<Language>('he');
  const [activeView, setActiveView] = useState<'home' | 'notNow' | 'fourElements'>('home');
  const locale = translations[language];

  const handleNotNowComplete = (tokensEarned: number) => {
    console.log(`Earned ${tokensEarned} tokens`);
    // TODO: Update token economy here
    setActiveView('home');
  };

  return (
    <div className="app-shell">
      {/* ... header ... */}
      
      {activeView === 'home' && (
        <section className="dashboard-screen">
          {/* Add button to launch NotNow */}
          <button onClick={() => setActiveView('notNow')}>
            {locale.dashboard.notNow.title}
          </button>
        </section>
      )}

      {activeView === 'notNow' && (
        <NotNowTimer
          currentLang={language}
          locale={locale}
          onCompleted={handleNotNowComplete}
          onCancel={() => setActiveView('home')}
        />
      )}
    </div>
  );
};
```

## Component Props

```typescript
interface NotNowTimerProps {
  currentLang: Language;              // 'en' | 'he'
  locale: Translations;               // Full translations object
  onCompleted: (tokensEarned: number) => void;  // Called when timer finishes
  onCancel: () => void;               // Called when user cancels
}
```

## Features Included

✅ **Three States**:
1. **Intro**: Title + mantra + start button
2. **Active**: 60-second countdown with SVG progress ring + breath guidance
3. **Success**: Token reward screen

✅ **Breath Synchronization**: 
- 4-second inhale + 4-second exhale cycle
- Background color pulses with breath phase
- Responsive design

✅ **Full i18n Support**:
- All text from `locale.notNow` object
- Both English and Hebrew translations included
- Automatic RTL/LTR detection

✅ **Mobile Optimized**:
- Touch-friendly button sizes (≥64px)
- Responsive SVG circle timer
- Responsive text sizes

## Translations Added to i18n.ts

English:
```typescript
notNow: {
  title: 'The Center Restorer',
  subtitle: 'When an urge strikes, sit upright. Do not fight it. Simply state:',
  mantra: 'Not Now',
  cancel: 'Cancel',
  breathIn: 'Inhale...',
  breathOut: 'Exhale...',
  stayCentred: 'Be Present',
  success: 'The wave passed! You earned +1 Here & Now Token',
  finish: 'Return to Hub',
}
```

Hebrew:
```typescript
notNow: {
  title: 'משקם נקודת האמצע',
  subtitle: 'כאשר דחף פוגש אותך, שב ישר. אל תילחם בו. פשוט אמור:',
  mantra: 'לא עכשיו',
  cancel: 'ביטול',
  breathIn: 'שאיפה...',
  breathOut: 'נשיפה...',
  stayCentred: 'נוכחות מלאה',
  success: 'הסערה חלפה! הרווחת +1 אסימון נוכחות',
  finish: 'חזרה ללוח הבקרה',
}
```

## Testing Checklist

- [ ] `npm run dev` → No errors
- [ ] Switch to Hebrew → All text RTL
- [ ] Switch to English → All text LTR
- [ ] Tap "Not Now" button → Timer starts
- [ ] Wait 60 seconds → Success screen appears
- [ ] Tap cancel → Returns to intro
- [ ] Test on mobile DevTools → Touch targets large enough
- [ ] Background pulses with 4-second cycle
- [ ] Breath prompts alternate between "Inhale" and "Exhale"

## Next Steps

1. **Add to Dashboard**: Link the button in App.tsx to launch this feature
2. **Token Economy**: Connect `onCompleted` callback to your token tracking system
3. **Testing**: Run locally and test both languages + mobile
4. **Styling Adjustments**: Customize colors/fonts to match your design system
5. **Audio (Future)**: Add guided voice directions for breathing

## Files Modified

- ✅ Created: `src/features/not-now/NotNowTimer.tsx`
- ✅ Created: `src/features/not-now/NotNowTimer.module.css`
- ✅ Modified: `src/i18n.ts` (added notNow type and translations)
