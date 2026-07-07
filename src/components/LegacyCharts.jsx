import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { round2 } from "../utils/calculator";

const MOTHER_COLOR = "#c98ea8";
const FATHER_COLOR = "#6fa8a0";

export default function LegacyCharts({ result, isDark }) {
  const barData = result.factors.map((f) => ({
    name: f.label.split(" ")[0],
    Mother: round2(f.mother),
    Father: round2(f.father),
  }));

  const pieData = [
    { name: "Mother", value: round2(result.motherTotal) },
    { name: "Father", value: round2(result.fatherTotal) },
  ];

  const borderClass = isDark ? "border-[#2a3140]" : "border-[#e1dccf]";
  const surfaceClass = isDark ? "bg-[#1c222b]" : "bg-white";
  const mutedColor = isDark ? "#8b93a1" : "#6b6459";
  const tooltipStyle = {
    background: isDark ? "#1c222b" : "#ffffff",
    border: `1px solid ${isDark ? "#2a3140" : "#e1dccf"}`,
    borderRadius: 8,
    color: isDark ? "#edeae3" : "#241f1a",
  };

  return (
    <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_1fr]">
      <div className={`rounded-[14px] border p-[18px] print:border-[#ccc] print:shadow-none ${borderClass} ${surfaceClass}`}>
        <h3 className={`mb-1.5 text-sm font-medium ${isDark ? "text-[#8b93a1]" : "text-[#6b6459]"}`}>Mother vs Father by factor</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2a3140" : "#e1dccf"} />
            <XAxis dataKey="name" tick={{ fill: mutedColor, fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fill: mutedColor, fontSize: 11 }} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDark ? "#edeae3" : "#241f1a" }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: mutedColor }} />
            <Bar dataKey="Mother" fill={MOTHER_COLOR} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Father" fill={FATHER_COLOR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`rounded-[14px] border p-[18px] print:border-[#ccc] print:shadow-none ${borderClass} ${surfaceClass}`}>
        <h3 className={`mb-1.5 text-sm font-medium ${isDark ? "text-[#8b93a1]" : "text-[#6b6459]"}`}>Overall legacy split</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
            >
              <Cell fill={MOTHER_COLOR} />
              <Cell fill={FATHER_COLOR} />
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: isDark ? "#edeae3" : "#241f1a" }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: mutedColor }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
