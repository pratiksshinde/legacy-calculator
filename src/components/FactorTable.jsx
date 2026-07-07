import { round2 } from "../utils/calculator";

export default function FactorTable({ result, isDark }) {
  const borderClass = isDark ? "border-[#2a3140]" : "border-[#e1dccf]";
  const surfaceClass = isDark ? "bg-[#1c222b]" : "bg-white";
  const softSurfaceClass = isDark ? "bg-[#232b36]" : "bg-[#f1ede5]";
  const mutedClass = isDark ? "text-[#8b93a1]" : "text-[#6b6459]";

  return (
    <div className={`mb-7 rounded-[14px] border px-5 pb-4 pt-2 print:border-[#ccc] print:shadow-none ${borderClass} ${surfaceClass}`} role="table" aria-label="Life factor breakdown">
      <div className={`hidden grid-cols-[2fr_0.7fr_0.7fr_0.7fr] border-b py-3.5 pb-2.5 text-xs uppercase tracking-[0.06em] sm:grid ${borderClass} ${mutedClass}`} role="row">
        <span role="columnheader">Factor</span>
        <span role="columnheader">Mother</span>
        <span role="columnheader">Father</span>
        <span role="columnheader">Total</span>
      </div>

      {result.factors.map((f) => (
        <div className={`relative grid grid-cols-3 items-center gap-y-1 border-b py-3.5 pb-2 last:border-b-0 sm:grid-cols-[2fr_0.7fr_0.7fr_0.7fr] ${borderClass}`} role="row" key={f.key}>
          <div className="col-span-full flex flex-col text-sm sm:col-auto">
            <span>{f.label}</span>
            <span className={`mt-0.5 font-mono text-[11px] ${mutedClass}`}>
              range {f.min.toFixed(3)}&ndash;{f.max.toFixed(3)}
            </span>
          </div>

          <div className="pr-2 text-right font-mono text-[15px] text-[#c98ea8]" role="cell">
            {round2(f.mother).toFixed(2)}
          </div>
          <div className="pr-2 text-right font-mono text-[15px] text-[#6fa8a0]" role="cell">
            {round2(f.father).toFixed(2)}
          </div>
          <div className="pr-2 text-right font-mono text-[15px] font-semibold text-[#d4af6a]" role="cell">
            {round2(f.total).toFixed(2)}
          </div>

          {/* Signature element: a lineage bar split at the mother/father ratio */}
          <div
            className={`relative col-span-full mt-2.5 flex h-1.5 overflow-hidden rounded-full ${softSurfaceClass}`}
            title={`Mother ${f.motherPct.toFixed(1)}% / Father ${f.fatherPct.toFixed(1)}%`}
          >
            <div className="h-full bg-[#c98ea8]" style={{ width: `${f.motherPct}%` }} />
            <div className="h-full bg-[#6fa8a0]" style={{ width: `${f.fatherPct}%` }} />
            <div className="absolute -top-1 h-3 w-0.5 -translate-x-px bg-[#d4af6a]" style={{ left: `${f.motherPct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
