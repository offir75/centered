import React from 'react';
import './HamburgerMenu.css';
import type { Language, Translations } from '../../i18n';

interface Props {
  language: Language;
  setLanguage: (l: Language) => void;
  locale: Translations;
  onGoHome?: () => void;
  showHome?: boolean;
}

export const HamburgerMenu: React.FC<Props> = ({ language, setLanguage, locale, onGoHome, showHome }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="hamburger-menu">
      <button
        className="hamburger-button"
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>

      {open && (
        <div className="hamburger-panel" role="menu">
          <div className="menu-section">
            <div className="menu-title">{locale.languageSwitcher.label}</div>
            <div className="menu-actions">
              <button
                type="button"
                className={`btn btn-secondary ${language === 'en' ? 'active' : ''}`}
                onClick={() => {
                  setLanguage('en');
                  setOpen(false);
                }}
              >
                {locale.languageSwitcher.en}
              </button>

              <button
                type="button"
                className={`btn btn-secondary ${language === 'he' ? 'active' : ''}`}
                onClick={() => {
                  setLanguage('he');
                  setOpen(false);
                }}
              >
                {locale.languageSwitcher.he}
              </button>
            </div>
          </div>

          {showHome && onGoHome && (
            <div className="menu-section">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  onGoHome();
                  setOpen(false);
                }}
              >
                {locale.homeLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
