

export const FACTORS = [
  { key: "genetic", label: "Genetic Inheritance", min: 9.333, max: 10.777 },
  { key: "vitality", label: "Constitutional Vitality", min: 8.111, max: 9.111 },
  { key: "mental", label: "Mental Patterns", min: 6.111, max: 7.111 },
  { key: "intellect", label: "Intellectual Capacity", min: 6.333, max: 6.999 },
  { key: "emotional", label: "Emotional Foundation", min: 7.111, max: 7.999 },
  { key: "spiritual", label: "Spiritual Lineage", min: 5.011, max: 6.011 },
  { key: "soul", label: "Soul Connections", min: 5.111, max: 6.222 },
];


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
  const totals = FACTORS.map((f) => f.min + rand() * (f.max - f.min));

  const factors = FACTORS.map((f, i) => {
    const total = totals[i];
    const biasSeed = mulberry32(baseSeed + i * 7919); 
    const dominantShare = 0.54 + biasSeed() * 0.12; 

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

  const motherTotal = factors.reduce((a, f) => a + f.mother, 0);
  const fatherTotal = factors.reduce((a, f) => a + f.father, 0);
  const rawGrandTotal = motherTotal + fatherTotal;

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
