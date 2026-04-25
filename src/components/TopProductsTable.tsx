import React, { useState } from "react";
import type { ProductFinancial } from "../types";

const CAT_COLOR: Record<string,string> = {
  "Eletrônicos":  "text-sky-400 bg-sky-400/10",
  "Vestuário":    "text-fuchsia-400 bg-fuchsia-400/10",
  "Alimentos":    "text-emerald-400 bg-emerald-400/10",
  "Casa & Deco":  "text-yellow-400 bg-yellow-400/10",
  "Beleza":       "text-pink-300 bg-pink-300/10",
  "Papelaria":    "text-purple-400 bg-purple-400/10",
  "Esportes":     "text-orange-400 bg-orange-400/10",
  "Brinquedos":   "text-yellow-300 bg-yellow-300/10",
  "Ferramentas":  "text-gray-300 bg-gray-300/10",
  "Pet Shop":     "text-amber-400 bg-amber-400/10",
};

const TopProductsTable: React.FC<{ data: ProductFinancial[] }> = ({ data }) => {
  const [page, setPage] = useState(0);
  const PG = 10;
  const pages = Math.ceil(data.length / PG);
  const rows  = data.slice(page * PG, page * PG + PG);
  const maxRev = data[0]?.revenue ?? 1;

  return (
    <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm uppercase tracking-widest">Receita por Produto</h3>
        <span className="text-xs text-gray-500 font-mono">{page*PG+1}–{Math.min((page+1)*PG,data.length)} / {data.length}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["#","Produto","Categoria","Unidades","Receita"].map(h => (
                <th key={h} className={`text-gray-500 text-xs pb-2 font-medium ${h==="Receita"||h==="Unidades" ? "text-right pr-2" : "text-left pr-4"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={p.productId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 pr-4 text-gray-600 font-mono text-xs">{String(page*PG+i+1).padStart(2,"0")}</td>
                <td className="py-2.5 pr-4">
                  <div className="text-white text-xs">{p.productName}</div>
                  <div className="w-full bg-[#1a2438] rounded h-0.5 mt-1">
                    <div className="h-full bg-sky-500 rounded" style={{ width:`${(p.revenue/maxRev)*100}%` }} />
                  </div>
                </td>
                <td className="py-2.5 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAT_COLOR[p.category]??""}`}>{p.category}</span>
                </td>
                <td className="py-2.5 pr-2 text-right text-gray-400 font-mono text-xs">{p.unitsSold.toLocaleString("pt-BR")}</td>
                <td className="py-2.5 text-right text-white font-mono text-xs">{new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(p.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setPage(p=>Math.max(0,p-1))} disabled={page===0}
          className="text-xs px-3 py-1.5 bg-[#1a2438] border border-white/10 rounded-lg text-gray-400 disabled:opacity-30 hover:text-white transition-colors">
          ← Anterior
        </button>
        <div className="flex gap-1">
          {Array.from({length:pages}).map((_,i) => (
            <button key={i} onClick={()=>setPage(i)}
              className={`w-6 h-6 rounded text-xs font-mono transition-colors ${i===page?"bg-sky-500 text-white":"bg-[#1a2438] text-gray-500 hover:text-white"}`}>
              {i+1}
            </button>
          ))}
        </div>
        <button onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1}
          className="text-xs px-3 py-1.5 bg-[#1a2438] border border-white/10 rounded-lg text-gray-400 disabled:opacity-30 hover:text-white transition-colors">
          Próxima →
        </button>
      </div>
    </div>
  );
};

export default TopProductsTable;