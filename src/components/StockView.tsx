import React, { useState } from "react";
import { STORES, PRODUCTS } from "../data/mockData";

const MONTHS = ["Jan/25","Fev/25","Mar/25","Abr/25","Mai/25","Jun/25"];

const StockView: React.FC = () => {
  const [storeId, setStoreId]   = useState("s1");
  const [cat, setCat]           = useState("Todos");
  const store = STORES.find(s => s.id === storeId)!;
  const cats  = ["Todos", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  const rows = store.stock.filter(item => {
    if (cat === "Todos") return true;
    return PRODUCTS.find(p => p.id === item.productId)?.category === cat;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-1">Estoque — Planejamento 6 Meses</h2>
      <p className="text-gray-500 text-sm mb-6">Previsão de demanda por loja · Jan–Jun 2026</p>

      <div className="flex flex-wrap gap-3 mb-5">
        {[{ label:"Loja", val:storeId, set:setStoreId, opts:STORES.map(s=>({v:s.id,l:s.name})) },
          { label:"Categoria", val:cat, set:setCat, opts:cats.map(c=>({v:c,l:c})) }
        ].map(({ label, val, set, opts }) => (
          <div key={label}>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <select value={val} onChange={e=>set(e.target.value)}
              className="bg-[#111827] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500">
              {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap mb-5">
        {[{k:"Gestor",v:store.manager},{k:"Cidade",v:store.city},{k:"Estado",v:store.state},{k:"Tipo",v:store.type==="matriz"?"Matriz":"Filial"}].map(i=>(
          <div key={i.k} className="bg-[#111827] border border-white/5 rounded-lg px-4 py-2">
            <p className="text-xs text-gray-500 uppercase tracking-widest">{i.k}</p>
            <p className="text-white text-sm font-medium">{i.v}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#1a2438] border-b border-white/5">
                {["Produto","Categoria","Qtd Atual","Mín.",...MONTHS,"Total 6m"].map(h=>(
                  <th key={h} className="text-left text-gray-400 py-3 px-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(item => {
                const prod = PRODUCTS.find(p=>p.id===item.productId)!;
                const total = item.monthlyForecast.reduce((a,v)=>a+v,0);
                const low   = item.quantity < item.minStock * 2;
                return (
                  <tr key={item.productId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 text-white whitespace-nowrap">{prod.name}</td>
                    <td className="py-2.5 px-3 text-gray-400">{prod.category}</td>
                    <td className={`py-2.5 px-3 font-mono ${low?"text-orange-400":"text-emerald-400"}`}>{item.quantity}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-500">{item.minStock}</td>
                    {item.monthlyForecast.map((v,i)=>(
                      <td key={i} className="py-2.5 px-3 font-mono text-gray-300">{v}</td>
                    ))}
                    <td className="py-2.5 px-3 font-mono text-sky-400 font-medium">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockView;