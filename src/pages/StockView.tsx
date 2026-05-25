import React, { useState, useMemo } from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  Search,
  Warehouse,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { STORES, PRODUCTS } from "../data/mockData";

const MONTHS_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

type SortField = "name" | "category" | "quantity" | "forecast";
type SortDir   = "asc" | "desc";

// ── helpers ───────────────────────────────────────────────────────
const stockLevel = (qty: number, min = 20) =>
  qty >= min * 2 ? "ok" : qty >= min ? "low" : "crit";

const LEVEL_TEXT: Record<string, string> = {
  ok:   "text-emerald-400",
  low:  "text-amber-400",
  crit: "text-red-400",
};
const LEVEL_BG: Record<string, string> = {
  ok:   "bg-emerald-500/10 border-emerald-500/20",
  low:  "bg-amber-500/10  border-amber-500/20",
  crit: "bg-red-500/10    border-red-500/20",
};
const LEVEL_BAR: Record<string, string> = {
  ok:   "bg-emerald-500",
  low:  "bg-amber-500",
  crit: "bg-red-500",
};
const LEVEL_LABEL: Record<string, string> = {
  ok:   "Normal",
  low:  "Baixo",
  crit: "Crítico",
};

export default function StockView() {
  const [storeId,   setStoreId]   = useState<string>(STORES[0].id);
  const [category,  setCategory]  = useState<string>("Todos");
  const [search,    setSearch]    = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir,   setSortDir]   = useState<SortDir>("asc");

  // store derivado do storeId — SEMPRE sincronizado
  const store = useMemo(
    () => STORES.find((s) => s.id === storeId) ?? STORES[0],
    [storeId]
  );

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()],
    []
  );

  // KPIs da loja selecionada
  const kpis = useMemo(() => {
    const total    = store.stock.reduce((a, i) => a + i.quantity, 0);
    const critical = store.stock.filter((i) => stockLevel(i.quantity) === "crit").length;
    const low      = store.stock.filter((i) => stockLevel(i.quantity) === "low").length;
    const forecast = store.stock.reduce(
      (a, i) => a + i.monthlyForecast.reduce((b, v) => b + v, 0), 0
    );
    return { total, critical, low, forecast };
  }, [store]);

  // linhas filtradas + ordenadas
  const rows = useMemo(() => {
    const filtered = store.stock
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId)!;
        return { ...item, product };
      })
      .filter(({ product }) => {
        const matchCat  = category === "Todos" || product.category === category;
        const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      });

    return [...filtered].sort((a, b) => {
      let va: number | string = 0;
      let vb: number | string = 0;
      if (sortField === "name")     { va = a.product.name;     vb = b.product.name; }
      if (sortField === "category") { va = a.product.category; vb = b.product.category; }
      if (sortField === "quantity") { va = a.quantity;          vb = b.quantity; }
      if (sortField === "forecast") {
        va = a.monthlyForecast.reduce((s, v) => s + v, 0);
        vb = b.monthlyForecast.reduce((s, v) => s + v, 0);
      }
      const cmp = typeof va === "string" ? va.localeCompare(vb as string) : (va as number) - (vb as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [store, category, search, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <Minus size={10} className="text-gray-700 ml-1" />;
    return sortDir === "asc"
      ? <ArrowUp   size={10} className="text-sky-400 ml-1" />
      : <ArrowDown size={10} className="text-sky-400 ml-1" />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Warehouse size={14} className="text-emerald-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Estoque</h1>
          </div>
          <p className="text-gray-500 text-sm">Planejamento de demanda · Jan–Jun 2026</p>
        </div>

        {/* badge tipo */}
        <div className={`self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
          store.type === "matriz"
            ? "bg-sky-500/10 border-sky-500/20 text-sky-400"
            : "bg-white/5 border-white/10 text-gray-400"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${store.type === "matriz" ? "bg-sky-400" : "bg-gray-500"}`} />
          {store.type === "matriz" ? "Matriz" : "Filial"}
        </div>
      </div>

      {/* ── Seletor de loja ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
        {STORES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStoreId(s.id)}
            className={`flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all ${
              storeId === s.id
                ? "bg-sky-500/15 border-sky-500/30 text-sky-400"
                : "bg-[#111827] border-white/5 text-gray-400 hover:border-white/15 hover:text-gray-300"
            }`}
          >
            <span className="text-xs font-medium truncate w-full">{s.city}</span>
            <span className={`text-[10px] font-mono mt-0.5 ${storeId === s.id ? "text-sky-500/70" : "text-gray-600"}`}>
              {s.state} · {s.manager}
            </span>
          </button>
        ))}
      </div>

      {/* ── KPIs da loja ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total em estoque",
            value: kpis.total.toLocaleString("pt-BR"),
            icon: Package,
            color: "text-white",
            sub: "unidades",
          },
          {
            label: "Itens críticos",
            value: kpis.critical.toString(),
            icon: AlertTriangle,
            color: "text-red-400",
            sub: "abaixo do mínimo",
          },
          {
            label: "Itens baixos",
            value: kpis.low.toString(),
            icon: AlertTriangle,
            color: "text-amber-400",
            sub: "atenção necessária",
          },
          {
            label: "Previsão 6 meses",
            value: kpis.forecast.toLocaleString("pt-BR"),
            icon: BarChart3,
            color: "text-sky-400",
            sub: "unidades demanda",
          },
        ].map((k) => (
          <div key={k.label} className="bg-[#111827] border border-white/5 rounded-xl px-4 py-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
              <k.icon size={15} className={k.color} />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-widest leading-tight">{k.label}</p>
              <p className={`text-xl font-bold font-mono mt-0.5 ${k.color}`}>{k.value}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filtros ── */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* busca */}
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#111827] border border-white/10 text-white text-xs rounded-lg pl-8 pr-3 py-2 w-48 focus:outline-none focus:border-sky-500/50 placeholder-gray-600"
          />
        </div>

        {/* categoria */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none bg-[#111827] border border-white/10 text-gray-300 text-xs rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-sky-500/50"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {/* contagem */}
        <span className="text-xs text-gray-600 font-mono ml-auto">
          {rows.length} produto{rows.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Tabela ── */}
      <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#1a2438] border-b border-white/5">
                {/* colunas fixas */}
                <th
                  onClick={() => toggleSort("name")}
                  className="text-left text-gray-400 py-3 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-gray-200 select-none"
                >
                  <span className="flex items-center">Produto <SortIcon field="name" /></span>
                </th>
                <th
                  onClick={() => toggleSort("category")}
                  className="text-left text-gray-400 py-3 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-gray-200 select-none"
                >
                  <span className="flex items-center">Categoria <SortIcon field="category" /></span>
                </th>
                <th
                  onClick={() => toggleSort("quantity")}
                  className="text-left text-gray-400 py-3 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-gray-200 select-none"
                >
                  <span className="flex items-center">Estoque <SortIcon field="quantity" /></span>
                </th>
                <th className="text-left text-gray-400 py-3 px-3 font-medium whitespace-nowrap">Nível</th>
                <th className="text-left text-gray-400 py-3 px-3 font-medium whitespace-nowrap">Mín.</th>

                {/* colunas mensais */}
                {MONTHS_LABELS.map((m) => (
                  <th key={m} className="text-center text-gray-500 py-3 px-2 font-medium whitespace-nowrap">
                    {m}
                  </th>
                ))}

                <th
                  onClick={() => toggleSort("forecast")}
                  className="text-right text-gray-400 py-3 px-3 font-medium whitespace-nowrap cursor-pointer hover:text-gray-200 select-none"
                >
                  <span className="flex items-center justify-end">Total 6m <SortIcon field="forecast" /></span>
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-gray-600">
                    Nenhum produto encontrado
                  </td>
                </tr>
              )}
              {rows.map(({ product, quantity, minStock, monthlyForecast }) => {
                const lv    = stockLevel(quantity, minStock);
                const total = monthlyForecast.reduce((a, v) => a + v, 0);
                const pct   = Math.min(100, Math.round((quantity / (minStock * 4)) * 100));

                return (
                  <tr
                    key={product.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-2.5 px-3 text-white whitespace-nowrap font-medium">
                      {product.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-medium ${LEVEL_TEXT[lv]}`}>{quantity}</span>
                        {/* mini barra */}
                        <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${LEVEL_BAR[lv]}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${LEVEL_BG[lv]} ${LEVEL_TEXT[lv]}`}>
                        {LEVEL_LABEL[lv]}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-gray-600">{minStock}</td>

                    {monthlyForecast.map((v, i) => (
                      <td key={i} className="py-2.5 px-2 font-mono text-center text-gray-400">{v}</td>
                    ))}

                    <td className="py-2.5 px-3 font-mono text-right">
                      <span className="text-sky-400 font-medium">{total}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mini mapa de comparação entre lojas ── */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} className="text-gray-500" />
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Comparativo de estoque total por loja
          </p>
        </div>
        <div className="space-y-2.5">
          {STORES.map((s) => {
            const total = s.stock.reduce((a, i) => a + i.quantity, 0);
            const maxTotal = Math.max(...STORES.map((st) => st.stock.reduce((a, i) => a + i.quantity, 0)));
            const pct = Math.round((total / maxTotal) * 100);
            const isSelected = s.id === storeId;
            return (
              <div key={s.id} className="flex items-center gap-3">
                <button
                  onClick={() => setStoreId(s.id)}
                  className={`w-24 shrink-0 text-left text-[11px] font-medium transition-colors ${
                    isSelected ? "text-sky-400" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {s.city}
                </button>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSelected ? "bg-sky-500" : "bg-gray-600"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className={`text-xs font-mono w-16 text-right ${isSelected ? "text-sky-400" : "text-gray-600"}`}>
                  {total.toLocaleString("pt-BR")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
