export type StoreType = "matriz" | "filial";

export interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
}

export interface StockItem {
  productId: string;
  quantity: number;
  minStock: number;
  monthlyForecast: number[]; // 6 meses
}

export interface Store {
  id: string;
  name: string;
  type: StoreType;
  state: string;
  city: string;
  manager: string;
  stock: StockItem[];
}

export interface SaleRecord {
  month: string;
  storeId: string;
  productId: string;
  unitsSold: number;
  revenue: number;
  customers: number;
}

export interface MonthlyFinancial {
  month: string;
  label: string;
  totalRevenue: number;
  totalCustomers: number;
  totalUnitsSold: number;
  totalTransactions: number;
}

export interface StoreFinancial {
  storeId: string;
  storeName: string;
  state: string;
  type: StoreType;
  revenue: number;
  customers: number;
  unitsSold: number;
  transactions: number;
}

export interface ProductFinancial {
  productId: string;
  productName: string;
  category: string;
  revenue: number;
  unitsSold: number;
}

export interface StateRevenue {
  state: string;
  revenue: number;
  stores: number;
}

export interface DashboardData {
  stores: Store[];
  products: Product[];
  sales: SaleRecord[];
  monthly: MonthlyFinancial[];
  byStore: StoreFinancial[];
  byProduct: ProductFinancial[];
  byState: StateRevenue[];
  totals: {
    revenue: number;
    customers: number;
    unitsSold: number;
    transactions: number;
  };
}