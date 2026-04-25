import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { MonthlyFinancial } from "../types";

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(v);

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a2438] border border-white/10 rounded-lg p-3 text-sm">
      <p className="text-white font-semibold mb-1">{label}</p>
      <p className="text-gray-400">Receita: <span className="text-sky-400">{new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(payload[0].value)}</span></p>
      <p className="text-gray-400">Clientes: <span className="text-emerald-400">{payload[1]?.value?.toLocaleString("pt-BR")}</span></p>
    </div>
  );
};

const MonthlyChart: React.FC<{ data: MonthlyFinancial[] }> = ({ data }) => (
  <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Evolução Mensal — Jan a Jun/2025</h3>
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
        <defs>
          <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}   />
          </linearGradient>
          <linearGradient id="gCust" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
        <XAxis dataKey="label" tick={{ fill:"#6b7280", fontSize:12 }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="rev" tickFormatter={fmt} tick={{ fill:"#6b7280", fontSize:11 }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="cust" orientation="right" hide />
        <Tooltip content={<Tip />} />
        <Area yAxisId="rev"  type="monotone" dataKey="totalRevenue"   stroke="#0ea5e9" strokeWidth={2} fill="url(#gRev)"  dot={{ fill:"#0ea5e9", r:4 }} />
        <Area yAxisId="cust" type="monotone" dataKey="totalCustomers" stroke="#10b981" strokeWidth={2} fill="url(#gCust)" dot={{ fill:"#10b981", r:4 }} />
      </AreaChart>
    </ResponsiveContainer>
    <div className="flex gap-4 mt-2 justify-end">
      <span className="text-xs text-gray-500 flex items-center gap-1"><span className="w-3 h-0.5 bg-sky-400 inline-block"/>Receita</span>
      <span className="text-xs text-gray-500 flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400 inline-block"/>Clientes</span>
    </div>
  </div>
);

export default MonthlyChart;