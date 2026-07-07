import { round2 } from "../utils/calculator";

export default function TotalsSummary({ result, isDark }) {
  const borderClass = isDark ? "border-[#2a3140]" : "border-[#e1dccf]";
  const surfaceClass = isDark ? "bg-[#1c222b]" : "bg-white";
  const softSurfaceClass = isDark ? "bg-[#232b36]" : "bg-[#f1ede5]";
  const mutedClass = isDark ? "text-[#8b93a1]" : "text-[#6b6459]";
  const cardBase = `rounded-[14px] border p-[18px] text-center print:border-[#ccc] print:shadow-none ${borderClass} ${surfaceClass}`;
  const labelClass = `mb-2 block text-xs uppercase tracking-[0.06em] ${mutedClass}`;
  const valueClass = "font-mono text-[26px] font-semibold";

  return (
    <div className="mb-7">
      <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className={`${cardBase} border-t-[3px]`}>
          <span className={labelClass}>Mother total</span>
          <span className={valueClass}>{round2(result.motherTotal).toFixed(2)}</span>
        </div>
        <div className={`${cardBase} border-t-[3px] `}>
          <span className={labelClass}>Father total</span>
          <span className={valueClass}>{round2(result.fatherTotal).toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <div className={`${cardBase} border-t-[3px] `}>
          <span className={labelClass}>Mother legacy %</span>
          <span className={valueClass}>{round2(result.motherOverallPct).toFixed(2)}%</span>
        </div>
        <div className={`${cardBase} border-t-[3px] `}>
          <span className={labelClass}>Father legacy %</span>
          <span className={valueClass}>{round2(result.fatherOverallPct).toFixed(2)}%</span>
        </div>
        <div className={`${cardBase} border-t-[3px] `}>
          <span className={labelClass}>Combined</span>
          <span className={valueClass}>
            {round2(result.motherOverallPct + result.fatherOverallPct).toFixed(2)}%
          </span>
        </div>
      </div>

    </div>
  );
}
