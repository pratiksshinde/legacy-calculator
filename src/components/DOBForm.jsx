import { useState } from "react";

export default function DOBForm({ onCalculate, isDark }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  function handleSubmit(e) {
    e.preventDefault();
    if (!value) {
      setError("Please choose a date of birth.");
      return;
    }
    const dob = new Date(value + "T00:00:00");
    const now = new Date();
    if (Number.isNaN(dob.getTime())) {
      setError("That date isn't valid.");
      return;
    }
    if (dob > now) {
      setError("Date of birth can't be in the future.");
      return;
    }
    setError("");
    onCalculate(dob, value);
  }

  const borderClass = isDark ? "border-[#2a3140]" : "border-[#e1dccf]";
  const inputClass = isDark ? "bg-[#232b36] text-[#edeae3]" : "bg-[#f1ede5] text-[#241f1a]";
  const mutedClass = isDark ? "text-[#8b93a1]" : "text-[#6b6459]";

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="dob" className={`mb-2.5 block text-[13px] uppercase tracking-[0.08em] ${mutedClass}`}>
        Date of birth
      </label>
      <div className="flex flex-wrap gap-3">
        <input
          id="dob"
          type="date"
          value={value}
          max={today}
          onChange={(e) => setValue(e.target.value)}
          className={`min-w-[200px] flex-1 rounded-[10px] border px-3.5 py-3 font-mono text-[15px] ${borderClass} ${inputClass}`}
        />
        <button type="submit" className={`rounded-[10px] px-[22px] py-3 text-[15px] font-semibold text-[#14181f] transition-transform hover:-translate-y-px cursor-pointer ${isDark ? "bg-green-700" : "bg-green-300"} ${isDark ? "hover:bg-green-600" : "hover:bg-[#e1dccf]"}}`}>
          Submit
        </button>
      </div>
      {error && <p className="mt-2.5 text-[13px] text-[#e08a8a]" role="alert">{error}</p>}
    </form>
  );
}
