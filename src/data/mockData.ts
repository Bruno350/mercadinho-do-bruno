import type {
  Store,
  Product,
  SaleRecord,
  DashboardData,
  MonthlyFinancial,
  StoreFinancial,
  ProductFinancial,
  StateRevenue,
} from "../types";

export const PRODUCTS: Product[] = [
  { id: "p01", name: "Smartphone Básico", category: "Eletrônicos", unitPrice: 899.9 },
  { id: "p02", name: "Fone Bluetooth", category: "Eletrônicos", unitPrice: 199.9 },
  { id: "p03", name: "Carregador Rápido", category: "Eletrônicos", unitPrice: 89.9 },
  { id: "p04", name: "Cabo USB-C 2m", category: "Eletrônicos", unitPrice: 39.9 },
  { id: "p05", name: "Caixa de Som Portátil", category: "Eletrônicos", unitPrice: 349.9 },
  { id: "p06", name: "Smartwatch Fitness", category: "Eletrônicos", unitPrice: 599.9 },
  { id: "p07", name: "Webcam HD", category: "Eletrônicos", unitPrice: 279.9 },
  { id: "p08", name: "Mouse Sem Fio", category: "Eletrônicos", unitPrice: 129.9 },
  { id: "p09", name: "Teclado Mecânico", category: "Eletrônicos", unitPrice: 449.9 },
  { id: "p10", name: "Hub USB 4 Portas", category: "Eletrônicos", unitPrice: 99.9 },
  { id: "p11", name: "Camiseta Básica", category: "Vestuário", unitPrice: 59.9 },
  { id: "p12", name: "Calça Jeans Slim", category: "Vestuário", unitPrice: 149.9 },
  { id: "p13", name: "Tênis Casual", category: "Vestuário", unitPrice: 249.9 },
  { id: "p14", name: "Jaqueta Corta-vento", category: "Vestuário", unitPrice: 199.9 },
  { id: "p15", name: "Bermuda Moletom", category: "Vestuário", unitPrice: 79.9 },
  { id: "p16", name: "Meia Esportiva Kit 3", category: "Vestuário", unitPrice: 34.9 },
  { id: "p17", name: "Boné Snapback", category: "Vestuário", unitPrice: 69.9 },
  { id: "p18", name: "Moletom Canguru", category: "Vestuário", unitPrice: 189.9 },
  { id: "p19", name: "Sutiã Esportivo", category: "Vestuário", unitPrice: 89.9 },
  { id: "p20", name: "Legging Compressão", category: "Vestuário", unitPrice: 119.9 },
  { id: "p21", name: "Whey Protein 1kg", category: "Alimentos", unitPrice: 189.9 },
  { id: "p22", name: "Barra de Proteína Cx12", category: "Alimentos", unitPrice: 89.9 },
  { id: "p23", name: "Granola Premium 500g", category: "Alimentos", unitPrice: 34.9 },
  { id: "p24", name: "Café Gourmet 250g", category: "Alimentos", unitPrice: 44.9 },
  { id: "p25", name: "Azeite Extra Virgem 500ml", category: "Alimentos", unitPrice: 39.9 },
  { id: "p26", name: "Mel Orgânico 300g", category: "Alimentos", unitPrice: 29.9 },
  { id: "p27", name: "Amendoim Crocante 200g", category: "Alimentos", unitPrice: 19.9 },
  { id: "p28", name: "Pasta de Amendoim 500g", category: "Alimentos", unitPrice: 24.9 },
  { id: "p29", name: "Chá Verde Cx 20", category: "Alimentos", unitPrice: 14.9 },
  { id: "p30", name: "Aveia Flocos 500g", category: "Alimentos", unitPrice: 12.9 },
  { id: "p31", name: "Luminária LED Mesa", category: "Casa & Deco", unitPrice: 129.9 },
  { id: "p32", name: "Porta-Retratos 10x15", category: "Casa & Deco", unitPrice: 29.9 },
  { id: "p33", name: "Tapete Antiderrapante", category: "Casa & Deco", unitPrice: 79.9 },
  { id: "p34", name: "Vaso Decorativo G", category: "Casa & Deco", unitPrice: 89.9 },
  { id: "p35", name: "Almofada Cervical", category: "Casa & Deco", unitPrice: 149.9 },
  { id: "p36", name: "Jogo de Toalhas Kit 2", category: "Casa & Deco", unitPrice: 99.9 },
  { id: "p37", name: "Organizador Gaveta", category: "Casa & Deco", unitPrice: 49.9 },
  { id: "p38", name: "Difusor Aromatizador", category: "Casa & Deco", unitPrice: 69.9 },
  { id: "p39", name: "Quadro Canvas 40x60", category: "Casa & Deco", unitPrice: 119.9 },
  { id: "p40", name: "Relógio Parede Design", category: "Casa & Deco", unitPrice: 99.9 },
  { id: "p41", name: "Hidratante Corporal 400ml", category: "Beleza", unitPrice: 49.9 },
  { id: "p42", name: "Shampoo Anti-Queda", category: "Beleza", unitPrice: 39.9 },
  { id: "p43", name: "Protetor Solar FPS 50", category: "Beleza", unitPrice: 59.9 },
  { id: "p44", name: "Máscara Facial Argila", category: "Beleza", unitPrice: 29.9 },
  { id: "p45", name: "Perfume Unissex 50ml", category: "Beleza", unitPrice: 199.9 },
  { id: "p46", name: "Kit Manicure 8 Peças", category: "Beleza", unitPrice: 44.9 },
  { id: "p47", name: "Escova de Cabelo Pro", category: "Beleza", unitPrice: 89.9 },
  { id: "p48", name: "Creme Anti-Idade 50g", category: "Beleza", unitPrice: 79.9 },
  { id: "p49", name: "Batom Matte Longa Duração", category: "Beleza", unitPrice: 34.9 },
  { id: "p50", name: "Esfoliante Corporal", category: "Beleza", unitPrice: 39.9 },
  { id: "p51", name: "Caderno Capa Dura 200fls", category: "Papelaria", unitPrice: 49.9 },
  { id: "p52", name: "Caneta Gel Kit 10", category: "Papelaria", unitPrice: 29.9 },
  { id: "p53", name: "Mochila Escolar 30L", category: "Papelaria", unitPrice: 189.9 },
  { id: "p54", name: "Agenda 2025", category: "Papelaria", unitPrice: 39.9 },
  { id: "p55", name: "Post-it Kit 4 Cores", category: "Papelaria", unitPrice: 19.9 },
  { id: "p56", name: "Pasta Arquivo A4", category: "Papelaria", unitPrice: 14.9 },
  { id: "p57", name: "Régua 30cm Flex", category: "Papelaria", unitPrice: 9.9 },
  { id: "p58", name: "Tesoura Escritório", category: "Papelaria", unitPrice: 19.9 },
  { id: "p59", name: "Grampeador Pequeno", category: "Papelaria", unitPrice: 24.9 },
  { id: "p60", name: "Marcador de Texto Kit 6", category: "Papelaria", unitPrice: 22.9 },
  { id: "p61", name: "Bola de Futebol Campo", category: "Esportes", unitPrice: 149.9 },
  { id: "p62", name: "Raquete Tênis", category: "Esportes", unitPrice: 299.9 },
  { id: "p63", name: "Luva Musculação", category: "Esportes", unitPrice: 69.9 },
  { id: "p64", name: "Garrafa Térmica 1L", category: "Esportes", unitPrice: 89.9 },
  { id: "p65", name: "Corda de Pular Pro", category: "Esportes", unitPrice: 39.9 },
  { id: "p66", name: "Colchonete Yoga 6mm", category: "Esportes", unitPrice: 129.9 },
  { id: "p67", name: "Haltere Borracha 5kg", category: "Esportes", unitPrice: 99.9 },
  { id: "p68", name: "Elástico Resistência Kit", category: "Esportes", unitPrice: 49.9 },
  { id: "p69", name: "Meia Compressão Corrida", category: "Esportes", unitPrice: 59.9 },
  { id: "p70", name: "Suporte Joelho Elastic", category: "Esportes", unitPrice: 44.9 },
  { id: "p71", name: "LEGO City 200 Peças", category: "Brinquedos", unitPrice: 249.9 },
  { id: "p72", name: "Boneca Articulada", category: "Brinquedos", unitPrice: 89.9 },
  { id: "p73", name: "Carrinho Controle Remoto", category: "Brinquedos", unitPrice: 179.9 },
  { id: "p74", name: "Quebra-Cabeça 500 Peças", category: "Brinquedos", unitPrice: 59.9 },
  { id: "p75", name: "Jogo de Tabuleiro", category: "Brinquedos", unitPrice: 99.9 },
  { id: "p76", name: "Massinha de Modelar Kit", category: "Brinquedos", unitPrice: 29.9 },
  { id: "p77", name: "Pistola de Bolha de Sabão", category: "Brinquedos", unitPrice: 34.9 },
  { id: "p78", name: "Pipa Delta 1m", category: "Brinquedos", unitPrice: 49.9 },
  { id: "p79", name: "Kit Pintura Aquarela", category: "Brinquedos", unitPrice: 44.9 },
  { id: "p80", name: "Estica-me Fidget Toy", category: "Brinquedos", unitPrice: 19.9 },
  { id: "p81", name: "Parafusadeira 12V", category: "Ferramentas", unitPrice: 399.9 },
  { id: "p82", name: "Jogo de Chaves 40 Pcs", category: "Ferramentas", unitPrice: 149.9 },
  { id: "p83", name: "Trena Digital 5m", category: "Ferramentas", unitPrice: 89.9 },
  { id: "p84", name: "Alicate Universal", category: "Ferramentas", unitPrice: 59.9 },
  { id: "p85", name: "Nível de Bolha 60cm", category: "Ferramentas", unitPrice: 49.9 },
  { id: "p86", name: "Lixa Grão 100 Kit 10", category: "Ferramentas", unitPrice: 24.9 },
  { id: "p87", name: "Pistola Silicone", category: "Ferramentas", unitPrice: 39.9 },
  { id: "p88", name: "Serra Manual 18", category: "Ferramentas", unitPrice: 79.9 },
  { id: "p89", name: "Martelo Carpinteiro", category: "Ferramentas", unitPrice: 69.9 },
  { id: "p90", name: "Fita Isolante Kit 5", category: "Ferramentas", unitPrice: 19.9 },
  { id: "p91", name: "Ração Cão Premium 15kg", category: "Pet Shop", unitPrice: 249.9 },
  { id: "p92", name: "Ração Gato Premium 3kg", category: "Pet Shop", unitPrice: 89.9 },
  { id: "p93", name: "Shampoo Pet Neutro 500ml", category: "Pet Shop", unitPrice: 34.9 },
  { id: "p94", name: "Cama Pet Tamanho M", category: "Pet Shop", unitPrice: 149.9 },
  { id: "p95", name: "Arranhador Gato Tower", category: "Pet Shop", unitPrice: 199.9 },
  { id: "p96", name: "Coleira Reforçada M", category: "Pet Shop", unitPrice: 49.9 },
  { id: "p97", name: "Brinquedo Interativo Pet", category: "Pet Shop", unitPrice: 39.9 },
  { id: "p98", name: "Antipulgas Pipeta", category: "Pet Shop", unitPrice: 29.9 },
  { id: "p99", name: "Petisco Natural 200g", category: "Pet Shop", unitPrice: 24.9 },
  { id: "p100", name: "Bebedouro Fonte Pet", category: "Pet Shop", unitPrice: 129.9 },
];

