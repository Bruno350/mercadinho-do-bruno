import { useState, useEffect, useRef } from "react";
import {
  Presentation,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Truck,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  BarChart3,
  PieChart,
  Table2,
  AlertTriangle,
  ArrowLeftRight,
  History,
  Database,
  Cpu,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

type Tab = "dashboard" | "estoque" | "transferencia";

interface Props {
  currentTab: Tab;
}

interface Step {
  tab: Tab;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  what: string;           // O QUE É
  how: string;            // COMO FUNCIONA TECNICAMENTE
  points: string[];       // bullets do que apontar na tela
  techDetail: string;     // detalhe técnico extra
  speak: string;          // fala sugerida
}

const STEPS: Step[] = [
  // ── DASHBOARD ─────────────────────────────────────────────────
  {
    tab: "dashboard",
    title: "KPIs do Dashboard",
    badge: "Dashboard · Topo",
    badgeColor: "bg-sky-500/15 border-sky-500/20 text-sky-400",
    icon: TrendingUp,
    what: "KPI = Key Performance Indicator. São os 4 cards no topo — números resumidos que mostram o estado do negócio sem precisar abrir planilha.",
    how: "Os valores são pré-agregados pela função aggregateDashboard() no startup da aplicação. Ela itera sobre os 3.000 registros de SALES e acumula totais com .reduce(). A tendência ▲▼ compara last.totalRevenue com prev.totalRevenue via ((last - prev) / prev) * 100.",
    points: [
      "Nº de Clientes — soma de customers de todos os registros de venda",
      "Unidades Vendidas — soma de unitsSold (produtos físicos)",
      "Receita Total — soma de revenue em notação compacta (ex: R$ 20M)",
      "Qtd de Vendas — total de linhas de venda (5 lojas × 100 produtos × 6 meses = 3.000)",
      "▲▼ em azul/laranja — tendência do último mês vs. penúltimo",
    ],
    techDetail: "Dado analítico: estático, fechado, não muda com transferências. Calculado uma vez no load e não reage ao StockContext.",
    speak: "Esses quatro cards são nossos KPIs — indicadores-chave de desempenho. São calculados uma única vez quando a aplicação carrega, percorrendo os 3 mil registros de venda gerados pelo nosso mockData.",
  },
  {
    tab: "dashboard",
    title: "Gráfico de Evolução Mensal",
    badge: "Dashboard · Gráfico de Área",
    badgeColor: "bg-sky-500/15 border-sky-500/20 text-sky-400",
    icon: BarChart3,
    what: "Gráfico de área dupla mostrando receita e número de clientes mês a mês, de Jan a Jun/2026.",
    how: "Implementado com Recharts <AreaChart> + dois <YAxis> independentes (yAxisId='rev' e yAxisId='cust'). Isso permite que receita (escala de milhões) e clientes (escala de milhares) coexistam no mesmo canvas sem distorção visual. O gradiente de preenchimento é definido com <linearGradient> dentro de <defs>.",
    points: [
      "Linha azul (sky) = Receita Total — eixo Y esquerdo em R$",
      "Linha verde (emerald) = Clientes — eixo Y direito oculto",
      "Tooltip customizado: mostra os dois valores ao hover",
      "Pontos circulares em cada mês (dot={fill, r:4})",
    ],
    techDetail: "Dois eixos Y independentes via yAxisId. O eixo de clientes fica oculto (hide) mas ainda controla a escala da série correspondente.",
    speak: "O gráfico usa dois eixos Y independentes — isso é necessário porque receita está na casa de milhões e clientes na casa de dezenas de mil. Sem dois eixos, uma das séries ficaria completamente achatada.",
  },
  {
    tab: "dashboard",
    title: "Gráfico de Barras por Filial",
    badge: "Dashboard · Gráfico de Barras",
    badgeColor: "bg-sky-500/15 border-sky-500/20 text-sky-400",
    icon: BarChart3,
    what: "Comparativo de receita acumulada entre as 5 lojas, com cor distinta por filial.",
    how: "Recharts <BarChart> com um array COLORS mapeado via <Cell> para cada barra. O multiplicador storeMultiplier no mockData (s1:2.0, s2:1.5 ... s5:0.8) define propositalmente que a Matriz SP vende mais, criando hierarquia visual realista.",
    points: [
      "Barra mais alta = Matriz São Paulo (multiplicador 2.0×)",
      "Hover mostra tooltip com receita exata e número de clientes",
      "Cantos arredondados nas barras: radius={[4,4,0,0]}",
      "Cursor personalizado ao hover: fill rgba branco semitransparente",
    ],
    techDetail: "Os dados byStore vêm de aggregateDashboard() que filtra SALES por storeId e soma receita com .reduce(). Não é um dado calculado em runtime — é pré-computado.",
    speak: "Dá pra ver que a Matriz de São Paulo domina a receita. Isso é proposital — o mockData aplica multiplicadores diferentes por loja para simular uma rede realista onde a matriz é maior que as filiais.",
  },
  {
    tab: "dashboard",
    title: "Pizza por Estado + Top Produtos",
    badge: "Dashboard · Análise",
    badgeColor: "bg-sky-500/15 border-sky-500/20 text-sky-400",
    icon: PieChart,
    what: "Pizza: distribuição percentual de receita por estado (SP, RJ, MG, PR, PE). Tabela: ranking dos produtos mais rentáveis com receita e unidades vendidas.",
    how: "byState é gerado agrupando byStore por state com um Map<string, {revenue, stores}>. byProduct é o array de 100 produtos ordenado por .sort((a,b) => b.revenue - a.revenue) — Top 10 mais rentáveis aparecem primeiro.",
    points: [
      "Pizza: cada fatia = um estado, proporcional à receita",
      "Tabela: ordenada por receita decrescente por padrão",
      "Tabela tem busca, filtro por categoria e paginação",
      "Produto mais vendido em receita ≠ necessariamente mais unidades",
    ],
    techDetail: "Produto de maior receita tende a ser de alto valor unitário (ex: Smartphone Básico R$899,90) mesmo com menos unidades. Isso ilustra a diferença entre volume e margem.",
    speak: "A pizza mostra concentração geográfica. A tabela abaixo ranqueia produtos por receita — interessante notar que os eletrônicos dominam o topo mesmo com menos unidades, por causa do preço unitário alto.",
  },

  // ── ESTOQUE ───────────────────────────────────────────────────
  {
    tab: "estoque",
    title: "KPIs Operacionais de Estoque",
    badge: "Estoque · Topo",
    badgeColor: "bg-emerald-500/15 border-emerald-500/20 text-emerald-400",
    icon: Package,
    what: "Quatro indicadores operacionais da loja selecionada: total em estoque, itens críticos, itens baixos e previsão de demanda para 6 meses.",
    how: "Os valores são computados via useMemo() sobre o array liveStock que vem do StockContext. getStoreStock(storeId) retorna os itens com quantity já atualizado pelo estado global — não lê do mockData diretamente. Isso garante que transferências feitas na tela de Movimentação reflitam aqui instantaneamente.",
    points: [
      "Total: soma de quantity de todos os StockItems da loja",
      "Críticos: quantity < minStock (20) — badge vermelho",
      "Baixos: minStock ≤ quantity < minStock×2 — badge âmbar",
      "Previsão: soma de todos os monthlyForecast[0..5] da loja",
      "Badge 'Tempo real' pisca — indica que reage ao StockContext",
    ],
    techDetail: "useMemo([liveStock]) só recalcula quando liveStock muda. liveStock muda quando o StockContext emite nova versão do estado — que acontece ao chamar transfer().",
    speak: "Esses KPIs são operacionais, não analíticos. Diferente do Dashboard, eles mudam em tempo real quando fazemos uma transferência — porque leem do mesmo contexto global que a tela de Movimentação altera.",
  },
  {
    tab: "estoque",
    title: "Seletor de Lojas",
    badge: "Estoque · Navegação",
    badgeColor: "bg-emerald-500/15 border-emerald-500/20 text-emerald-400",
    icon: Users,
    what: "Grid de botões — um por loja — que troca o contexto de toda a tela instantaneamente.",
    how: "setStoreId(s.id) atualiza o estado local da página. Isso faz com que liveStock seja recalculado via useMemo([storeId, getStoreStock]) e todos os componentes dependentes (KPIs, tabela, comparativo) re-renderizam com os dados da nova loja. Nenhuma chamada de rede — tudo em memória.",
    points: [
      "Botão ativo: borda sky + background sky/15 (seleção clara)",
      "Cada botão mostra cidade + estado + nome do gerente",
      "Troca instantânea — zero loading, zero requisição HTTP",
      "Badge Matriz/Filial no header atualiza junto",
    ],
    techDetail: "Padrão de controlled component: storeId é estado React, os botões apenas chamam setStoreId. Tudo derivado do estado, nada duplicado.",
    speak: "Clicando em qualquer loja os dados mudam instantaneamente. Não há carregamento porque tudo já está em memória — o React simplesmente filtra e re-renderiza.",
  },
  {
    tab: "estoque",
    title: "Tabela de Estoque com Alertas",
    badge: "Estoque · Tabela Principal",
    badgeColor: "bg-emerald-500/15 border-emerald-500/20 text-emerald-400",
    icon: Table2,
    what: "Tabela completa com todos os produtos da loja, nível de estoque colorido, barra de progresso inline e previsão mensal de Jan a Jun.",
    how: "A função stockLevel(qty, min) categoriza em 'ok' / 'low' / 'crit' com base no minStock. A barra de progresso é pct = Math.min(100, (quantity / (minStock × 4)) × 100) — satura em 100% quando o estoque está no quádruplo do mínimo. Colunas clicáveis chamam toggleSort() que alterna sortField e sortDir.",
    points: [
      "Verde (Normal): quantity ≥ minStock × 2",
      "Âmbar (Baixo): minStock ≤ quantity < minStock × 2",
      "Vermelho (Crítico): quantity < minStock (abaixo de 20)",
      "Barra inline: visual proporcional ao máximo teórico (minStock × 4)",
      "Colunas ordenáveis: clique no cabeçalho para ordenar ▲▼",
      "Colunas Jan–Jun: monthlyForecast[0..5] por produto",
    ],
    techDetail: "Ordenação implementada com [...filtered].sort() — cópia do array para não mutar o estado. Comparação usa localeCompare para strings e subtração para números.",
    speak: "A cor de cada linha não é decorativa — ela codifica um estado de negócio real. Vermelho significa ruptura iminente, âmbar significa atenção. As colunas de previsão mostram o planejamento de demanda para os próximos 6 meses.",
  },
  {
    tab: "estoque",
    title: "Comparativo entre Lojas",
    badge: "Estoque · Rodapé",
    badgeColor: "bg-emerald-500/15 border-emerald-500/20 text-emerald-400",
    icon: AlertTriangle,
    what: "Barras horizontais mostrando o estoque total de cada loja, proporcionalmente. Clicar numa barra troca a loja ativa.",
    how: "Para cada loja, chama getStoreStock(s.id).reduce(soma) para obter o total. O maxTotal é o maior entre todas as lojas — usado para normalizar as barras em percentual. A loja selecionada recebe bg-sky-500, as demais bg-gray-600.",
    points: [
      "Barra proporcional ao maior estoque (não fixa em 100%)",
      "Clicar no nome da loja chama setStoreId() — mesma ação dos botões do topo",
      "Loja selecionada: texto sky-400 + barra sky-500",
      "Atualiza em tempo real após transferências",
    ],
    techDetail: "getStoreStock() lê do StockContext — então quando uma transferência acontece, o comparativo reflete a mudança sem nenhum efeito extra.",
    speak: "Esse comparativo usa o mesmo getStoreStock do contexto global. Se fizermos uma transferência agora e voltarmos aqui, as barras já vão estar diferentes.",
  },

  // ── TRANSFERÊNCIA ─────────────────────────────────────────────
  {
    tab: "transferencia",
    title: "KPIs da Sessão de Movimentação",
    badge: "Movimentação · Topo",
    badgeColor: "bg-amber-500/15 border-amber-500/20 text-amber-400",
    icon: ArrowLeftRight,
    what: "Três contadores que acumulam durante a sessão: número de transferências realizadas, unidades movidas e valor financeiro total movimentado.",
    how: "São derivados do array history via .reduce() local no componente — não persistem no StockContext nem no localStorage. Se recarregar a página, voltam a zero (o estoque persiste, o histórico de sessão não).",
    points: [
      "Transferências: history.length",
      "Unidades: history.reduce((a,h) => a + h.qty, 0)",
      "Valor: history.reduce((a,h) => a + h.valor, 0) — qty × unitPrice",
    ],
    techDetail: "Distinção importante: StockContext persiste no localStorage (estoque sobrevive ao F5). O history é useState local — efêmero, só existe enquanto a página estiver aberta.",
    speak: "Esses três números acumulam durante a sessão. Repare que o valor é calculado automaticamente: quantidade transferida vezes o preço unitário do produto — isso simula o custo logístico da movimentação.",
  },
  {
    tab: "transferencia",
    title: "Seleção de Produto e Preview de Estoque",
    badge: "Movimentação · Painel Esquerdo",
    badgeColor: "bg-amber-500/15 border-amber-500/20 text-amber-400",
    icon: Package,
    what: "Lista filtrável de produtos com busca por nome e filtro por categoria. Abaixo, barra de estoque atual do produto selecionado em cada loja.",
    how: "filteredProducts filtra PRODUCTS com .filter() em tempo real enquanto o usuário digita. As barras de estoque chamam getQuantity(s.id, selectedProduct) para cada loja — leitura direta do StockContext. O nível mínimo exibido (mín X) é o menor estoque entre todas as lojas para aquele produto.",
    points: [
      "Busca: filtra por p.name.toLowerCase().includes(search.toLowerCase())",
      "Filtro: filtra por p.category — 9 categorias disponíveis",
      "Produto ativo: borda sky + bg sky/15",
      "Barra por loja: proporcional ao maior estoque atual entre as lojas",
      "Cor da barra: verde/âmbar/vermelho via stockLevel()",
    ],
    techDetail: "A barra usa max = Math.max(...STORES.map(s => getQuantity(s.id, p.id))) para normalizar. Cada getQuantity() lê do estado do contexto — reativo.",
    speak: "Ao selecionar um produto, as barras abaixo mostram instantaneamente onde ele está mais abundante e onde está crítico. Isso guia a decisão de qual loja deve ceder e qual deve receber.",
  },
  {
    tab: "transferencia",
    title: "Formulário de Transferência com Validações",
    badge: "Movimentação · Painel Direito",
    badgeColor: "bg-amber-500/15 border-amber-500/20 text-amber-400",
    icon: Truck,
    what: "Configuração completa da transferência: produto selecionado, origem, destino, quantidade (slider + input), motivo e preview do resultado antes de confirmar.",
    how: "Três flags booleanas controlam o estado: sameStore = originId === destId, notEnough = qty > origQty, willGoLow = origQty - qty < 20. canTransfer = !sameStore && !notEnough && qty > 0. O botão de confirmar só fica habilitado quando canTransfer é true.",
    points: [
      "Slider e input numérico sincronizados: onChange em ambos atualiza o mesmo qty",
      "max do slider = origQty — impossível arrastar além do disponível",
      "Preview: mostra o valor riscado (original) e o novo valor colorido",
      "Erro vermelho: mesma loja / estoque insuficiente",
      "Aviso âmbar: transferência deixará origem abaixo do mínimo (< 20)",
      "Motivo: chips clicáveis — 6 opções predefinidas",
    ],
    techDetail: "O preview usa origQty - qty e destQty + qty para mostrar o resultado projetado ANTES de confirmar — UX de simulação antes de comprometer o estado.",
    speak: "O formulário tem três camadas de validação. Primeiro impede mesma loja. Segundo impede estoque insuficiente. Terceiro avisa — mas não bloqueia — quando a origem vai ficar abaixo do mínimo recomendado.",
  },
  {
    tab: "transferencia",
    title: "Confirmação e Atualização em Tempo Real",
    badge: "Movimentação · Ação Principal",
    badgeColor: "bg-amber-500/15 border-amber-500/20 text-amber-400",
    icon: CheckCircle2,
    what: "O clique em 'Confirmar transferência' é a operação central do sistema — propaga a mudança para todas as telas via Context API.",
    how: "confirmar() chama transferStock(originId, destId, selectedProduct, qty) que internamente chama setStockState() no StockContext com uma atualização imutável. React detecta a mudança de estado, re-renderiza todos os componentes que consomem o contexto (StockView, os comparativos, as barras de estoque). O useEffect no Provider salva no localStorage automaticamente.",
    points: [
      "Chama transfer() do useStock() hook",
      "setStockState usa spread operator para imutabilidade: {...prev, [originId]: {...}}",
      "Notificação toast: aparece no canto superior direito por 3,5s",
      "Registro adicionado ao history com timestamp, qty, valor e estoques finais",
      "Se navegar para a aba Estoque agora, o número já estará diferente",
    ],
    techDetail: "Imutabilidade é obrigatória no React: nunca mutar prev diretamente. O spread {...prev[storeId], [productId]: novoValor} cria um novo objeto — isso é o que dispara a re-renderização.",
    speak: "Esse é o momento mais importante para mostrar na apresentação. Confirme a transferência, depois navegue imediatamente para a aba Estoque — o número vai estar diferente sem nenhum recarregamento.",
  },
  {
    tab: "transferencia",
    title: "Histórico e Analytics",
    badge: "Movimentação · Abas secundárias",
    badgeColor: "bg-amber-500/15 border-amber-500/20 text-amber-400",
    icon: History,
    what: "Aba Histórico: log cronológico das transferências da sessão. Aba Estoque (Analytics): visão matricial de todos os produtos × todas as lojas.",
    how: "Histórico: array history renderizado como tabela — cada item tem id (timestamp), hora formatada, produto, cidades, quantidade, valor e motivo. Analytics: PRODUCTS.slice(0,20).map() × STORES.map() montando uma grade de getQuantity() — cada célula é uma leitura do StockContext.",
    points: [
      "Histórico: hora, produto, origem → destino, qtd, valor BRL, motivo",
      "Analytics: tabela 20 produtos × 5 lojas com total por linha",
      "Células coloridas: verde/âmbar/vermelho via stockLevel()",
      "Dropdown de produto no Analytics: muda o card de estoque por loja",
      "Cards por loja no Analytics: mostram o nível percentual com barra",
    ],
    techDetail: "O histórico é efêmero (useState local). O analytics é derivado em tempo real do StockContext — reflete o estado atual mesmo após várias transferências.",
    speak: "O histórico registra tudo que fizemos nessa sessão. A aba de Analytics é especialmente útil para visualizar qual produto está crítico em qual loja antes de decidir de onde transferir.",
  },
  // ── ARQUITETURA ───────────────────────────────────────────────
  {
    tab: "transferencia",
    title: "Arquitetura Geral do Sistema",
    badge: "Visão técnica geral",
    badgeColor: "bg-fuchsia-500/15 border-fuchsia-500/20 text-fuchsia-400",
    icon: Database,
    what: "Como todas as peças se conectam: mockData → StockContext → telas. Por que não há banco de dados e como o localStorage simula persistência.",
    how: "mockData.ts gera os dados iniciais (seed determinística). StockProvider inicializa o estado com loadStock() que tenta ler o localStorage — se vazio, usa buildInitialStock() com os dados do mockData. As telas consomem via useStock() hook. Cada alteração dispara useEffect que persiste no localStorage.",
    points: [
      "mockData.ts: 100 produtos × 5 lojas × 6 meses = 3.000 SALES gerados no import",
      "StockContext: fonte única de verdade para estoque (Single Source of Truth)",
      "localStorage: persiste entre sessões — simula banco de dados",
      "Dashboard: lê DASHBOARD_DATA (estático, pré-agregado) — não usa contexto",
      "Estoque + Movimentação: leem e escrevem no StockContext",
      "Exportar Excel: lê DASHBOARD_DATA e gera .xlsx via biblioteca xlsx",
    ],
    techDetail: "Separação de responsabilidades: dado analítico (Dashboard) vs. dado operacional (Estoque/Movimentação). Analítico é imutável em runtime. Operacional é mutável via Context.",
    speak: "A arquitetura separa dois mundos: dados analíticos — histórico de vendas que nunca muda — e dados operacionais — estoque que muda com cada transferência. Essa é a mesma separação que sistemas reais fazem entre data warehouse e banco transacional.",
  },
  {
    tab: "transferencia",
    title: "Stack e Decisões Técnicas",
    badge: "Visão técnica geral",
    badgeColor: "bg-fuchsia-500/15 border-fuchsia-500/20 text-fuchsia-400",
    icon: Cpu,
    what: "Por que cada tecnologia foi escolhida e o que ela resolve no projeto.",
    how: "React 19 + TypeScript: componentes reutilizáveis com tipagem estática. Vite: build ultrarrápido com HMR (Hot Module Replacement). Tailwind CSS: design system via classes utilitárias, sem CSS customizado. Recharts: gráficos declarativos integrados ao modelo de dados do React. Context API: estado global sem Redux.",
    points: [
      "React: renderização reativa — UI sempre consistente com o estado",
      "TypeScript: interfaces tipadas (Store, Product, SaleRecord) — erros em compile time",
      "Tailwind: dark theme com bg-[#0d1424], border-white/5 — sem CSS file",
      "Recharts: dataKey='revenue' aponta direto para o campo do objeto",
      "useMemo: evita recálculos desnecessários em listas grandes (100 produtos)",
      "useRef: flashTimer evita memory leak ao limpar timeouts de notificação",
    ],
    techDetail: "Por que não Power BI: sem lógica de negócio customizada, sem simulação de transferência, sem controle de UI, dependente de licença Microsoft. React dá controle total.",
    speak: "Cada escolha de tecnologia resolve um problema concreto. TypeScript pegou vários bugs durante o desenvolvimento antes mesmo de rodar o código. O useMemo evita que a tabela de 100 produtos seja reordenada a cada keystroke na busca.",
  },
  {
    tab: "dashboard",
    title: "Reset e Export — Funcionalidades de Suporte",
    badge: "Sistema · Utilitários",
    badgeColor: "bg-gray-500/15 border-gray-500/20 text-gray-400",
    icon: RefreshCw,
    what: "Exportar Excel: gera um .xlsx real com os dados do Dashboard. Resetar Estoque: volta o inventário ao estado inicial do mockData, limpando o localStorage.",
    how: "Export: excelExport.ts usa a biblioteca xlsx para criar um workbook com múltiplas planilhas (mensal, por loja, por produto). Packer.toBuffer() envia o binário via file-saver. Reset: resetStock() do StockContext chama buildInitialStock() que reconstrói o estado a partir do mockData e sobrescreve o localStorage.",
    points: [
      "Exportar Excel: botão na sidebar (desktop) e no header (mobile)",
      "Gera arquivo com nome mercadinho_export.xlsx",
      "Múltiplas abas: Mensal, Por Loja, Por Produto, Por Estado",
      "Resetar Estoque: botão na tela de Movimentação",
      "Reset também limpa o array history da sessão",
      "Confirma com flash verde: 'Estoque resetado para os valores originais'",
    ],
    techDetail: "O export é 100% client-side: nenhum byte vai para um servidor. A biblioteca xlsx serializa objetos JavaScript diretamente em formato OOXML binário no navegador.",
    speak: "O botão de exportar é importante para mostrar compatibilidade com o mercado — o resultado final pode abrir no Excel ou importar no Power BI. Tudo gerado no navegador, sem servidor.",
  },
];

// Agrupa steps por tab para navegação contextual
const STEP_GROUPS: Record<Tab, number[]> = {
  dashboard: STEPS.reduce<number[]>((acc, s, i) => s.tab === "dashboard" ? [...acc, i] : acc, []),
  estoque: STEPS.reduce<number[]>((acc, s, i) => s.tab === "estoque" ? [...acc, i] : acc, []),
  transferencia: STEPS.reduce<number[]>((acc, s, i) => s.tab === "transferencia" ? [...acc, i] : acc, []),
};

const TAB_LABELS: Record<Tab, string> = {
  dashboard: "Dashboard",
  estoque: "Estoque",
  transferencia: "Movimentação",
};

const TAB_ICONS: Record<Tab, React.ElementType> = {
  dashboard: LayoutDashboard,
  estoque: Package,
  transferencia: Truck,
};

export default function PresentationModal({ currentTab }: Props) {
  const [open, setOpen]         = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const overlayRef              = useRef<HTMLDivElement>(null);

  const step = STEPS[stepIndex];

  // Quando a aba muda, pula pro primeiro step dessa aba
  useEffect(() => {
    if (!open) return;
    const firstInTab = STEPS.findIndex((s) => s.tab === currentTab);
    if (firstInTab !== -1) setStepIndex(firstInTab);
  }, [currentTab]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      setOpen(false);
      if (e.key === "ArrowRight")  next();
      if (e.key === "ArrowLeft")   prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, stepIndex]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const next = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const prev = () => setStepIndex((i) => Math.max(i - 1, 0));

  const TabIcon = TAB_ICONS[step.tab];
  const StepIcon = step.icon;

  return (
    <>
      {/* ── Botão flutuante ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir guia de apresentação"
        className="fixed bottom-5 right-40 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full
                   bg-fuchsia-600 hover:bg-fuchsia-500 active:scale-95 text-white text-sm font-medium
                   shadow-lg shadow-fuchsia-900/40 transition-all duration-150"
      >
        <Presentation size={17} />
        <span className="hidden sm:inline">Apresentação</span>
      </button>

      {/* ── Modal ── */}
      {open && (
        <div
          ref={overlayRef}
          onClick={(e) => { if (e.target === overlayRef.current) setOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-[2px]"
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-2xl bg-[#0d1424] border border-white/10 rounded-2xl
                       shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-fuchsia-500/15 border border-fuchsia-500/20
                                flex items-center justify-center shrink-0">
                  <Presentation size={14} className="text-fuchsia-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">Guia de Apresentação</p>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    {stepIndex + 1} de {STEPS.length} · use ← → para navegar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center
                           text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={15} />
              </button>
            </div>

            {/* ── Índice de tabs ── */}
            <div className="flex gap-1 px-4 pt-2.5 pb-0 shrink-0 overflow-x-auto scrollbar-hide">
              {(["dashboard", "estoque", "transferencia"] as Tab[]).map((t) => {
                const Icon = TAB_ICONS[t];
                const isActive = step.tab === t;
                const stepsInTab = STEP_GROUPS[t].length;
                const currentInTab = step.tab === t
                  ? STEP_GROUPS[t].indexOf(stepIndex) + 1
                  : 0;
                return (
                  <button
                    key={t}
                    onClick={() => {
                      const first = STEPS.findIndex((s) => s.tab === t);
                      if (first !== -1) setStepIndex(first);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                whitespace-nowrap transition-all border ${
                      isActive
                        ? t === "dashboard"    ? "bg-sky-500/15 text-sky-400 border-sky-500/20"
                        : t === "estoque"      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/15 text-amber-400 border-amber-500/20"
                        : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    <Icon size={12} />
                    {TAB_LABELS[t]}
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/10" : "bg-white/5 text-gray-600"
                    }`}>
                      {isActive ? `${currentInTab}/${stepsInTab}` : stepsInTab}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── Barra de progresso ── */}
            <div className="px-5 pt-3 pb-0 shrink-0">
              <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-fuchsia-500 rounded-full transition-all duration-300"
                  style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* ── Conteúdo do step ── */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {/* Título + badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <StepIcon size={16} className="text-gray-300" />
                  </div>
                  <h2 className="text-base font-semibold text-white leading-tight">{step.title}</h2>
                </div>
                <span className={`shrink-0 text-[10px] font-medium px-2 py-1 rounded-full border ${step.badgeColor}`}>
                  {step.badge}
                </span>
              </div>

              {/* O QUE É */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mb-2">O que é</p>
                <p className="text-sm text-gray-300 leading-relaxed">{step.what}</p>
              </div>

              {/* COMO FUNCIONA */}
              <div className="bg-sky-500/[0.04] border border-sky-500/10 rounded-xl p-4">
                <p className="text-[10px] text-sky-600 uppercase tracking-widest font-medium mb-2">Como funciona tecnicamente</p>
                <p className="text-sm text-gray-300 leading-relaxed">{step.how}</p>
              </div>

              {/* O QUE APONTAR NA TELA */}
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mb-2">O que apontar na tela</p>
                <div className="space-y-1.5">
                  {step.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/20
                                       text-fuchsia-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-gray-400 leading-relaxed">{pt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* DETALHE TÉCNICO */}
              <div className="flex items-start gap-2.5 bg-amber-500/[0.04] border border-amber-500/10 rounded-xl px-3.5 py-3">
                <span className="text-amber-500 mt-0.5 shrink-0 text-xs font-bold">⚙</span>
                <div>
                  <p className="text-[10px] text-amber-600 uppercase tracking-widest font-medium mb-1">Detalhe técnico</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.techDetail}</p>
                </div>
              </div>

              {/* FALA SUGERIDA */}
              <div className="border-l-2 border-fuchsia-500/40 pl-3.5">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mb-1.5">Fala sugerida</p>
                <p className="text-sm text-gray-300 leading-relaxed italic">{step.speak}</p>
              </div>
            </div>

            {/* ── Navegação ── */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/5 shrink-0">
              <button
                onClick={prev}
                disabled={stepIndex === 0}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  stepIndex === 0
                    ? "text-gray-700 cursor-not-allowed"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-white/10"
                }`}
              >
                <ChevronLeft size={14} /> Anterior
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1">
                {STEPS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setStepIndex(i)}
                    className={`rounded-full transition-all ${
                      i === stepIndex
                        ? "w-4 h-1.5 bg-fuchsia-500"
                        : s.tab === step.tab
                        ? "w-1.5 h-1.5 bg-gray-600 hover:bg-gray-400"
                        : "w-1.5 h-1.5 bg-gray-800 hover:bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                disabled={stepIndex === STEPS.length - 1}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  stepIndex === STEPS.length - 1
                    ? "text-gray-700 cursor-not-allowed"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-white/10"
                }`}
              >
                Próximo <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
