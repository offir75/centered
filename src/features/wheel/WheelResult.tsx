import React from 'react';
import styles from './WheelResult.module.css';
import type { Translations, WheelDomainKey } from '../../i18n';
import { DOMAIN_KEYS, getSufferingColor, type WheelScores } from './wheelOfLife.utils';

interface WheelResultProps {
  locale: Translations;
  scores: WheelScores;
  isRtl: boolean;
}

const SIZE = 360;
const CENTER = SIZE / 2;
const HUB_RADIUS = 16;
const OUTER_RADIUS = 100;
// Alternating radii keep adjacent labels from colliding around the rim.
const LABEL_RADIUS_NEAR = OUTER_RADIUS + 30;
const LABEL_RADIUS_FAR = OUTER_RADIUS + 55;
const MAX_LABEL_CHARS_PER_LINE = 10;
const LABEL_FONT_SIZE_PX = 13;
const LABEL_LINE_HEIGHT_PX = LABEL_FONT_SIZE_PX * 1.2;

const polarToCartesian = (radius: number, angle: number): { x: number; y: number } => ({
  x: CENTER + radius * Math.cos(angle),
  y: CENTER + radius * Math.sin(angle),
});

// Greedily splits a multi-word label into two roughly-even lines so long domain
// names (e.g. "פנאי ותחביבים") don't bleed past the wheel's rim.
const splitLabel = (label: string): string[] => {
  const words = label.split(' ');
  if (words.length < 2 || label.length <= MAX_LABEL_CHARS_PER_LINE) return [label];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
};

// Builds an annular-sector ("donut slice") path between innerR and outerR, startAngle to endAngle (radians).
const arcPath = (startAngle: number, endAngle: number, innerR: number, outerR: number): string => {
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  const p1 = polarToCartesian(innerR, startAngle);
  const p2 = polarToCartesian(outerR, startAngle);
  const p3 = polarToCartesian(outerR, endAngle);
  const p4 = polarToCartesian(innerR, endAngle);
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${p1.x} ${p1.y} Z`;
};

export const WheelResult: React.FC<WheelResultProps> = ({ locale, scores, isRtl }) => {
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
    const labelRadius = index % 2 === 0 ? LABEL_RADIUS_NEAR : LABEL_RADIUS_FAR;
    const labelPos = polarToCartesian(labelRadius, midAngle);
    const cos = Math.cos(midAngle);
    const textAnchor: 'start' | 'middle' | 'end' = cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle';
    const labelLines = splitLabel(t.domains[key as WheelDomainKey]);

    return {
      key,
      trackPath: arcPath(startAngle, endAngle, HUB_RADIUS, OUTER_RADIUS),
      fillPath: arcPath(startAngle, endAngle, HUB_RADIUS, filledRadius),
      color: getSufferingColor(score.suffering),
      labelPos,
      textAnchor,
      labelLines,
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
        {slices.map((slice) =>
          slice.labelLines.map((line, lineIndex) => {
            const lineCount = slice.labelLines.length;
            const offset = (lineIndex - (lineCount - 1) / 2) * LABEL_LINE_HEIGHT_PX;
            return (
              <text
                key={`${slice.key}-label-${lineIndex}`}
                x={slice.labelPos.x}
                y={slice.labelPos.y + offset}
                textAnchor={slice.textAnchor}
                dominantBaseline="middle"
                direction={isRtl ? 'rtl' : 'ltr'}
                className={styles.sliceLabel}
              >
                {line}
              </text>
            );
          })
        )}
      </svg>
    </div>
  );
};