const buildStock = (multiplier = 1) =>
  PRODUCTS.map((p) => ({
    productId: p.id,
    quantity: Math.round((120 + Math.random() * 80) * multiplier),
    minStock: 20,
    monthlyForecast: Array.from({ length: 6 }, () =>
      Math.round((30 + Math.random() * 40) * multiplier)
    ),
  }));

export const STORES: Store[] = [
  { id: "s1", name: "Matriz São Paulo",      type: "matriz", state: "SP", city: "São Paulo",      manager: "Tiago",   stock: buildStock(2)   },
  { id: "s2", name: "Filial Rio de Janeiro", type: "filial", state: "RJ", city: "Rio de Janeiro", manager: "Tiago2",   stock: buildStock(1.4) },
  { id: "s3", name: "Filial Belo Horizonte", type: "filial", state: "MG", city: "Belo Horizonte", manager: "Bruno",     stock: buildStock(1.1) },
  { id: "s4", name: "Filial Curitiba",       type: "filial", state: "PR", city: "Curitiba",       manager: "Bruno2",  stock: buildStock(0.9) },
  { id: "s5", name: "Filial Recife",         type: "filial", state: "PE", city: "Recife",         manager: "Tiago Bruno",   stock: buildStock(0.8) },
];

const MONTHS = ["2025-01","2025-02","2025-03","2025-04","2025-05","2025-06"];
const MONTH_LABELS: Record<string, string> = {
  "2025-01": "Jan/25", "2025-02": "Fev/25", "2025-03": "Mar/25",
  "2025-04": "Abr/25", "2025-05": "Mai/25", "2025-06": "Jun/25",
};
const storeMultiplier: Record<string, number> = { s1:2.0, s2:1.5, s3:1.1, s4:0.9, s5:0.8 };

