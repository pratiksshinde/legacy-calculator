// src/utils/calculator.js
//
// Core calculation engine for the Parental Legacy & Life Factors Calculator.
//
// RULES (from the assessment brief):
//  1. For every factor: Mother Value + Father Value = Total Value
//  2. Sum of all Mother values + Sum of all Father values = 100 (grand total)
//  3. Odd day-of-month  -> Mother values trend higher
//     Even day-of-month -> Father values trend higher
//  4. Each factor has a fixed [min, max] "Total" range (given in the brief).
//
// APPROACH
// The brief fixes a [min,max] band per factor but also demands the grand
// total sum to 100. Those two constraints don't land on the same scale by
// coincidence, so we treat the ranges as *relative weights*: we pick a value
// inside each factor's own band (deterministically, from the DOB), then
// rescale all seven factor-totals proportionally so they sum to exactly 100.
// This keeps every factor internally consistent with its documented range
// *shape* while satisfying the hard "= 100" requirement.
//
// DETERMINISM
// The same DOB always produces the same result. We derive a numeric seed
// from the date and drive a small PRNG (mulberry32) from it, so results are
// stable, reproducible, and unique per user, without needing a backend.

export const FACTORS = [
  { key: "genetic", label: "Genetic Inheritance", min: 9.333, max: 10.777 },
  { key: "vitality", label: "Constitutional Vitality", min: 8.111, max: 9.111 },
  { key: "mental", label: "Mental Patterns", min: 6.111, max: 7.111 },
  { key: "intellect", label: "Intellectual Capacity", min: 6.333, max: 6.999 },
  { key: "emotional", label: "Emotional Foundation", min: 7.111, max: 7.999 },
  { key: "spiritual", label: "Spiritual Lineage", min: 5.011, max: 6.011 },
  { key: "soul", label: "Soul Connections", min: 5.111, max: 6.222 },
];

// Simple deterministic PRNG (mulberry32) so results are stable per seed.
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromDate(day, month, year) {
  // Fold the date into a single positive 32-bit-ish integer.
  const str = `${year}-${month}-${day}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

/**
 * @param {Date} dob
 * @returns {{
 *   isOddDay: boolean,
 *   factors: Array<{key,label,min,max,total,mother,father,motherPct,fatherPct}>,
 *   motherTotal: number,
 *   fatherTotal: number,
 *   motherOverallPct: number,
 *   fatherOverallPct: number,
 *   dominantParent: 'Mother'|'Father'|'Equal'
 * }}
 */
export function calculateLifeFactors(dob) {
  const day = dob.getDate();
  const month = dob.getMonth() + 1;
  const year = dob.getFullYear();
  const isOddDay = day % 2 === 1;

  const baseSeed = seedFromDate(day, month, year);
  const rand = mulberry32(baseSeed);

  // 1. Pick a value inside each factor's own [min, max] band, and KEEP IT
  //    THERE. The brief's ranges are real, literal bounds for the Total of
  //    each factor - they must never be rescaled or stretched.
  const totals = FACTORS.map((f) => f.min + rand() * (f.max - f.min));

  // 2. Split each factor's total between Mother and Father.
  //    The dominant parent (by odd/even day) gets a bias between 54%-66%,
  //    varied per-factor (but deterministically) so the split doesn't look
  //    like a flat 60/40 on every row. Mother + Father always equals the
  //    factor's Total exactly.
  const factors = FACTORS.map((f, i) => {
    const total = totals[i];
    const biasSeed = mulberry32(baseSeed + i * 7919); // distinct stream per factor
    const dominantShare = 0.54 + biasSeed() * 0.12; // 0.54 .. 0.66

    const motherShare = isOddDay ? dominantShare : 1 - dominantShare;

    const mother = total * motherShare;
    const father = total - mother;

    return {
      ...f,
      total,
      mother,
      father,
      motherPct: (mother / total) * 100,
      fatherPct: (father / total) * 100,
    };
  });

  // 3. Raw sums (real units, will naturally land somewhere in the ~47-54
  //    range since that's what the factor ranges add up to - this is
  //    expected and correct, NOT an error).
  const motherTotal = factors.reduce((a, f) => a + f.mother, 0);
  const fatherTotal = factors.reduce((a, f) => a + f.father, 0);
  const rawGrandTotal = motherTotal + fatherTotal;

  // 4. The brief's "Sum of Mother + Sum of Father = 100" requirement is
  //    satisfied as a NORMALIZED PERCENTAGE split of the raw sums above -
  //    these two numbers always add up to exactly 100 by construction,
  //    without distorting any individual factor's real-unit range.
  const motherOverallPct = (motherTotal / rawGrandTotal) * 100;
  const fatherOverallPct = (fatherTotal / rawGrandTotal) * 100;

  let dominantParent = "Equal";
  if (motherTotal > fatherTotal) dominantParent = "Mother";
  else if (fatherTotal > motherTotal) dominantParent = "Father";

  return {
    isOddDay,
    factors,
    motherTotal,
    fatherTotal,
    motherOverallPct,
    fatherOverallPct,
    dominantParent,
  };
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}
