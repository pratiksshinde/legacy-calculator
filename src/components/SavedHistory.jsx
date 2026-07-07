export default function SavedHistory({ history, onClear, isDark }) {
  if (!history.length) return null;

  const borderClass = isDark ? "border-[#2a3140]" : "border-[#e1dccf]";
  const surfaceClass = isDark ? "bg-[#1c222b]" : "bg-white";
  const softSurfaceClass = isDark ? "bg-[#232b36]" : "bg-[#f1ede5]";
  const mutedClass = isDark ? "text-[#8b93a1]" : "text-[#6b6459]";

  return (
    <div className={`mb-7 rounded-[14px] border p-5 print:hidden ${borderClass} ${surfaceClass}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-medium">Saved results</h3>
        <button className={`text-[13px] underline ${mutedClass}`} onClick={onClear}>
          Clear
        </button>
      </div>
      <ul className="flex list-none flex-col gap-2">
        {history.map((h) => (
          <li className={`flex justify-between rounded-lg px-3 py-2 text-[13px] ${softSurfaceClass}`} key={h.dob + h.savedAt}>
            <span className={`font-mono ${mutedClass}`}>{h.dob}</span>
            <span>
              M {h.motherTotal.toFixed(2)} · F {h.fatherTotal.toFixed(2)} ·{" "}
              <strong>{h.dominantParent}</strong> leads
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
