import React, { useState } from "react";
import { LayoutDashboard, Package, Users, DollarSign, ShoppingCart, TrendingUp, Download, Store, ChevronRight } from "lucide-react";
import { DASHBOARD_DATA } from "./data/mockData";
import { exportToExcel } from "./data/excelExport";
import KpiCard          from "./components/KpiCard";
import MonthlyChart     from "./components/MonthlyChart";
import StoreBarChart    from "./components/StoreBarChart";
import StatePieChart    from "./components/StatePieChart";
import TopProductsTable from "./components/TopProductsTable";
import StockView        from "./pages/StockView";

type Tab = "dashboard" | "estoque";

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const d = DASHBOARD_DATA;
  const last = d.monthly[d.monthly.length-1];
  const prev = d.monthly[d.monthly.length-2];
  const revTrend  = prev ? ((last.totalRevenue  - prev.totalRevenue)  / prev.totalRevenue)  * 100 : 0;
  const custTrend = prev ? ((last.totalCustomers - prev.totalCustomers) / prev.totalCustomers) * 100 : 0;

  const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id:"dashboard", label:"Dashboard",  icon: LayoutDashboard },
    { id:"estoque",   label:"Estoque",    icon: Package         },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] flex text-white" style={{ backgroundImage:"linear-gradient(rgba(14,165,233,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.03) 1px,transparent 1px)", backgroundSize:"40px 40px" }}>

      {/* SIDEBAR */}
      <aside className="w-60 shrink-0 bg-[#0d1424] border-r border-white/5 flex flex-col">
        <div className="px-5 py-6 border-b border-white/5">
          <p className="text-xl font-bold text-sky-400 tracking-wider">Mercadinho</p>
          <p className="text-xl font-bold text-white tracking-wider">do Bruno</p>
          <p className="text-xs text-gray-600 mt-0.5 font-mono">Dashboard · 2025</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                tab===item.id ? "bg-sky-500/15 text-sky-400 border border-sky-500/20" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}>
              <item.icon size={16} />{item.label}
              {tab===item.id && <ChevronRight size={12} className="ml-auto"/>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Lojas</p>
          {d.stores.map(s => (
            <div key={s.id} className="flex items-center gap-2 mb-2">
              <Store size={12} className={s.type==="matriz" ? "text-sky-400" : "text-gray-500"} />
              <div className="min-w-0">
                <p className="text-xs text-gray-400 truncate">{s.city}</p>
                <p className="text-xs text-gray-600">{s.state}</p>
              </div>
              {s.type==="matriz" && <span className="ml-auto text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded-full shrink-0">MTZ</span>}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5">
          <button onClick={exportToExcel}
            className="w-full flex items-center gap-2 justify-center px-3 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/20 transition-all">
            <Download size={14}/> Exportar Excel
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto">
        {tab==="dashboard" ? (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Visão Financeira</h1>
                <p className="text-gray-500 text-sm mt-0.5">Jan–Jun 2025 · 5 Lojas · {d.products.length} Produtos</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 font-mono">Receita Total Acumulada</p>
                <p className="text-2xl font-bold text-emerald-400">{fmtBRL(d.totals.revenue)}</p>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard title="Nº de Clientes"     value={d.totals.customers.toLocaleString("pt-BR")}  sub="acumulado 6 meses"  icon={Users}        color="blue"   trend={custTrend} />
              <KpiCard title="Unidades Vendidas"  value={d.totals.unitsSold.toLocaleString("pt-BR")}   sub="total de produtos"  icon={ShoppingCart} color="green"  />
              <KpiCard title="Receita Total"      value={new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",notation:"compact"}).format(d.totals.revenue)} sub="Jan–Jun 2025" icon={DollarSign} color="orange" trend={revTrend} />
              <KpiCard title="Qtd de Vendas"      value={d.totals.transactions.toLocaleString("pt-BR")} sub="registros totais"  icon={TrendingUp}   color="pink"   />
            </div>

            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyChart data={d.monthly} />
              <StoreBarChart data={d.byStore} />
            </div>

            {/* Charts row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <StatePieChart data={d.byState} />
              <div className="lg:col-span-2"><TopProductsTable data={d.byProduct} /></div>
            </div>

            {/* Strip por filial */}
            <div className="grid grid-cols-5 gap-3">
              {d.byStore.map((s, i) => {
                const colors = ["border-sky-500/40","border-emerald-500/40","border-orange-500/40","border-fuchsia-500/40","border-yellow-500/40"];
                const texts  = ["text-sky-400","text-emerald-400","text-orange-400","text-fuchsia-400","text-yellow-400"];
                return (
                  <div key={s.storeId} className={`bg-[#111827] border ${colors[i]} rounded-xl p-4`}>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{s.state}</p>
                    <p className="text-white text-xs font-medium mb-2 truncate">{s.storeName.replace("Matriz ","").replace("Filial ","")}</p>
                    <p className={`text-lg font-bold ${texts[i]}`}>
                      {new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",notation:"compact"}).format(s.revenue)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 font-mono">{s.customers.toLocaleString("pt-BR")} clientes</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <StockView />
        )}
      </main>
    </div>
  );
}