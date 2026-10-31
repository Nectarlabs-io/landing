const wholeNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** 1234567 → "1,234,567" */
export function formatWhole(value: number): string {
  return wholeNumber.format(value);
}

/** Millions of dollars: 274 → "$274.0M", 23.9 → "$23.9M", 8.97 → "$8.97M", null → "—". */
export function formatMillions(value: number | null): string {
  if (value == null) return "—";
  const digits = value >= 100 ? 1 : value < 10 ? 2 : 1;
  return `$${value.toFixed(digits)}M`;
}

/** Fraction to one-decimal percent: 0.087 → "8.7%". */
export function formatShare(fraction: number): string {
  return `${(fraction * 100).toFixed(1)}%`;
}
