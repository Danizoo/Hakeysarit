const hebrewDate = new Intl.DateTimeFormat('he-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const hebrewMonth = new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' });

export function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : hebrewDate.format(date);
}

export function formatMonth(iso: string | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : hebrewMonth.format(date);
}

/** 9 -> "9", 8.5 -> "8.5" */
export function formatScore(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

export function formatPrice(price: number | undefined): string {
  return price == null ? '' : `₪${Math.round(price)}`;
}

export type ScoreBand = {
  label: string;
  /** Solid background for badges and pins */
  bg: string;
  /** Text colour on light surfaces */
  fg: string;
};

/** A word and a colour for each stretch of the scale. */
export function scoreBand(score: number): ScoreBand {
  if (score >= 9) return { label: 'יצירת מופת', bg: '#3a5f31', fg: '#3a5f31' };
  if (score >= 8) return { label: 'מצוין', bg: '#4a7a3e', fg: '#4a7a3e' };
  if (score >= 7) return { label: 'טוב מאוד', bg: '#7ba46a', fg: '#4a7a3e' };
  if (score >= 6) return { label: 'בסדר גמור', bg: '#c69326', fg: '#96700f' };
  if (score >= 5) return { label: 'ככה־ככה', bg: '#c98a3d', fg: '#a3661f' };
  if (score >= 4) return { label: 'מאכזב', bg: '#b0552c', fg: '#b0552c' };
  return { label: 'לא, תודה', bg: '#8f3a1c', fg: '#8f3a1c' };
}

/** Average of whatever sub-scores were filled in, or undefined if none were. */
export function averageSubScores(subScores: Record<string, number | undefined> | undefined): number | undefined {
  if (!subScores) return undefined;
  const values = Object.values(subScores).filter((v): v is number => typeof v === 'number');
  if (!values.length) return undefined;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
