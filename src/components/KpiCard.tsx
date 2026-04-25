import React from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  color: "blue" | "green" | "orange" | "pink";
  trend?: number;
}

const C = {
  blue:   { border: "border-sky-500/30",    icon: "text-sky-400 bg-sky-500/10",     bar: "bg-sky-500",     text: "text-sky-400"   },
  green:  { border: "border-emerald-500/30", icon: "text-emerald-400 bg-emerald-500/10", bar: "bg-emerald-500", text: "text-emerald-400" },
  orange: { border: "border-orange-500/30", icon: "text-orange-400 bg-orange-500/10", bar: "bg-orange-500", text: "text-orange-400" },
  pink:   { border: "border-fuchsia-500/30", icon: "text-fuchsia-400 bg-fuchsia-500/10", bar: "bg-fuchsia-500", text: "text-fuchsia-400" },
};

const KpiCard: React.FC<Props> = ({ title, value, sub, icon: Icon, color, trend }) => {
  const c = C[color];
  return (
    <div className={`relative bg-[#111827] border ${c.border} rounded-xl p-5 overflow-hidden hover:scale-[1.02] transition-transform duration-200`}>
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${c.bar}`} />
      <div className="flex items-start justify-between mb-3">
        <span className={`p-2 rounded-lg ${c.icon}`}><Icon size={18} /></span>
        {trend !== undefined && (
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${trend >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1 font-mono">{sub}</p>}
    </div>
  );
};

export default KpiCard;