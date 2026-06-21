import React, { useEffect, useState } from 'react';
import { OnboardingWizard } from './features/onboarding/OnboardingWizard';
import { NotNowTimer } from './features/not-now/NotNowTimer';
import { WheelOfLife } from './features/wheel/WheelOfLife';
import { translations } from './i18n';
import type { Language } from './i18n';
import { HamburgerMenu } from './components/common/HamburgerMenu';

const App: React.FC = function() {
  const [language, setLanguage] = useState<Language>('he');
  const [activeView, setActiveView] = useState<'home' | 'fourElements' | 'notNow' | 'wheel'>('home');
  const locale = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  const goHome = () => setActiveView('home');

  const startFourElements = () => setActiveView('fourElements');

  const startNotNow = () => setActiveView('notNow');

  const startWheel = () => setActiveView('wheel');

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title">{locale.appName}</div>
        <div className="header-actions">
          {activeView !== 'home' && (
            <button className="btn btn-secondary home-button" type="button" onClick={goHome}>
              {locale.homeLabel}
            </button>
          )}
          <HamburgerMenu
            language={language}
            setLanguage={setLanguage}
            locale={locale}
            onGoHome={goHome}
            showHome={activeView !== 'home'}
          />
        </div>
      </header>

      <main className="app-content">
      {activeView === 'home' ? (
        <section className="dashboard-screen">
          <div className="dashboard-hero">
            <h1>{locale.dashboard.title}</h1>
            <p>{locale.dashboard.subtitle}</p>
          </div>

          <div className="dashboard-grid">
            <button type="button" className="game-card game-card-primary" onClick={startFourElements}>
              <span className="card-icon">🔥</span>
              <div>
                <h2>{locale.dashboard.elements.title}</h2>
                <p>{locale.dashboard.elements.description}</p>
              </div>
            </button>

            <button type="button" className="game-card game-card-primary" onClick={startNotNow}>
              <span className="card-icon">⏱️</span>
              <div>
                <h2>{locale.dashboard.notNow.title}</h2>
                <p>{locale.dashboard.notNow.description}</p>
              </div>
            </button>

            <button type="button" className="game-card game-card-primary" onClick={startWheel}>
              <span className="card-icon">🎡</span>
              <div>
                <h2>{locale.dashboard.wheel.title}</h2>
                <p>{locale.dashboard.wheel.description}</p>
              </div>
            </button>
          </div>
        </section>
      ) : activeView === 'fourElements' ? (
        <OnboardingWizard locale={locale} onReturnHome={goHome} />
      ) : activeView === 'notNow' ? (
        <NotNowTimer
          currentLang={language}
          locale={locale}
          onCompleted={(tokens) => {
            console.log(`Earned ${tokens} tokens`);
            // TODO: Update token economy
            goHome();
          }}
          onCancel={goHome}
        />
      ) : (
        <WheelOfLife currentLang={language} locale={locale} onFinish={goHome} onCancel={goHome} />
      )}
      </main>
    </div>
  );
};

export default App;
