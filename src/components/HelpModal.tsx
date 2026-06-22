import { useState, useEffect, useRef } from "react";
import {
  HelpCircle,
  X,
  Database,
  Layers,
  Radio,
  FileSpreadsheet,
  BarChart3,
} from "lucide-react";

type SectionId = "stack" | "kpi" | "arch" | "excel";

const SECTIONS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "stack", label: "Tecnologias",          icon: Layers        },
  { id: "kpi",   label: "O que é um KPI",        icon: BarChart3     },
  { id: "arch",  label: "Tempo Real",             icon: Radio         },
  { id: "excel", label: "Por que não Power BI",   icon: FileSpreadsheet },
];

const STACK_ITEMS = [
  { icon: "⚛️",  name: "React 19 + TypeScript", desc: "Componentes reutilizáveis com tipagem estática — evita erros de tipo em tempo de desenvolvimento." },
  { icon: "⚡",  name: "Vite",                   desc: "Ferramenta de build com Hot Reload instantâneo — salva o arquivo, a tela já atualiza." },
  { icon: "🎨",  name: "Tailwind CSS",            desc: "Estilização via classes utilitárias direto no JSX, sem arquivos CSS separados." },
  { icon: "📊",  name: "Recharts",                desc: "Biblioteca de gráficos (área, barra, pizza) usada no Dashboard." },
  { icon: "🔗",  name: "Context API",             desc: "Estado global do estoque compartilhado entre todas as telas em tempo real." },
  { icon: "📥",  name: "xlsx + file-saver",       desc: "Gera e baixa arquivos .xlsx direto no navegador, sem precisar de back-end." },
];

