/**
 * Student area card headers — navy/slate family aligned with app `primary` (oklch ~255 hue).
 * Use instead of rainbow gradients for visual consistency.
 */
export const STUDENT_CARD_GRADIENTS = [
  "from-primary to-slate-900",
  "from-slate-700 to-slate-900",
  "from-slate-600 to-slate-800",
  "from-primary via-slate-800 to-slate-900",
  "from-slate-800 to-primary",
  "from-slate-900 via-slate-700 to-slate-950",
];

export function getStudentCardGradient(index) {
  const i = Number(index);
  const n = STUDENT_CARD_GRADIENTS.length;
  if (!Number.isFinite(i)) return STUDENT_CARD_GRADIENTS[0];
  const idx = ((i % n) + n) % n;
  return STUDENT_CARD_GRADIENTS[idx];
}
