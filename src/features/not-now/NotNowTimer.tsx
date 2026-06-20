import React, { useState, useEffect, useRef } from 'react';
import styles from './NotNowTimer.module.css';
import type { Language, Translations } from '../../i18n';

interface NotNowTimerProps {
  currentLang: Language;
  locale: Translations;
  onCompleted: (tokensEarned: number) => void;
  onCancel: () => void;
}

type TimerPhase = 'intro' | 'active' | 'success';
type BreathPhase = 'in' | 'out';

export const NotNowTimer: React.FC<NotNowTimerProps> = ({
  currentLang,
  locale,
  onCompleted,
  onCancel,
}) => {
  const isRtl = currentLang === 'he';
  const t = locale.notNow;

  const [phase, setPhase] = useState<TimerPhase>('intro');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('in');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Main timer countdown
  useEffect(() => {
    if (phase === 'active' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (phase === 'active' && timeLeft === 0) {
      setPhase('success');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, timeLeft]);

  // Breath synchronization (4s in, 4s out)
  useEffect(() => {
    if (phase === 'active') {
      breathRef.current = setInterval(() => {
        setBreathPhase((prev) => (prev === 'in' ? 'out' : 'in'));
      }, 4000);
    }

    return () => {
      if (breathRef.current) clearInterval(breathRef.current);
    };
  }, [phase]);

  const startPractice = () => {
    setPhase('active');
    setTimeLeft(60);
    setBreathPhase('in');
  };

  const handleCompletion = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathRef.current) clearInterval(breathRef.current);
    onCompleted(1);
  };

  const handleCancel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathRef.current) clearInterval(breathRef.current);
    setPhase('intro');
    setTimeLeft(60);
    setBreathPhase('in');
    onCancel();
  };

  // SVG ring progress calculation
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 60) * circumference;

  return (
    <div
      className={`${styles.container} ${
        isRtl ? styles['container--rtl'] : styles['container--ltr']
      }`}
    >
      {phase === 'intro' && (
        <div className={styles.introCard}>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.subtitle}>{t.subtitle}</p>

          <div className={styles.mantraDisplay}>« {t.mantra} »</div>

          <button className={styles.primaryButton} onClick={startPractice}>
            {t.mantra}
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            {t.cancel}
          </button>
        </div>
      )}

      {phase === 'active' && (
        <div className={styles.timerScreen}>
          <div
            className={`${styles.backgroundPulse} ${
              styles[`backgroundPulse--${breathPhase}`]
            }`}
          />

          <div className={styles.progressWrapper}>
            <svg className={styles.svgRing} width="200" height="200">
              <circle className={styles.svgTrack} cx="100" cy="100" r={radius} />
              <circle
                className={styles.svgIndicator}
                cx="100"
                cy="100"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className={styles.counterLayer}>
              <span className={styles.timeDigits}>{timeLeft}</span>
              <span className={styles.breathPrompt}>
                {breathPhase === 'in' ? t.breathIn : t.breathOut}
              </span>
            </div>
          </div>

          <div className={styles.activeMantra}>« {t.mantra} »</div>
          <p className={styles.instruction}>{t.stayCentred}</p>
        </div>
      )}

      {phase === 'success' && (
        <div className={styles.successSummary}>
          <div className={styles.successIcon}>💎</div>
          <h3 className={styles.successMessage}>{t.success}</h3>
          <button className={styles.primaryButton} onClick={handleCompletion}>
            {t.finish}
          </button>
        </div>
      )}
    </div>
  );
};
