import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  PackageCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  History,
  Warehouse,
  Truck,
  BarChart3,
  Trash2,
  Search,
  ChevronDown,
} from "lucide-react";
import { STORES, PRODUCTS } from "../data/mockData";
import type { StockItem } from "../types";

// ── tipos internos ────────────────────────────────────────────────
interface StockState {
  [storeId: string]: { [productId: string]: number };
}

interface TransferRecord {
  id: number;
  ts: string;
  productId: string;
  productName: string;
  originId: string;
  originCity: string;
  destId: string;
  destCity: string;
  qty: number;
  valor: number;
  reason: string;
  origFinal: number;
  destFinal: number;
}

// ── helpers ───────────────────────────────────────────────────────
const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const fmtCompact = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(v);

const stockLevel = (qty: number, min = 20) =>
  qty >= min * 2 ? "ok" : qty >= min ? "low" : "crit";

const levelColors: Record<string, string> = {
  ok: "text-emerald-400",
  low: "text-amber-400",
  crit: "text-red-400",
};
const levelBg: Record<string, string> = {
  ok: "bg-emerald-500/10 border-emerald-500/20",
  low: "bg-amber-500/10 border-amber-500/20",
  crit: "bg-red-500/10 border-red-500/20",
};
const levelBar: Record<string, string> = {
  ok: "bg-emerald-500",
  low: "bg-amber-500",
  crit: "bg-red-500",
};

const REASONS = [
  "Reabastecimento",
  "Excesso de estoque",
  "Demanda sazonal",
  "Estoque crítico",
  "Redistribuição estratégica",
  "Evento / promoção",
];

// ── build stock inicial a partir dos dados do mock ────────────────
function buildInitialStock(): StockState {
  const state: StockState = {};
  STORES.forEach((store) => {
    state[store.id] = {};
    store.stock.forEach((item: StockItem) => {
      state[store.id][item.productId] = item.quantity;
    });
  });
  return state;
}

