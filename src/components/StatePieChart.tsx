import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { StateRevenue } from "../types";

const COLORS = ["#0ea5e9","#10b981","#f97316","#e879f9","#facc15"];

const Tip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d: StateRevenue = payload[0].payload;
  return (
    <div className="bg-[#1a2438] border border-white/10 rounded-lg p-3 text-sm">
      <p className="text-white font-semibold">Estado: {d.state}</p>
      <p className="text-gray-400">Receita: <span className="text-sky-400">{new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(d.revenue)}</span></p>
    </div>
  );
};

const StatePieChart: React.FC<{ data: StateRevenue[] }> = ({ data }) => (
  <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Receita por Estado</h3>
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="revenue" nameKey="state" cx="50%" cy="50%" outerRadius={95} innerRadius={48} paddingAngle={4} strokeWidth={0}>
          {data.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip content={<Tip />} />
        <Legend formatter={(v) => <span className="text-gray-400 text-xs">{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default StatePieChart;