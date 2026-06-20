import React from 'react';
import styles from './DomainStep.module.css';
import type { Translations, WheelDomainKey } from '../../i18n';
import { DOMAIN_ICONS, formatScore, getSufferingColor, type DomainScore } from './wheelOfLife.utils';

interface DomainStepProps {
  locale: Translations;
  domain: WheelDomainKey;
  domainIndex: number;
  totalDomains: number;
  score: DomainScore;
  onChangeTime: (value: number) => void;
  onChangeSuffering: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

export const DomainStep: React.FC<DomainStepProps> = ({
  locale,
  domain,
  domainIndex,
  totalDomains,
  score,
  onChangeTime,
  onChangeSuffering,
  onNext,
  onBack,
  isLastStep,
}) => {
  const t = locale.wheelOfLife;
  const progressText = t.progress.replace('{current}', String(domainIndex + 1)).replace('{total}', String(totalDomains));

  return (
    <section className={styles.screen}>
      <div className={styles.progressBar} aria-label={progressText}>
        {Array.from({ length: totalDomains }).map((_, index) => (
          <div
            key={index}
            className={`${styles.progressSegment} ${index <= domainIndex ? styles['progressSegment--filled'] : ''}`}
          />
        ))}
      </div>
      <p className={styles.progressLabel}>{progressText}</p>

      <div className={styles.domainIcon}>{DOMAIN_ICONS[domain]}</div>
      <h2 className={styles.domainTitle}>{t.domains[domain]}</h2>
      <p className={styles.domainDescription}>{t.domainDescriptions[domain]}</p>

      <div className={styles.sliderCard}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderTitle}>{t.time.title}</span>
          <span className={styles.sliderValueBadge}>{formatScore(score.time)}</span>
        </div>
        <p className={styles.sliderSubtext}>{t.time.subtext}</p>
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={score.time}
          onChange={(e) => onChangeTime(Number(e.target.value))}
          className={`${styles.slider} ${styles.sliderTime}`}
          aria-label={`${t.domains[domain]} - ${t.time.title}`}
        />
        <div className={styles.sliderEdgeLabels}>
          <span>{t.time.lowLabel}</span>
          <span>{t.time.highLabel}</span>
        </div>
      </div>

      <div className={styles.sliderCard}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderTitle}>{t.suffering.title}</span>
          <span className={styles.sliderValueBadge}>{formatScore(score.suffering)}</span>
        </div>
        <p className={styles.sliderSubtext}>{t.suffering.subtext}</p>
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={score.suffering}
          onChange={(e) => onChangeSuffering(Number(e.target.value))}
          className={`${styles.slider} ${styles.sliderSuffering}`}
          style={{ '--thumb-color': getSufferingColor(score.suffering) } as React.CSSProperties}
          aria-label={`${t.domains[domain]} - ${t.suffering.title}`}
        />
        <div className={`${styles.sliderEdgeLabels} ${styles.sliderEdgeLabelsSuffering}`}>
          <span>{t.suffering.lowLabel}</span>
          <span>{t.suffering.highLabel}</span>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.primaryButton} onClick={onNext}>
          {isLastStep ? t.seeResults : locale.buttons.next}
        </button>
        <button className={styles.secondaryButton} onClick={onBack}>
          {t.back}
        </button>
      </div>
    </section>
  );
};
