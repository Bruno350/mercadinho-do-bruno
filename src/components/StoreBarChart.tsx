import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { StoreFinancial } from "../types";

const COLORS = ["#0ea5e9","#10b981","#f97316","#e879f9","#facc15"];
const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",notation:"compact"}).format(v);

const Tip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d: StoreFinancial = payload[0].payload;
  return (
    <div className="bg-[#1a2438] border border-white/10 rounded-lg p-3 text-sm">
      <p className="text-white font-semibold mb-1">{d.storeName}</p>
      <p className="text-gray-400">Receita: <span className="text-sky-400">{new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(d.revenue)}</span></p>
      <p className="text-gray-400">Clientes: <span className="text-emerald-400">{d.customers.toLocaleString("pt-BR")}</span></p>
    </div>
  );
};

const StoreBarChart: React.FC<{ data: StoreFinancial[] }> = ({ data }) => (
  <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Receita por Filial</h3>
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top:4, right:8, left:8, bottom:4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
        <XAxis dataKey="state" tick={{ fill:"#6b7280", fontSize:12 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} cursor={{ fill:"rgba(255,255,255,0.03)" }} />
        <Bar dataKey="revenue" radius={[4,4,0,0]} maxBarSize={56}>
          {data.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default StoreBarChart;