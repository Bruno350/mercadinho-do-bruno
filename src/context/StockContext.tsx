import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from "react";
import { STORES } from "../data/mockData";
import type { StockItem } from "../types";

/**
 * ── StockContext ──────────────────────────────────────────────────
 * Por que isso existe (pra explicar na apresentação):
 *
 * Antes, a tela de Estoque lia os dados direto do mockData.ts (estático)
 * e a tela de Movimentação tinha seu PRÓPRIO estado local (useState).
 * Ou seja: eram duas "fontes de verdade" diferentes na memória.
 * Quando você transferia um produto, só a tela de Movimentação sabia disso.
 *
 * A solução foi centralizar o estoque em um único lugar (Context API do
 * React) que fica "acima" de todas as telas. Qualquer componente que
 * precisar ler ou alterar o estoque usa o hook useStock() — e como todos
 * leem da MESMA fonte, qualquer alteração aparece instantaneamente em
 * todas as telas, sem precisar recarregar a página.
 *
 * Bônus: persistimos no localStorage do navegador, então mesmo se você
 * atualizar a página (F5), o estoque "lembra" do estado anterior.
 * Isso simula um comportamento parecido com salvar em um banco de dados.
 */

type StockState = Record<string, Record<string, number>>;

interface StockContextValue {
  /** Retorna a quantidade atual de um produto em uma loja específica */
  getQuantity: (storeId: string, productId: string) => number;
  /** Move unidades de uma loja origem para uma loja destino */
  transfer: (originId: string, destId: string, productId: string, qty: number) => void;
  /** Volta o estoque para os valores originais do mockData */
  resetStock: () => void;
  /** Retorna a lista completa de estoque de uma loja, já com quantidades atualizadas */
  getStoreStock: (storeId: string) => (StockItem & { quantity: number })[];
}

const STORAGE_KEY = "mercadinho_stock_v1";

function buildInitialStock(): StockState {
  const state: StockState = {};
  STORES.forEach((store) => {
    state[store.id] = {};
    store.stock.forEach((item) => {
      state[store.id][item.productId] = item.quantity;
    });
  });
  return state;
}

function loadStock(): StockState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StockState;
  } catch {
    // se o localStorage estiver corrompido ou indisponível, segue com o padrão
  }
  return buildInitialStock();
}

const StockContext = createContext<StockContextValue | null>(null);

export function StockProvider({ children }: { children: ReactNode }) {
  // estado único, compartilhado por toda a aplicação
  const [stockState, setStockState] = useState<StockState>(loadStock);

  // toda vez que o estoque muda, persiste no localStorage automaticamente
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stockState));
    } catch {
      // localStorage pode falhar em modo anônimo/privado — ignoramos silenciosamente
    }
  }, [stockState]);

  const getQuantity = (storeId: string, productId: string) =>
    stockState[storeId]?.[productId] ?? 0;

  const transfer = (originId: string, destId: string, productId: string, qty: number) => {
    setStockState((prev) => {
      const origQty = prev[originId]?.[productId] ?? 0;
      const destQty = prev[destId]?.[productId] ?? 0;
      return {
        ...prev,
        [originId]: { ...prev[originId], [productId]: origQty - qty },
        [destId]: { ...prev[destId], [productId]: destQty + qty },
      };
    });
  };

  const resetStock = () => {
    const fresh = buildInitialStock();
    setStockState(fresh);
  };

  const getStoreStock = (storeId: string) => {
    const store = STORES.find((s) => s.id === storeId);
    if (!store) return [];
    return store.stock.map((item) => ({
      ...item,
      quantity: stockState[storeId]?.[item.productId] ?? item.quantity,
    }));
  };

  // useMemo evita recriar o objeto de contexto em todo render,
  // só recalcula quando o estoque de fato muda
  const value = useMemo(
    () => ({ getQuantity, transfer, resetStock, getStoreStock }),
    [stockState]
  );

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
}

/** Hook de acesso ao estoque global — use em qualquer componente dentro do StockProvider */
export function useStock() {
  const ctx = useContext(StockContext);
  if (!ctx) {
    throw new Error("useStock() precisa ser usado dentro de um <StockProvider>");
  }
  return ctx;
}
