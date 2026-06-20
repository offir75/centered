import React from 'react';
import styles from './WheelResult.module.css';
import type { Translations, WheelDomainKey } from '../../i18n';
import { DOMAIN_KEYS, getSufferingColor, type WheelScores } from './wheelOfLife.utils';

interface WheelResultProps {
  locale: Translations;
  scores: WheelScores;
}

const SIZE = 320;
const CENTER = SIZE / 2;
const HUB_RADIUS = 16;
const OUTER_RADIUS = 110;
const LABEL_RADIUS = OUTER_RADIUS + 30;

const polarToCartesian = (radius: number, angle: number): { x: number; y: number } => ({
  x: CENTER + radius * Math.cos(angle),
  y: CENTER + radius * Math.sin(angle),
});

// Builds an annular-sector ("donut slice") path between innerR and outerR, startAngle to endAngle (radians).
const arcPath = (startAngle: number, endAngle: number, innerR: number, outerR: number): string => {
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  const p1 = polarToCartesian(innerR, startAngle);
  const p2 = polarToCartesian(outerR, startAngle);
  const p3 = polarToCartesian(outerR, endAngle);
  const p4 = polarToCartesian(innerR, endAngle);
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${p1.x} ${p1.y} Z`;
};

export const WheelResult: React.FC<WheelResultProps> = ({ locale, scores }) => {
  const t = locale.wheelOfLife;
  const totalTime = DOMAIN_KEYS.reduce((sum, key) => sum + scores[key].time, 0);

  const startAngles = DOMAIN_KEYS.reduce<number[]>((acc, _key, index) => {
    const previous = index === 0 ? -Math.PI / 2 : acc[index - 1] + (scores[DOMAIN_KEYS[index - 1]].time / totalTime) * 2 * Math.PI;
    acc.push(previous);
    return acc;
  }, []);

  const slices = DOMAIN_KEYS.map((key, index) => {
    const score = scores[key];
    const sliceAngle = (score.time / totalTime) * 2 * Math.PI;
    const startAngle = startAngles[index];
    const endAngle = startAngle + sliceAngle;

    const filledRadius = HUB_RADIUS + (OUTER_RADIUS - HUB_RADIUS) * (score.suffering / 10);
    const midAngle = (startAngle + endAngle) / 2;
    const labelPos = polarToCartesian(LABEL_RADIUS, midAngle);
    const cos = Math.cos(midAngle);
    const textAnchor: 'start' | 'middle' | 'end' = cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle';

    return {
      key,
      trackPath: arcPath(startAngle, endAngle, HUB_RADIUS, OUTER_RADIUS),
      fillPath: arcPath(startAngle, endAngle, HUB_RADIUS, filledRadius),
      color: getSufferingColor(score.suffering),
      labelPos,
      textAnchor,
    };
  });

  return (
    <div className={styles.wheelWrapper}>
      <svg
        className={styles.wheelSvg}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={t.analysis.wheelCaption}
      >
        {slices.map((slice) => (
          <path key={`${slice.key}-track`} d={slice.trackPath} fill="#edf2f7" stroke="#ffffff" strokeWidth={2} />
        ))}
        {slices.map((slice) => (
          <path key={`${slice.key}-fill`} d={slice.fillPath} fill={slice.color} stroke="#ffffff" strokeWidth={2} />
        ))}
        <circle cx={CENTER} cy={CENTER} r={HUB_RADIUS} className={styles.hub} />
        {slices.map((slice) => (
          <text
            key={`${slice.key}-label`}
            x={slice.labelPos.x}
            y={slice.labelPos.y}
            textAnchor={slice.textAnchor}
            dominantBaseline="middle"
            className={styles.sliceLabel}
          >
            {t.domains[slice.key as WheelDomainKey]}
          </text>
        ))}
      </svg>
    </div>
  );
};
