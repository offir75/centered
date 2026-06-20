import React, { useState, useMemo } from 'react';
import styles from './WheelOfLife.module.css';
import type { Language, Translations } from '../../i18n';

interface DomainScore {
  time: number; // 1-10 time investment
  distress: number; // 1-10 distress level
}

interface WheelData {
  work: DomainScore;
  family: DomainScore;
  partnership: DomainScore;
  body: DomainScore;
  leisure: DomainScore;
  spirituality: DomainScore;
  finances: DomainScore;
  community: DomainScore;
}

interface WheelOfLifeProps {
  currentLang: Language;
  locale: Translations;
  onSave: (data: WheelData) => void;
  onCancel: () => void;
}

const DOMAIN_KEYS = ['work', 'family', 'partnership', 'body', 'leisure', 'spirituality', 'finances', 'community'] as const;

/**
 * Calculate wheel smoothness (standard deviation from center)
 * Lower = smoother ride. Values range from 0-100
 */
const calculateSmoothness = (data: WheelData): number => {
  const values = DOMAIN_KEYS.map((key) => {
    const domain = data[key as keyof WheelData];
    // Combine time investment with distress (distress reduces smoothness)
    return domain.time - domain.distress;
  });

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Normalize to 0-100 scale (lower stddev = higher smoothness score)
  return Math.max(0, 100 - stdDev * 10);
};

