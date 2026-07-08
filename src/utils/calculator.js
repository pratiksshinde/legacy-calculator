export const FACTORS = [
  { key: "genetic", label: "Genetic Inheritance", min: 9.333, max: 10.777 },
  { key: "vitality", label: "Constitutional Vitality", min: 8.111, max: 9.111 },
  { key: "mental", label: "Mental Patterns", min: 6.111, max: 7.111 },
  { key: "intellect", label: "Intellectual Capacity", min: 6.333, max: 6.999 },
  { key: "emotional", label: "Emotional Foundation", min: 7.111, max: 7.999 },
  { key: "spiritual", label: "Spiritual Lineage", min: 5.011, max: 6.011 },
  { key: "soul", label: "Soul Connections", min: 5.111, max: 6.222 },
];

function seedFromDate(day, month, year) {
  return day * 31 + month * 97 + year * 7;
}
function createRandom(seed) {
  let current = seed;
  return function () {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };
}

export function calculateLifeFactors(dob) {
  const day = dob.getDate();
  const month = dob.getMonth() + 1; 
  const year = dob.getFullYear();


  const isOddDay = day % 2 === 1;

  const baseSeed = seedFromDate(day, month, year);
  const rand = createRandom(baseSeed);


  const totals = FACTORS.map((f) => f.min + rand() * (f.max - f.min));

  const factors = FACTORS.map((f, i) => {
    const total = totals[i];

    const biasRandom = createRandom(baseSeed + i * 911);
    const dominantShare = 0.54 + biasRandom() * 0.12;

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


  const motherTotal = factors.reduce((sum, f) => sum + f.mother, 0);
  const fatherTotal = factors.reduce((sum, f) => sum + f.father, 0);
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