export default function HelpModal() {
  const [open, setOpen]       = useState(false);
  const [section, setSection] = useState<SectionId>("stack");
  const overlayRef            = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir ajuda técnica"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full
                   bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-sm font-medium
                   shadow-lg shadow-sky-900/40 transition-all duration-150"
      >
        <HelpCircle size={17} />
        <span className="hidden sm:inline">Ajuda Técnica</span>
      </button>

      {open && (
        <div
          ref={overlayRef}
          onClick={(e) => { if (e.target === overlayRef.current) setOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6
                     bg-black/65 backdrop-blur-[2px]"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Documentação técnica"
            className="relative w-full max-w-2xl bg-[#0d1424] border border-white/10
                       rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/20
                                flex items-center justify-center shrink-0">
                  <Database size={15} className="text-sky-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">Documentação técnica</p>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Mercadinho do Bruno e Tiago · 2026</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center
                           text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/5
                           transition-all duration-150"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex gap-1 px-4 pt-3 pb-0 overflow-x-auto shrink-0 scrollbar-hide">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                              whitespace-nowrap transition-all duration-150 ${
                    section === s.id
                      ? "bg-sky-500/15 text-sky-400 border border-sky-500/20"
                      : "text-gray-500 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <s.icon size={13} />
                  {s.label}
                </button>
              ))}
            </div>

            <div className="mx-4 mt-3 border-t border-white/5 shrink-0" />

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-sm text-gray-300 leading-relaxed">
              {section === "stack" && (
                <>
                  <p className="text-gray-400">
                    Tudo roda <span className="text-white font-medium">100% no navegador</span> — sem banco de dados nem servidor próprio.
                    Os dados são simulados e o que é "salvo" fica no localStorage.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {STACK_ITEMS.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-start gap-3 bg-white/[0.03] border border-white/5
                                   rounded-xl px-3.5 py-3 hover:bg-white/[0.05] transition-colors"
                      >
                        <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">{item.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-white">{item.name}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {section === "kpi" && (
                <>
                  <p>
                    <span className="text-sky-400 font-medium">KPI</span> significa{" "}
                    <em>Key Performance Indicator</em> (Indicador-chave de Desempenho) — um número
                    resumido que mostra rapidamente como está indo algo importante do negócio, sem
                    precisar abrir uma planilha enorme.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { label: "Nº de Clientes",    desc: "Quantas pessoas compraram no período", color: "text-sky-400",     bg: "bg-sky-500/10 border-sky-500/20" },
                      { label: "Unidades Vendidas",  desc: "Quantos produtos saíram das lojas",    color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                      { label: "Receita Total",      desc: "Total de dinheiro recebido no período", color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20" },
                      { label: "Qtd de Vendas",      desc: "Número total de transações realizadas", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10 border-fuchsia-500/20" },
                    ].map((k) => (
                      <div key={k.label} className={`border rounded-xl px-3.5 py-3 ${k.bg}`}>
                        <p className={`text-xs font-semibold ${k.color}`}>{k.label}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{k.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs border-t border-white/5 pt-3">
                    A seta <span className="text-emerald-400">▲</span> /
                    <span className="text-orange-400"> ▼</span> ao lado de alguns KPIs é a{" "}
                    <span className="text-white">tendência</span>: compara o último mês com o anterior
                    para saber se está crescendo ou caindo.
                  </p>
                </>
              )}

              {section === "arch" && (
                <>
                  <p>
                    Estoque e Movimentação compartilham os mesmos dados através do{" "}
                    <span className="text-sky-400 font-medium">StockContext</span> — um "armazém
                    central" que fica acima de todas as telas no React.
                  </p>
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-3">
                    {[
                      { step: "1", label: "Antes", desc: "Cada tela tinha sua própria cópia dos dados na memória. Transferir num lugar não refletia no outro." },
                      { step: "2", label: "Solução", desc: "Context API centraliza o estado. Todas as telas leem e escrevem no mesmo lugar. Mudou em um → atualiza em todos." },
                      { step: "3", label: "Bônus", desc: "O estado é salvo no localStorage a cada alteração. F5 na página e o estoque ainda lembra do que foi movimentado." },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-sky-500/15 border border-sky-500/20
                                         text-sky-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {item.step}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-white">{item.label}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-600 border-t border-white/5 pt-3">
                    Dashboard mostra <em>vendas históricas</em> (dado fechado, analítico) —
                    Estoque/Movimentação mostram <em>estoque atual</em> (dado vivo, operacional).
                    São duas naturezas de dado diferentes.
                  </p>
                </>
              )}

              {section === "excel" && (
                <>
                  <p>
                    O trabalho sugeria usar Excel ou Power BI. Optamos por construir do zero em React
                    porque isso permite muito mais do que ferramentas no-code.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                      <p className="text-xs font-semibold text-gray-400 mb-2">Power BI / Excel</p>
                      <ul className="space-y-1.5 text-[11px] text-gray-500">
                        <li>✓ Análise de dados rápida</li>
                        <li>✓ Sem necessidade de código</li>
                        <li className="text-red-400/80">✗ UI limitada, sem customização</li>
                        <li className="text-red-400/80">✗ Sem lógica de negócio complexa</li>
                        <li className="text-red-400/80">✗ Depende de licença Microsoft</li>
                      </ul>
                    </div>
                    <div className="bg-sky-500/5 border border-sky-500/15 rounded-xl p-3.5">
                      <p className="text-xs font-semibold text-sky-400 mb-2">React (nossa escolha)</p>
                      <ul className="space-y-1.5 text-[11px] text-gray-400">
                        <li className="text-emerald-400/80">✓ Controle total do design e UX</li>
                        <li className="text-emerald-400/80">✓ Simulação de transferência real</li>
                        <li className="text-emerald-400/80">✓ Estado global, validações, alertas</li>
                        <li className="text-emerald-400/80">✓ Deploy em qualquer lugar</li>
                        <li>✓ Compatível — exporta para .xlsx</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 border-t border-white/5 pt-3">
                    O botão{" "}
                    <span className="text-emerald-400 font-medium">Exportar Excel</span> gera um
                    .xlsx real via biblioteca <code className="text-sky-400">xlsx</code> — o resultado
                    final ainda é compatível com Power BI, só que a análise foi construída como
                    produto de software.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
