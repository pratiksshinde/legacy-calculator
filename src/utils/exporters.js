// src/utils/exporters.js
import { round2 } from "./calculator";

export function downloadCSV(result, dobLabel) {
  const rows = [
    ["Factor", "Mother", "Father", "Total"],
    ...result.factors.map((f) => [
      f.label,
      round2(f.mother),
      round2(f.father),
      round2(f.total),
    ]),
    [],
    ["Mother Total", round2(result.motherTotal)],
    ["Father Total", round2(result.fatherTotal)],
    ["Mother Legacy %", round2(result.motherOverallPct)],
    ["Father Legacy %", round2(result.fatherOverallPct)],
    ["Dominant Parent", result.dominantParent],
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `legacy-factors-${dobLabel}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Lightweight "PDF" export using the browser's native print-to-PDF, scoped
// to a printable summary. Avoids pulling in a heavy PDF library for a bonus
// feature; user picks "Save as PDF" in the print dialog.
export function exportPDF() {
  window.print();
}

const STORAGE_KEY = "legacy-calculator:saved-results";

export function saveResultToHistory(dobLabel, result) {
  const existing = loadHistory();
  const entry = {
    dob: dobLabel,
    savedAt: new Date().toISOString(),
    motherTotal: round2(result.motherTotal),
    fatherTotal: round2(result.fatherTotal),
    dominantParent: result.dominantParent,
  };
  const updated = [entry, ...existing.filter((e) => e.dob !== dobLabel)].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}
