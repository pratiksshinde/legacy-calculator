import { useEffect, useState } from "react";
import DOBForm from "./components/DOBForm";
import FactorTable from "./components/FactorTable";
import TotalsSummary from "./components/TotalsSummary";
import LegacyCharts from "./components/LegacyCharts";
import SavedHistory from "./components/SavedHistory";
import { FaMoon, FaSun } from "react-icons/fa6";
import { calculateLifeFactors } from "./utils/calculator";
import { downloadCSV, exportPDF, saveResultToHistory, loadHistory, clearHistory } from "./utils/exporters";

function formatDOB(dob) {
  return dob.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function App() {
  const [result, setResult] = useState(null);
  const [dobLabel, setDobLabel] = useState("");
  const [theme, setTheme] = useState("light");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  function handleCalculate(dob) {
    const r = calculateLifeFactors(dob);
    const label = formatDOB(dob);
    setResult(r);
    setDobLabel(label);
  }

  function handleSave() {
    if (!result) return;
    const updated = saveResultToHistory(dobLabel, result);
    setHistory(updated);
  }

  function handleClearHistory() {
    setHistory(clearHistory());
  }

  const isDark = theme === "dark";
  const pageClass = isDark
    ? "bg-[#14181f] text-[#edeae3]"
    : "bg-[#f6f3ee] text-[#241f1a]";
  const borderClass = isDark ? "border-[#2a3140]" : "border-[#e1dccf]";
  const surfaceClass = isDark ? "bg-[#1c222b]" : "bg-white";
  const mutedClass = isDark ? "text-[#8b93a1]" : "text-[#6b6459]";
  const softSurfaceClass = isDark ? "bg-[#232b36]" : "bg-[#f1ede5]";

  return (
    <div className={`min-h-screen transition-colors duration-200 ${pageClass} print:bg-white print:text-black`}>
      <div className="mx-auto max-w-[980px] px-5 pb-16 pt-8">
      <header className={`mb-8 flex items-start justify-between gap-4 border-b pb-7 print:hidden ${borderClass}`}>
        <div className="flex items-start gap-3.5">
          <span className="bg-gradient-to-br from-[#c98ea8] to-[#6fa8a0] bg-clip-text text-[34px] leading-none text-transparent" aria-hidden="true">◐</span>
          <div>
            <h1 className="font-serif text-[28px] font-semibold leading-tight">Parental Legacy &amp; Life Factors</h1>
          </div>
        </div>
        <button
          className={`flex gap-2 items-center whitespace-nowrap rounded-full border px-4 py-2 text-[13px] hover:border-[#d4af6a] ${borderClass} ${surfaceClass}`}
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          aria-label="Toggle dark or light mode"
        >
          {theme === "dark" ? <FaMoon /> : <FaSun />}
          {theme === "dark" ? " Dark" : " Light"}
        </button>
      </header>

      <main>
        <section className={`mb-9 rounded-[14px] border p-7 shadow-[0_12px_32px_rgba(0,0,0,0.35)] print:hidden ${borderClass} ${surfaceClass}`}>
          <DOBForm onCalculate={handleCalculate} isDark={isDark} />
        </section>

        {result && (
          <>
            <section id="printable-result">
              <h2 className="mb-5 font-serif text-[22px] font-medium">
                Reading for <span className="font-mono text-[19px] text-[#d4af6a]">{dobLabel}</span>
              </h2>

              <TotalsSummary result={result} isDark={isDark} />
              <FactorTable result={result} isDark={isDark} />
              <LegacyCharts result={result} isDark={isDark} />

              <div className="mb-2 flex flex-wrap gap-3 print:hidden">
                <button className={`rounded-[10px] border px-[18px] py-2.5 text-sm hover:border-[#d4af6a] ${borderClass} ${softSurfaceClass}`} onClick={handleSave}>
                  Save result
                </button>
                <button className={`rounded-[10px] border px-[18px] py-2.5 text-sm hover:border-[#d4af6a] ${borderClass} ${softSurfaceClass}`} onClick={() => downloadCSV(result, dobLabel)}>
                  Export CSV
                </button>
                <button className={`rounded-[10px] border px-[18px] py-2.5 text-sm hover:border-[#d4af6a] ${borderClass} ${softSurfaceClass}`} onClick={exportPDF}>
                  Export PDF
                </button>
              </div>
            </section>

            <SavedHistory history={history} onClear={handleClearHistory} isDark={isDark} />
          </>
        )}
      </main>
      </div>
    </div>
  );
}
