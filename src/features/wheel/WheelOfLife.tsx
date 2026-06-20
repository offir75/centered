import React, { useMemo, useState } from 'react';
import styles from './WheelOfLife.module.css';
import type { Language, Translations, WheelDomainKey } from '../../i18n';

type WheelScores = Record<WheelDomainKey, number>;

interface WheelHistoryEntry {
  date: string;
  scores: WheelScores;
  balanceScore: number;
}

interface WheelOfLifeProps {
  currentLang: Language;
  locale: Translations;
  onFinish: () => void;
  onCancel: () => void;
}

const DOMAIN_KEYS: WheelDomainKey[] = [
  'work',
  'family',
  'partnership',
  'body',
  'leisure',
  'externalWorld',
  'finances',
  'community',
];

const DOMAIN_ICONS: Record<WheelDomainKey, string> = {
  work: '💼',
  family: '👨‍👩‍👧',
  partnership: '💞',
  body: '🧘',
  leisure: '🎨',
  externalWorld: '🌐',
  finances: '💰',
  community: '🤝',
};

type PracticeKey = 'notNow' | 'breathing' | 'headHeart';

// Maps each life domain to the Trilotherapy micro-practice most likely to help with it.
const PRACTICE_BY_DOMAIN: Record<WheelDomainKey, PracticeKey> = {
  work: 'notNow',
  family: 'headHeart',
  partnership: 'headHeart',
  body: 'breathing',
  leisure: 'breathing',
  externalWorld: 'notNow',
  finances: 'breathing',
  community: 'headHeart',
};

const HISTORY_KEY = 'centered:wheelOfLife:history';
const HISTORY_LIMIT = 10;
const DEFAULT_SCORE = 5.5;

const loadHistory = (): WheelHistoryEntry[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as WheelHistoryEntry[]) : [];
  } catch {
    return [];
  }
};

const saveHistoryEntry = (entry: WheelHistoryEntry): void => {
  const updated = [...loadHistory(), entry].slice(-HISTORY_LIMIT);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

const createDefaultScores = (): WheelScores =>
  DOMAIN_KEYS.reduce((acc, key) => {
    acc[key] = DEFAULT_SCORE;
    return acc;
  }, {} as WheelScores);

// Calculated entirely client-side (no network/AI call) so it stays instant, private, and free.
const calculateBalanceScore = (scores: WheelScores): number => {
  const total = DOMAIN_KEYS.reduce((sum, key) => sum + scores[key], 0);
  const average = total / DOMAIN_KEYS.length;
  return Math.ceil(average * 2) / 2;
};

const getLowestDomain = (scores: WheelScores): WheelDomainKey => {
  return DOMAIN_KEYS.reduce((lowest, key) => (scores[key] < scores[lowest] ? key : lowest), DOMAIN_KEYS[0]);
};

const getTier = (balanceScore: number): 'low' | 'moderate' | 'high' => {
  if (balanceScore < 5) return 'low';
  if (balanceScore < 8) return 'moderate';
  return 'high';
};

const getTrend = (current: number, previous: number | undefined): 'improved' | 'declined' | 'same' | 'firstTime' => {
  if (previous === undefined) return 'firstTime';
  if (current > previous) return 'improved';
  if (current < previous) return 'declined';
  return 'same';
};

const formatScore = (value: number): string => (Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1));

