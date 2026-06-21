import React, { useMemo, useState } from 'react';
import styles from './WheelOfLife.module.css';
import type { Language, Translations, WheelDomainKey } from '../../i18n';
import { DomainStep } from './DomainStep';
import { WheelResult } from './WheelResult';
import {
  DOMAIN_KEYS,
  PRACTICE_BY_DOMAIN,
  calculateBalanceScore,
  createDefaultScores,
  formatScore,
  getMostSufferingDomain,
  getTier,
  getTrend,
  loadHistory,
  saveHistoryEntry,
  type WheelHistoryEntry,
  type WheelScores,
} from './wheelOfLife.utils';

interface WheelOfLifeProps {
  currentLang: Language;
  locale: Translations;
  onFinish: () => void;
  onCancel: () => void;
}

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
  const [result, setResult] = useState<{ balanceScore: number; worstDomain: WheelDomainKey; scores: WheelScores } | null>(
    null
  );

  const currentDomain = DOMAIN_KEYS[domainIndex];

  const handleChangeTime = (value: number) => {
    setScores((prev) => ({ ...prev, [currentDomain]: { ...prev[currentDomain], time: value } }));
  };

  const handleChangeSuffering = (value: number) => {
    setScores((prev) => ({ ...prev, [currentDomain]: { ...prev[currentDomain], suffering: value } }));
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
    const worstDomain = getMostSufferingDomain(scores);
    saveHistoryEntry({ date: new Date().toISOString(), scores, balanceScore });
    setResult({ balanceScore, worstDomain, scores });
    setPhase('analysis');
  };

  const tier = useMemo(() => (result ? getTier(result.balanceScore) : 'moderate'), [result]);
  const trend = useMemo(
    () => (result ? getTrend(result.balanceScore, previousEntry?.balanceScore) : 'firstTime'),
    [result, previousEntry]
  );
  const practice = result ? t.analysis.practices[PRACTICE_BY_DOMAIN[result.worstDomain]] : null;

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
        <DomainStep
          key={currentDomain}
          locale={locale}
          isRtl={isRtl}
          domain={currentDomain}
          domainIndex={domainIndex}
          totalDomains={DOMAIN_KEYS.length}
          score={scores[currentDomain]}
          onChangeTime={handleChangeTime}
          onChangeSuffering={handleChangeSuffering}
          onNext={handleNext}
          onBack={handleBack}
          isLastStep={domainIndex === DOMAIN_KEYS.length - 1}
        />
      )}

      {phase === 'analysis' && result && practice && (
        <section className={styles.analysisScreen}>
          <h1 className={styles.title}>{t.analysis.heading}</h1>
          <div className={styles.balanceScore}>{formatScore(result.balanceScore)}</div>
          <p className={styles.tierText}>{t.analysis.tier[tier]}</p>
          <p className={styles.trendText}>{t.analysis.trend[trend]}</p>

          <WheelResult locale={locale} scores={result.scores} isRtl={isRtl} />
          <p className={styles.wheelCaption}>{t.analysis.wheelCaption}</p>

          <div className={styles.practiceCard}>
            <h3 className={styles.practiceHeading}>{t.analysis.practiceHeading}</h3>
            <p className={styles.practiceIntro}>{t.analysis.practiceIntro}</p>
            <p className={styles.practiceDomain}>{t.domains[result.worstDomain]}</p>
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