function seed(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h) / 2147483648;
}

export const SALES: SaleRecord[] = [];
MONTHS.forEach((month) => {
  STORES.forEach((store) => {
    PRODUCTS.forEach((product) => {
      const s = seed(`${month}-${store.id}-${product.id}`);
      const units = Math.max(1, Math.round(s * 60 * storeMultiplier[store.id]));
      const customers = Math.max(1, Math.round(units * (0.6 + s * 0.4)));
      SALES.push({ month, storeId: store.id, productId: product.id, unitsSold: units, revenue: units * product.unitPrice, customers });
    });
  });
});

function aggregateDashboard(): DashboardData {
  const monthly: MonthlyFinancial[] = MONTHS.map((m) => {
    const rows = SALES.filter((s) => s.month === m);
    return { month: m, label: MONTH_LABELS[m], totalRevenue: rows.reduce((a,r)=>a+r.revenue,0), totalCustomers: rows.reduce((a,r)=>a+r.customers,0), totalUnitsSold: rows.reduce((a,r)=>a+r.unitsSold,0), totalTransactions: rows.length };
  });
  const byStore: StoreFinancial[] = STORES.map((store) => {
    const rows = SALES.filter((s) => s.storeId === store.id);
    return { storeId: store.id, storeName: store.name, state: store.state, type: store.type, revenue: rows.reduce((a,r)=>a+r.revenue,0), customers: rows.reduce((a,r)=>a+r.customers,0), unitsSold: rows.reduce((a,r)=>a+r.unitsSold,0), transactions: rows.length };
  });
  const byProduct: ProductFinancial[] = PRODUCTS.map((product) => {
    const rows = SALES.filter((s) => s.productId === product.id);
    return { productId: product.id, productName: product.name, category: product.category, revenue: rows.reduce((a,r)=>a+r.revenue,0), unitsSold: rows.reduce((a,r)=>a+r.unitsSold,0) };
  }).sort((a,b)=>b.revenue-a.revenue);
  const stateMap = new Map<string,{revenue:number;stores:number}>();
  byStore.forEach((s) => { const p = stateMap.get(s.state)??{revenue:0,stores:0}; stateMap.set(s.state,{revenue:p.revenue+s.revenue,stores:p.stores+1}); });
  const byState: StateRevenue[] = Array.from(stateMap.entries()).map(([state,v])=>({state,...v}));
  const totals = { revenue: SALES.reduce((a,r)=>a+r.revenue,0), customers: SALES.reduce((a,r)=>a+r.customers,0), unitsSold: SALES.reduce((a,r)=>a+r.unitsSold,0), transactions: SALES.length };
  return { stores: STORES, products: PRODUCTS, sales: SALES, monthly, byStore, byProduct, byState, totals };
}

export const DASHBOARD_DATA: DashboardData = aggregateDashboard();