export const WheelOfLife: React.FC<WheelOfLifeProps> = ({ currentLang, locale, onFinish, onCancel }) => {
  const t = locale.wheelOfLife;
  const isRtl = currentLang === 'he';

  const [phase, setPhase] = useState<'intro' | 'domain' | 'analysis'>('intro');
  const [domainIndex, setDomainIndex] = useState(0);
  const [scores, setScores] = useState<WheelScores>(createDefaultScores);
  const [previousEntry] = useState<WheelHistoryEntry | undefined>(() => {
    const history = loadHistory();
    return history[history.length - 1];
  });
  const [result, setResult] = useState<{ balanceScore: number; lowestDomain: WheelDomainKey } | null>(null);

  const currentDomain = DOMAIN_KEYS[domainIndex];

  const progressText = t.progress
    .replace('{current}', String(domainIndex + 1))
    .replace('{total}', String(DOMAIN_KEYS.length));

  const handleSliderChange = (value: number) => {
    setScores((prev) => ({ ...prev, [currentDomain]: value }));
  };

  const handleBack = () => {
    if (domainIndex === 0) {
      setPhase('intro');
    } else {
      setDomainIndex((i) => i - 1);
    }
  };

  const handleNext = () => {
    if (domainIndex < DOMAIN_KEYS.length - 1) {
      setDomainIndex((i) => i + 1);
      return;
    }

    const balanceScore = calculateBalanceScore(scores);
    const lowestDomain = getLowestDomain(scores);
    saveHistoryEntry({ date: new Date().toISOString(), scores, balanceScore });
    setResult({ balanceScore, lowestDomain });
    setPhase('analysis');
  };

  const tier = useMemo(() => (result ? getTier(result.balanceScore) : 'moderate'), [result]);
  const trend = useMemo(
    () => (result ? getTrend(result.balanceScore, previousEntry?.balanceScore) : 'firstTime'),
    [result, previousEntry]
  );
  const practice = result ? t.analysis.practices[PRACTICE_BY_DOMAIN[result.lowestDomain]] : null;

  return (
    <div className={`${styles.container} ${isRtl ? styles['container--rtl'] : styles['container--ltr']}`}>
      {phase === 'intro' && (
        <section className={styles.introScreen}>
          <h1 className={styles.title}>{t.intro.title}</h1>
          <p className={styles.subtitle}>{t.intro.description}</p>
          <div className={styles.buttonGroup}>
            <button className={styles.primaryButton} onClick={() => setPhase('domain')}>
              {t.intro.cta}
            </button>
            <button className={styles.secondaryButton} onClick={onCancel}>
              {locale.homeLabel}
            </button>
          </div>
        </section>
      )}

      {phase === 'domain' && (
        <section className={styles.domainScreen}>
          <div className={styles.progressBar} aria-label={progressText}>
            {DOMAIN_KEYS.map((_, index) => (
              <div
                key={index}
                className={`${styles.progressSegment} ${index <= domainIndex ? styles['progressSegment--filled'] : ''}`}
              />
            ))}
          </div>
          <p className={styles.progressLabel}>{progressText}</p>

          <div className={styles.domainIcon}>{DOMAIN_ICONS[currentDomain]}</div>
          <h2 className={styles.domainTitle}>{t.domains[currentDomain]}</h2>
          <p className={styles.domainDescription}>{t.domainDescriptions[currentDomain]}</p>

          <div className={styles.sliderCard}>
            <label className={styles.sliderQuestion}>{t.sliderQuestion}</label>
            <div className={styles.sliderWrapper}>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={scores[currentDomain]}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className={styles.slider}
                aria-label={`${t.domains[currentDomain]} - ${t.sliderQuestion}`}
              />
              <span className={styles.sliderValue}>{formatScore(scores[currentDomain])}</span>
            </div>
            <div className={styles.sliderLabels}>
              <span>{t.sliderLowLabel}</span>
              <span>{t.sliderHighLabel}</span>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.primaryButton} onClick={handleNext}>
              {domainIndex === DOMAIN_KEYS.length - 1 ? t.seeResults : locale.buttons.next}
            </button>
            <button className={styles.secondaryButton} onClick={handleBack}>
              {t.back}
            </button>
          </div>
        </section>
      )}

      {phase === 'analysis' && result && practice && (
        <section className={styles.analysisScreen}>
          <h1 className={styles.title}>{t.analysis.heading}</h1>
          <div className={styles.balanceScore}>{formatScore(result.balanceScore)}</div>
          <p className={styles.tierText}>{t.analysis.tier[tier]}</p>
          <p className={styles.trendText}>{t.analysis.trend[trend]}</p>

          <div className={styles.domainBars}>
            {DOMAIN_KEYS.map((key) => (
              <div key={key} className={styles.domainBarRow}>
                <span className={styles.domainBarLabel}>{t.domains[key]}</span>
                <div className={styles.domainBarTrack}>
                  <div className={styles.domainBarFill} style={{ width: `${(scores[key] / 10) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.practiceCard}>
            <h3 className={styles.practiceHeading}>{t.analysis.practiceHeading}</h3>
            <p className={styles.practiceIntro}>{t.analysis.practiceIntro}</p>
            <p className={styles.practiceDomain}>{t.domains[result.lowestDomain]}</p>
            <p className={styles.practiceTitle}>{practice.title}</p>
            <p className={styles.practiceDescription}>{practice.description}</p>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.primaryButton} onClick={onFinish}>
              {t.analysis.finish}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