export const WheelOfLife: React.FC<WheelOfLifeProps> = ({
  currentLang,
  locale,
  onSave,
  onCancel,
}) => {
  const t = locale.wheelOfLife;
  const isRtl = currentLang === 'he';

  const [wheelData, setWheelData] = useState<WheelData>({
    work: { time: 5, distress: 5 },
    family: { time: 5, distress: 5 },
    partnership: { time: 5, distress: 5 },
    body: { time: 5, distress: 5 },
    leisure: { time: 5, distress: 5 },
    spirituality: { time: 5, distress: 5 },
    finances: { time: 5, distress: 5 },
    community: { time: 5, distress: 5 },
  });

  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);

  const smoothnessScore = useMemo(() => calculateSmoothness(wheelData), [wheelData]);

  const handleDomainChange = (
    domain: keyof WheelData,
    field: 'time' | 'distress',
    value: number
  ) => {
    setWheelData((prev) => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    onSave(wheelData);
  };

  /**
   * Coordinate calculator for SVG arc paths
   * Converts polar coordinates to cartesian
   */
  const getCoordinates = (angle: number, radius: number, centerX: number, centerY: number) => {
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    return { x, y };
  };

  /**
   * SVG rendering of wheel visualization with width-based (time) and depth-based (distress)
   * - Width of slice = proportion of timeInvestment (angle)
   * - Depth of slice = distressLevel (inner to outer radius)
   */
  const renderWheel = () => {
    const size = 280;
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size / 2.8;
    const baseInnerRadius = outerRadius * 0.28;

    // Calculate total time investment across all domains
    const totalTime = DOMAIN_KEYS.reduce((sum, key) => {
      return sum + wheelData[key as keyof WheelData].time;
    }, 0);

    let currentAngle = -Math.PI / 2; // Start from top

    const slices = DOMAIN_KEYS.map((key) => {
      const domain = wheelData[key as keyof WheelData];
      
      // STEP 1: Calculate slice angle based on TIME INVESTMENT (width)
      // Higher timeInvestment = wider angle
      const sliceAngle = (domain.time / totalTime) * Math.PI * 2;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      // STEP 2: Calculate inner and outer radius based on DISTRESS LEVEL (depth)
      // Low distress (1) = stays close to center
      // High distress (10) = extends to outer edge (thermometer effect)
      const distressRatio = domain.distress / 10;
      const innerRadius = baseInnerRadius * (1 - distressRatio * 0.6);
      const sliceOuterRadius = baseInnerRadius + (outerRadius - baseInnerRadius) * distressRatio;

      // STEP 3: Calculate SVG path coordinates
      const start = getCoordinates(startAngle, innerRadius, centerX, centerY);
      const outerStart = getCoordinates(startAngle, sliceOuterRadius, centerX, centerY);
      const outerEnd = getCoordinates(endAngle, sliceOuterRadius, centerX, centerY);
      const end = getCoordinates(endAngle, innerRadius, centerX, centerY);

      // Large arc flag (use 1 if angle > 180 degrees)
      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      // Construct SVG path: inner line → outer arc → outer line → inner arc → close
      const pathData = `
        M ${start.x} ${start.y}
        L ${outerStart.x} ${outerStart.y}
        A ${sliceOuterRadius} ${sliceOuterRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}
        L ${end.x} ${end.y}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${start.x} ${start.y}
        Z
      `;

      // STEP 4: Calculate color based on distress (green → yellow → orange → red)
      const hue = 120 - (domain.distress / 10) * 120; // 120° (green) to 0° (red)
      const saturation = 60 + (domain.distress / 10) * 20;
      const lightness = 60 - (domain.distress / 10) * 15;
      const isHovered = hoveredDomain === key;

      return (
        <path
          key={key}
          d={pathData}
          fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
          stroke="#ffffff"
          strokeWidth={isHovered ? '3' : '2'}
          opacity={isHovered ? 1 : 0.9}
          className={styles.wheelSlice}
          onMouseEnter={() => setHoveredDomain(key)}
          onMouseLeave={() => setHoveredDomain(null)}
          style={{
            transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
            cursor: 'pointer',
          }}
        />
      );
    });

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.wheelSvg}>
        {/* Center circle */}
        <circle cx={centerX} cy={centerY} r={baseInnerRadius} fill="#f7fafc" stroke="#cbd5e0" strokeWidth="2" />
        {slices}
      </svg>
    );
  };

  return (
    <div
      className={`${styles.container} ${
        isRtl ? styles['container--rtl'] : styles['container--ltr']
      }`}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </header>

      {/* Wheel Visualization */}
      <div className={styles.wheelSection}>
        <div className={styles.wheelDisplay}>{renderWheel()}</div>
        <div className={styles.smoothnessIndicator}>
          <span className={styles.smoothnessLabel}>{t.smoothness}</span>
          <span
            className={`${styles.smoothnessValue} ${
              smoothnessScore > 50 ? styles['smoothnessValue--good'] : styles['smoothnessValue--warning']
            }`}
          >
            {smoothnessScore > 50 ? t.smoothnessHigh : t.smoothnessLow}
          </span>
          <span className={styles.smoothnessScore}>{Math.round(smoothnessScore)}/100</span>
        </div>
      </div>

      {/* Domain Input Cards */}
      <section className={styles.domainsSection}>
        {DOMAIN_KEYS.map((key) => (
          <div key={key} className={styles.domainCard}>
            <h3 className={styles.domainTitle}>{t.domains[key as keyof typeof t.domains]}</h3>

            <div className={styles.sliderGroup}>
              <label className={styles.sliderLabel}>{t.timeLabel}</label>
              <div className={styles.sliderWrapper}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={wheelData[key as keyof WheelData].time}
                  onChange={(e) =>
                    handleDomainChange(key as keyof WheelData, 'time', Number(e.target.value))
                  }
                  className={styles.slider}
                  aria-label={`${t.domains[key as keyof typeof t.domains]} - ${t.timeLabel}`}
                />
                <span className={styles.sliderValue}>
                  {wheelData[key as keyof WheelData].time}
                </span>
              </div>
            </div>

            <div className={styles.sliderGroup}>
              <label className={styles.sliderLabel}>{t.distressLabel}</label>
              <div className={styles.sliderWrapper}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={wheelData[key as keyof WheelData].distress}
                  onChange={(e) =>
                    handleDomainChange(key as keyof WheelData, 'distress', Number(e.target.value))
                  }
                  className={styles.slider}
                  aria-label={`${t.domains[key as keyof typeof t.domains]} - ${t.distressLabel}`}
                />
                <span className={styles.sliderValue}>
                  {wheelData[key as keyof WheelData].distress}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Summary Note */}
      <div className={styles.summaryNote}>
        <p>{t.summary}</p>
      </div>

      {/* Action Buttons */}
      <div className={styles.buttonGroup}>
        <button className={styles.primaryButton} onClick={handleSave}>
          {t.save}
        </button>
        <button className={styles.secondaryButton} onClick={onCancel}>
          {locale.buttons.reset}
        </button>
      </div>
    </div>
  );
};