// ── componente principal ──────────────────────────────────────────
export default function TransferenciaView() {
  const [stock, setStock] = useState<StockState>(buildInitialStock);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0].id);
  const [originId, setOriginId] = useState(STORES[0].id);
  const [destId, setDestId] = useState(STORES[1].id);
  const [qty, setQty] = useState(10);
  const [reason, setReason] = useState(REASONS[0]);
  const [history, setHistory] = useState<TransferRecord[]>([]);
  const [flash, setFlash] = useState<"success" | "error" | null>(null);
  const [flashMsg, setFlashMsg] = useState("");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Todos");
  const [activeTab, setActiveTab] = useState<"form" | "history" | "analytics">("form");
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const product = PRODUCTS.find((p) => p.id === selectedProduct)!;
  const origin = STORES.find((s) => s.id === originId)!;
  const dest = STORES.find((s) => s.id === destId)!;
  const origQty = stock[originId]?.[selectedProduct] ?? 0;
  const destQty = stock[destId]?.[selectedProduct] ?? 0;
  const valor = qty * product.unitPrice;

  const categories = ["Todos", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchCat = filterCat === "Todos" || p.category === filterCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // validações
  const sameStore = originId === destId;
  const notEnough = qty > origQty;
  const willGoLow = !notEnough && origQty - qty < 20;
  const canTransfer = !sameStore && !notEnough && qty > 0;

  // KPIs do histórico
  const totalTransfers = history.length;
  const totalUnits = history.reduce((a, h) => a + h.qty, 0);
  const totalValue = history.reduce((a, h) => a + h.valor, 0);

  function showFlash(type: "success" | "error", msg: string) {
    setFlash(type);
    setFlashMsg(msg);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 3500);
  }

  function confirmar() {
    if (!canTransfer) return;
    const newStock = {
      ...stock,
      [originId]: { ...stock[originId], [selectedProduct]: origQty - qty },
      [destId]: { ...stock[destId], [selectedProduct]: destQty + qty },
    };
    setStock(newStock);

    const record: TransferRecord = {
      id: Date.now(),
      ts: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      productId: selectedProduct,
      productName: product.name,
      originId,
      originCity: origin.city,
      destId,
      destCity: dest.city,
      qty,
      valor,
      reason,
      origFinal: origQty - qty,
      destFinal: destQty + qty,
    };
    setHistory((h) => [record, ...h]);
    showFlash("success", `${qty} unid de "${product.name}" transferidas para ${dest.city}!`);
  }

  function resetStock() {
    setStock(buildInitialStock());
    setHistory([]);
    showFlash("success", "Estoque resetado para os valores originais.");
  }

  // ── render ──────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 space-y-5 min-h-screen">

      {/* ── flash toast ── */}
      {flash && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all animate-fadeIn ${
            flash === "success"
              ? "bg-emerald-950 border-emerald-500/40 text-emerald-300"
              : "bg-red-950 border-red-500/40 text-red-300"
          }`}
        >
          {flash === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {flashMsg}
        </div>
      )}

      {/* ── header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
              <Truck size={14} className="text-sky-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Movimentação de Estoque</h1>
          </div>
          <p className="text-gray-500 text-sm">Simulador de transferências entre filiais</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetStock}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
          >
            <Trash2 size={12} /> Resetar estoque
          </button>
        </div>
      </div>

      {/* ── KPIs da sessão ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Transferências", value: totalTransfers.toString(), color: "text-white" },
          { label: "Unidades movidas", value: totalUnits.toLocaleString("pt-BR"), color: "text-sky-400" },
          { label: "Valor movimentado", value: fmtCompact(totalValue), color: "text-emerald-400" },
        ].map((k) => (
          <div key={k.label} className="bg-[#111827] border border-white/5 rounded-xl px-4 py-3">
            <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">{k.label}</p>
            <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* ── tabs ── */}
      <div className="flex gap-1 bg-[#111827] border border-white/5 rounded-xl p-1 w-fit">
        {(["form", "history", "analytics"] as const).map((t) => {
          const labels = { form: "Transferir", history: "Histórico", analytics: "Estoque" };
          const icons = { form: Truck, history: History, analytics: BarChart3 };
          const Icon = icons[t];
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === t
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/20"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon size={13} /> {labels[t]}
            </button>
          );
        })}
      </div>

      {/* ══════════════════ TAB: FORM ══════════════════ */}
      {activeTab === "form" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

          {/* ── coluna esquerda: produto ── */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Selecionar produto</p>

              {/* busca + filtro categoria */}
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#0d1424] border border-white/10 text-white text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-sky-500/50 placeholder-gray-600"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterCat}
                    onChange={(e) => setFilterCat(e.target.value)}
                    className="appearance-none bg-[#0d1424] border border-white/10 text-gray-300 text-xs rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-sky-500/50"
                  >
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* lista de produtos */}
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1 scrollbar-hide">
                {filteredProducts.map((p) => {
                  const minQty = Math.min(...STORES.map((s) => stock[s.id]?.[p.id] ?? 0));
                  const level = stockLevel(minQty);
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                        selectedProduct === p.id
                          ? "bg-sky-500/15 border border-sky-500/20"
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-500">{p.category}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs text-gray-400 font-mono">{fmtBRL(p.unitPrice)}</p>
                        <p className={`text-[10px] font-mono ${levelColors[level]}`}>mín {minQty}</p>
                      </div>
                    </button>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <p className="text-xs text-gray-600 text-center py-6">Nenhum produto encontrado</p>
                )}
              </div>
            </div>

            {/* ── mini mapa de estoque do produto selecionado ── */}
            <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                Estoque atual — {product.name}
              </p>
              <div className="space-y-2.5">
                {STORES.map((s) => {
                  const q = stock[s.id]?.[selectedProduct] ?? 0;
                  const max = Math.max(...STORES.map((st) => stock[st.id]?.[selectedProduct] ?? 0));
                  const pct = max > 0 ? Math.round((q / max) * 100) : 0;
                  const lv = stockLevel(q);
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="w-20 shrink-0">
                        <p className="text-[11px] text-gray-300 leading-tight">{s.city}</p>
                        <p className="text-[10px] text-gray-600">{s.state}</p>
                      </div>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${levelBar[lv]}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono font-medium w-8 text-right ${levelColors[lv]}`}>
                        {q}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── coluna direita: formulário ── */}
          <div className="xl:col-span-3 space-y-4">
            <div className="bg-[#111827] border border-white/5 rounded-xl p-4 space-y-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Configurar transferência</p>

              {/* produto selecionado */}
              <div className="flex items-center gap-3 p-3 bg-[#0d1424] rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                  <PackageCheck size={15} className="text-sky-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category} · {fmtBRL(product.unitPrice)} / un</p>
                </div>
              </div>

              {/* origem → destino */}
              <div className="grid grid-cols-5 gap-2 items-end">
                <div className="col-span-2">
                  <label className="text-[11px] text-gray-500 uppercase tracking-widest block mb-1.5">Origem</label>
                  <div className="relative">
                    <select
                      value={originId}
                      onChange={(e) => setOriginId(e.target.value)}
                      className="w-full appearance-none bg-[#0d1424] border border-white/10 text-white text-xs rounded-lg px-3 py-2.5 pr-7 focus:outline-none focus:border-sky-500/50"
                    >
                      {STORES.map((s) => (
                        <option key={s.id} value={s.id}>{s.city} ({s.state})</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                  <p className="text-[11px] font-mono mt-1 pl-0.5">
                    <span className="text-gray-500">Estoque: </span>
                    <span className={levelColors[stockLevel(origQty)]}>{origQty} unid</span>
                  </p>
                </div>

                <div className="flex justify-center pb-5">
                  <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <ArrowRight size={14} className="text-sky-400" />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-[11px] text-gray-500 uppercase tracking-widest block mb-1.5">Destino</label>
                  <div className="relative">
                    <select
                      value={destId}
                      onChange={(e) => setDestId(e.target.value)}
                      className="w-full appearance-none bg-[#0d1424] border border-white/10 text-white text-xs rounded-lg px-3 py-2.5 pr-7 focus:outline-none focus:border-sky-500/50"
                    >
                      {STORES.map((s) => (
                        <option key={s.id} value={s.id}>{s.city} ({s.state})</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                  <p className="text-[11px] font-mono mt-1 pl-0.5">
                    <span className="text-gray-500">Estoque: </span>
                    <span className={levelColors[stockLevel(destQty)]}>{destQty} unid</span>
                  </p>
                </div>
              </div>

              {/* quantidade */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-[11px] text-gray-500 uppercase tracking-widest">Quantidade</label>
                  <span className="text-xs text-gray-400 font-mono">{fmtBRL(valor)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={Math.max(1, origQty)}
                    value={qty}
                    step={1}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="flex-1 accent-sky-500"
                  />
                  <input
                    type="number"
                    min={1}
                    max={origQty}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                    className="w-16 bg-[#0d1424] border border-white/10 text-white text-xs text-center rounded-lg py-2 focus:outline-none focus:border-sky-500/50"
                  />
                </div>
              </div>

              {/* motivo */}
              <div>
                <label className="text-[11px] text-gray-500 uppercase tracking-widest block mb-1.5">Motivo</label>
                <div className="flex flex-wrap gap-1.5">
                  {REASONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setReason(r)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg border transition-all ${
                        reason === r
                          ? "bg-sky-500/15 border-sky-500/30 text-sky-400"
                          : "border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* prévia */}
              {!sameStore && qty > 0 && (
                <div className="grid grid-cols-5 gap-2 p-3 bg-[#0d1424] rounded-xl border border-white/5">
                  <div className="col-span-2 text-center">
                    <p className="text-[10px] text-gray-600 mb-1">{origin.city}</p>
                    <p className="text-xs text-gray-400 line-through font-mono">{origQty}</p>
                    <p className={`text-sm font-bold font-mono ${levelColors[stockLevel(origQty - qty)]}`}>
                      {origQty - qty}
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <ArrowRight size={16} className="text-sky-400 mx-auto" />
                      <p className="text-[10px] text-sky-400 font-mono mt-0.5">{qty}x</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <p className="text-[10px] text-gray-600 mb-1">{dest.city}</p>
                    <p className="text-xs text-gray-400 line-through font-mono">{destQty}</p>
                    <p className={`text-sm font-bold font-mono ${levelColors[stockLevel(destQty + qty)]}`}>
                      {destQty + qty}
                    </p>
                  </div>
                </div>
              )}

              {/* alertas */}
              {sameStore && (
                <div className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <AlertCircle size={14} className="text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">Origem e destino não podem ser a mesma loja.</p>
                </div>
              )}
              {notEnough && !sameStore && (
                <div className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <AlertCircle size={14} className="text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">Estoque insuficiente em {origin.city}. Disponível: {origQty} unid.</p>
                </div>
              )}
              {willGoLow && (
                <div className="flex items-center gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-400">{origin.city} ficará com {origQty - qty} unid (abaixo do mínimo recomendado de 20).</p>
                </div>
              )}

              {/* botão */}
              <button
                onClick={confirmar}
                disabled={!canTransfer}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                  canTransfer
                    ? "bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-500/10"
                    : "bg-white/5 text-gray-600 cursor-not-allowed"
                }`}
              >
                <Truck size={15} />
                Confirmar transferência
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ TAB: HISTÓRICO ══════════════════ */}
      {activeTab === "history" && (
        <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <History size={32} className="text-gray-700 mb-3" />
              <p className="text-gray-500 text-sm">Nenhuma transferência realizada</p>
              <p className="text-gray-700 text-xs mt-1">Use a aba "Transferir" para começar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#1a2438] border-b border-white/5">
                    {["Hora", "Produto", "Origem", "", "Destino", "Qtd", "Valor", "Motivo"].map((h) => (
                      <th key={h} className="text-left text-gray-500 py-3 px-3 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3 text-gray-500 font-mono">{h.ts}</td>
                      <td className="py-2.5 px-3 text-white whitespace-nowrap">{h.productName}</td>
                      <td className="py-2.5 px-3 text-gray-300">{h.originCity}</td>
                      <td className="py-2.5 px-3 text-sky-500"><ArrowRight size={12} /></td>
                      <td className="py-2.5 px-3 text-gray-300">{h.destCity}</td>
                      <td className="py-2.5 px-3 font-mono text-sky-400">{h.qty}</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">{fmtBRL(h.valor)}</td>
                      <td className="py-2.5 px-3 text-gray-500">{h.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════ TAB: ANALYTICS ══════════════════ */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          {/* produto selecionado no topo */}
          <div className="flex items-center gap-2 mb-1">
            <label className="text-xs text-gray-500 uppercase tracking-widest">Produto:</label>
            <div className="relative">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="appearance-none bg-[#111827] border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:border-sky-500/50"
              >
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {STORES.map((s) => {
              const q = stock[s.id]?.[selectedProduct] ?? 0;
              const lv = stockLevel(q);
              const max = Math.max(...STORES.map((st) => stock[st.id]?.[selectedProduct] ?? 0));
              const pct = max > 0 ? Math.round((q / max) * 100) : 0;
              return (
                <div key={s.id} className={`bg-[#111827] border rounded-xl p-4 ${levelBg[lv]}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{s.state}</p>
                      <p className="text-xs text-gray-300 font-medium mt-0.5">{s.city}</p>
                    </div>
                    <Warehouse size={14} className="text-gray-600" />
                  </div>
                  <p className={`text-2xl font-bold font-mono ${levelColors[lv]}`}>{q}</p>
                  <p className="text-[10px] text-gray-600 font-mono mb-3">unidades</p>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${levelBar[lv]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1.5">
                    {lv === "ok" ? "✓ Normal" : lv === "low" ? "⚠ Baixo" : "✗ Crítico"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* tabela resumo todas as categorias */}
          <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Resumo de estoque por loja</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#1a2438] border-b border-white/5">
                    <th className="text-left text-gray-500 py-3 px-3 font-medium">Produto</th>
                    <th className="text-left text-gray-500 py-3 px-3 font-medium">Cat.</th>
                    {STORES.map((s) => (
                      <th key={s.id} className="text-center text-gray-500 py-3 px-3 font-medium">{s.state}</th>
                    ))}
                    <th className="text-right text-gray-500 py-3 px-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.slice(0, 20).map((p) => {
                    const qtys = STORES.map((s) => stock[s.id]?.[p.id] ?? 0);
                    const total = qtys.reduce((a, v) => a + v, 0);
                    return (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-2 px-3 text-white whitespace-nowrap">{p.name}</td>
                        <td className="py-2 px-3 text-gray-500">{p.category}</td>
                        {qtys.map((q, i) => (
                          <td key={i} className={`py-2 px-3 text-center font-mono ${levelColors[stockLevel(q)]}`}>{q}</td>
                        ))}
                        <td className="py-2 px-3 text-right font-mono text-gray-300 font-medium">{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
