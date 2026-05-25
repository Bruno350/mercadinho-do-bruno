import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Download,
} from "lucide-react";
import { DASHBOARD_DATA } from "./data/mockData";
import { exportToExcel } from "./data/excelExport";
import KpiCard          from "./components/KpiCard";
import MonthlyChart     from "./components/MonthlyChart";
import StoreBarChart    from "./components/StoreBarChart";
import StatePieChart    from "./components/StatePieChart";
import TopProductsTable from "./components/TopProductsTable";
import StockView        from "./pages/StockView";
import TransferenciaView from "./pages/TransferenciaView";

type Tab = "dashboard" | "estoque" | "transferencia";

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const fmtCompact = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
  }).format(v);

export default function App() {
  const [tab, setTab]           = useState<Tab>("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const d    = DASHBOARD_DATA;
  const last = d.monthly[d.monthly.length - 1];
  const prev = d.monthly[d.monthly.length - 2];
  const revTrend  = prev ? ((last.totalRevenue  - prev.totalRevenue)  / prev.totalRevenue)  * 100 : 0;
  const custTrend = prev ? ((last.totalCustomers - prev.totalCustomers) / prev.totalCustomers) * 100 : 0;

  const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
    { id: "estoque",      label: "Estoque",      icon: Package },
    { id: "transferencia",label: "Movimentação", icon: Truck },
  ];

  const handleTab = (id: Tab) => { setTab(id); setSideOpen(false); };

  const BORDER_COLORS = [
    "border-sky-500/40","border-emerald-500/40","border-orange-500/40",
    "border-fuchsia-500/40","border-yellow-500/40",
  ];
  const TEXT_COLORS = [
    "text-sky-400","text-emerald-400","text-orange-400",
    "text-fuchsia-400","text-yellow-400",
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5">
        <p className="text-lg font-bold leading-tight">
          <span className="text-sky-400">Mercadinho</span>
          <br />
          <span className="text-white">do Bruno e Tiago</span>
        </p>
        <p className="text-xs text-gray-600 mt-1 font-mono">Dashboard · 2026</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              tab === item.id
                ? "bg-sky-500/15 text-sky-400 border border-sky-500/20"
                : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
            }`}
          >
            <item.icon size={15} />
            <span>{item.label}</span>
          </button>
        ))}

        {/* Divisória */}
        <div className="mx-3 my-3 border-t border-white/5" />

        {/* Label + lista de lojas — estilo informativo, não clicável */}
        <div className="px-3">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Lojas</p>
          <div className="rounded-lg border border-white/5 overflow-hidden">
            {d.stores.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center gap-2.5 px-3 py-2 ${
                  i < d.stores.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                {/* bolinha colorida como indicador */}
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    s.type === "matriz" ? "bg-sky-400" : "bg-gray-600"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-gray-400 truncate leading-tight">{s.city}</p>
                </div>
                <span className="text-[10px] text-gray-600 font-mono shrink-0">{s.state}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3">
          <button
            onClick={exportToExcel}
            className="w-full flex items-center gap-2 justify-center px-3 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/20 transition-all"
          >
            <Download size={14} /> Exportar Excel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[#080c14] flex text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(14,165,233,0.03) 1px,transparent 1px)," +
          "linear-gradient(90deg,rgba(14,165,233,0.03) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-56 shrink-0 bg-[#0d1424] border-r border-white/5 flex-col">
        <SidebarContent />
      </aside>

      {/* DRAWER MOBILE */}
      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSideOpen(false)} />
          <div className="relative z-50 w-56 bg-[#0d1424] border-r border-white/5 flex flex-col h-full shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0d1424] border-b border-white/5 shrink-0">
          <button
            onClick={() => setSideOpen(true)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect y="3"  width="20" height="2" rx="1"/>
              <rect y="9"  width="20" height="2" rx="1"/>
              <rect y="15" width="20" height="2" rx="1"/>
            </svg>
          </button>
          <p className="text-sm font-bold">
            <span className="text-sky-400">Mercadinho</span>
            <span className="text-white"> do Bruno e Tiago</span>
          </p>
          <button onClick={exportToExcel} className="text-emerald-400 hover:text-emerald-300 transition-colors p-1">
            <Download size={18} />
          </button>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 overflow-auto pb-16 lg:pb-0">
          {tab === "dashboard" && (
            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Visão Financeira</h1>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Jan–Jun 2026 · 5 Lojas · {d.products.length} Produtos
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs text-gray-600 font-mono">Receita Total Acumulada</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                    {fmtBRL(d.totals.revenue)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <KpiCard title="Nº de Clientes"    value={d.totals.customers.toLocaleString("pt-BR")}   sub="acumulado 6 meses" icon={Users}        color="blue"   trend={custTrend} />
                <KpiCard title="Unidades Vendidas" value={d.totals.unitsSold.toLocaleString("pt-BR")}    sub="total de produtos" icon={ShoppingCart} color="green"  />
                <KpiCard title="Receita Total"     value={fmtCompact(d.totals.revenue)}                  sub="Jan–Jun 2026"      icon={DollarSign}   color="orange" trend={revTrend} />
                <KpiCard title="Qtd de Vendas"     value={d.totals.transactions.toLocaleString("pt-BR")} sub="registros totais"  icon={TrendingUp}   color="pink"   />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                <MonthlyChart  data={d.monthly} />
                <StoreBarChart data={d.byStore}  />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                <StatePieChart data={d.byState} />
                <div className="lg:col-span-2">
                  <TopProductsTable data={d.byProduct} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {d.byStore.map((s, i) => (
                  <div key={s.storeId} className={`bg-[#111827] border ${BORDER_COLORS[i]} rounded-xl p-4`}>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">{s.state}</p>
                    <p className="text-white text-xs font-medium mb-2 truncate">
                      {s.storeName.replace("Matriz ", "").replace("Filial ", "")}
                    </p>
                    <p className={`text-base sm:text-lg font-bold ${TEXT_COLORS[i]}`}>
                      {fmtCompact(s.revenue)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 font-mono">
                      {s.customers.toLocaleString("pt-BR")} clientes
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "estoque" && <StockView />}
          {tab === "transferencia" && <TransferenciaView />}
        </main>

        {/* BOTTOM NAV MOBILE */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0d1424] border-t border-white/5 flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                tab === item.id ? "text-sky-400" : "text-gray-600 hover:text-gray-300"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
