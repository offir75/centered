import type { WheelDomainKey } from '../../i18n';

export interface DomainScore {
  time: number;
  suffering: number;
}

export type WheelScores = Record<WheelDomainKey, DomainScore>;

export interface WheelHistoryEntry {
  date: string;
  scores: WheelScores;
  balanceScore: number;
}

export const DOMAIN_KEYS: WheelDomainKey[] = [
  'work',
  'family',
  'partnership',
  'body',
  'leisure',
  'externalWorld',
  'finances',
  'community',
];

export const DOMAIN_ICONS: Record<WheelDomainKey, string> = {
  work: '💼',
  family: '👨‍👩‍👧',
  partnership: '💞',
  body: '🧘',
  leisure: '🎨',
  externalWorld: '🌐',
  finances: '💰',
  community: '🤝',
};

export type PracticeKey = 'notNow' | 'breathing' | 'headHeart';

// Maps each life domain to the Trilotherapy micro-practice most likely to help with it.
export const PRACTICE_BY_DOMAIN: Record<WheelDomainKey, PracticeKey> = {
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
const DEFAULT_SCORE = 5;

export const createDefaultScores = (): WheelScores =>
  DOMAIN_KEYS.reduce((acc, key) => {
    acc[key] = { time: DEFAULT_SCORE, suffering: DEFAULT_SCORE };
    return acc;
  }, {} as WheelScores);

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

// Calculated entirely client-side (no network/AI call) so it stays instant, private, and free.
// Inverted from the suffering scale: low average suffering => high balance score.
export const calculateBalanceScore = (scores: WheelScores): number => {
  const total = DOMAIN_KEYS.reduce((sum, key) => sum + scores[key].suffering, 0);
  const averageSuffering = total / DOMAIN_KEYS.length;
  const inverted = clamp(11 - averageSuffering, 1, 10);
  return Math.ceil(inverted * 2) / 2;
};

export const getMostSufferingDomain = (scores: WheelScores): WheelDomainKey => {
  return DOMAIN_KEYS.reduce(
    (worst, key) => (scores[key].suffering > scores[worst].suffering ? key : worst),
    DOMAIN_KEYS[0]
  );
};

export const getTier = (balanceScore: number): 'low' | 'moderate' | 'high' => {
  if (balanceScore < 5) return 'low';
  if (balanceScore < 8) return 'moderate';
  return 'high';
};

export const getTrend = (
  current: number,
  previous: number | undefined
): 'improved' | 'declined' | 'same' | 'firstTime' => {
  if (previous === undefined) return 'firstTime';
  if (current > previous) return 'improved';
  if (current < previous) return 'declined';
  return 'same';
};

export const formatScore = (value: number): string => (Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1));

// Green (1, low suffering) -> Yellow (5) -> Red (10, high suffering).
export const getSufferingColor = (value: number): string => {
  const hue = 120 - ((clamp(value, 1, 10) - 1) / 9) * 120;
  return `hsl(${hue}, 70%, 45%)`;
};

export const loadHistory = (): WheelHistoryEntry[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as WheelHistoryEntry[]) : [];
  } catch {
    return [];
  }
};

export const saveHistoryEntry = (entry: WheelHistoryEntry): void => {
  const updated = [...loadHistory(), entry].slice(-HISTORY_LIMIT);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};
