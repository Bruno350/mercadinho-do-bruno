import * as XLSX from "xlsx";
import { STORES, PRODUCTS, SALES, DASHBOARD_DATA } from "./mockData";

const fmt = (v: number) => parseFloat(v.toFixed(2));

export function exportToExcel() {
  const wb = XLSX.utils.book_new();

  // Aba 1 – Lojas
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    STORES.map((s) => ({
      ID: s.id, Nome: s.name, Tipo: s.type === "matriz" ? "Matriz" : "Filial",
      Estado: s.state, Cidade: s.city, Gestor: s.manager,
      "Total em Estoque": s.stock.reduce((a, i) => a + i.quantity, 0),
    }))
  ), "Lojas");

  // Aba 2 – Produtos
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    PRODUCTS.map((p) => ({ ID: p.id, Nome: p.name, Categoria: p.category, "Preço (R$)": fmt(p.unitPrice) }))
  ), "Produtos");

  // Aba 3 – Estoque 6 Meses
  const stockRows: Record<string, unknown>[] = [];
  STORES.forEach((store) => {
    store.stock.forEach((item) => {
      const prod = PRODUCTS.find((p) => p.id === item.productId)!;
      stockRows.push({
        Loja: store.name, Estado: store.state, Produto: prod.name, Categoria: prod.category,
        "Qtd Atual": item.quantity, "Mín.": item.minStock,
        "Jan/25": item.monthlyForecast[0], "Fev/25": item.monthlyForecast[1],
        "Mar/25": item.monthlyForecast[2], "Abr/25": item.monthlyForecast[3],
        "Mai/25": item.monthlyForecast[4], "Jun/25": item.monthlyForecast[5],
        "Total 6m": item.monthlyForecast.reduce((a, v) => a + v, 0),
      });
    });
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(stockRows), "Estoque 6 Meses");

  // Aba 4 – Vendas
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    SALES.map((s) => {
      const store = STORES.find((st) => st.id === s.storeId)!;
      const prod  = PRODUCTS.find((p) => p.id === s.productId)!;
      return { Mês: s.month, Loja: store.name, Estado: store.state, Produto: prod.name, Categoria: prod.category, Unidades: s.unitsSold, "Receita (R$)": fmt(s.revenue), Clientes: s.customers };
    })
  ), "Vendas");

  // Aba 5 – Financeiro Mensal
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    DASHBOARD_DATA.monthly.map((m) => ({ Mês: m.label, "Receita (R$)": fmt(m.totalRevenue), Clientes: m.totalCustomers, Unidades: m.totalUnitsSold }))
  ), "Financeiro Mensal");

  // Aba 6 – Por Estado
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    DASHBOARD_DATA.byState.map((s) => ({ Estado: s.state, "Receita (R$)": fmt(s.revenue), Lojas: s.stores }))
  ), "Por Estado");

  // Aba 7 – Por Filial
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    DASHBOARD_DATA.byStore.map((s) => ({ Nome: s.storeName, Tipo: s.type, Estado: s.state, "Receita (R$)": fmt(s.revenue), Clientes: s.customers, Unidades: s.unitsSold }))
  ), "Por Filial");

  // Aba 8 – Por Produto
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    DASHBOARD_DATA.byProduct.map((p) => ({ Produto: p.productName, Categoria: p.category, "Receita (R$)": fmt(p.revenue), Unidades: p.unitsSold }))
  ), "Por Produto");

  XLSX.writeFile(wb, "MercadinhodoBruno_2025.xlsx");
}