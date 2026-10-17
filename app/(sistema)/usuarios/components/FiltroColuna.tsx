"use client";
import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FiltroColunaProps {
  titulo: string;
  tipo: "texto" | "numero" | "select";
  valor: string;
  onFiltrar: (valor: string) => void;
  opcoes?: { valor: string; rotulo: string }[];
  ordenavel?: boolean;
  ordenacaoAtiva?: "asc" | "desc" | null;
  onOrdenar?: (direcao: "asc" | "desc") => void;
  textoCrescente?: string;
  textoDecrescente?: string;
}

const LARGURA_POPOVER = 224;

export default function FiltroColuna({
  titulo,
  tipo,
  valor,
  onFiltrar,
  opcoes = [],
  ordenavel = false,
  ordenacaoAtiva = null,
  onOrdenar,
  textoCrescente = "Crescente",
  textoDecrescente = "Decrescente",
}: FiltroColunaProps) {
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState(valor);
  const [posicao, setPosicao] = useState({ top: 0, left: 0 });
  const botaoRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const ativo = valor !== "" || ordenacaoAtiva !== null;

  useEffect(() => {
    if (!aberto) return;

    const fechar = () => setAberto(false);
    const aoClicarFora = (e: MouseEvent) => {
      const alvo = e.target as Node;
      if (
        !popoverRef.current?.contains(alvo) &&
        !botaoRef.current?.contains(alvo)
      ) {
        fechar();
      }
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoTeclar);
    window.addEventListener("scroll", fechar, true);
    window.addEventListener("resize", fechar);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoTeclar);
      window.removeEventListener("scroll", fechar, true);
      window.removeEventListener("resize", fechar);
    };
  }, [aberto]);

  const buscar = () => {
    onFiltrar(rascunho.trim());
    setAberto(false);
  };

  const limpar = () => {
    setRascunho("");
    onFiltrar("");
    setAberto(false);
  };

  const alternar = () => {
    if (!aberto && botaoRef.current) {
      setRascunho(valor);
      const rect = botaoRef.current.getBoundingClientRect();
      const left = Math.min(
        rect.left,
        window.innerWidth - LARGURA_POPOVER - 16,
      );
      setPosicao({ top: rect.bottom + 8, left: Math.max(16, left) });
    }
    setAberto((a) => !a);
  };

  const classeOrdenar = (direcao: "asc" | "desc") =>
    `w-full px-3 py-2 rounded-xl border text-xs font-medium text-left normal-case tracking-normal transition-all ${
      ordenacaoAtiva === direcao
        ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-100"
        : "bg-white border-stone-200 text-slate-500 hover:bg-teal-50 hover:text-teal-600"
    }`;

  return (
    <div className="flex items-center gap-1.5">
      <span>{titulo}</span>
      <button
        ref={botaoRef}
        type="button"
        onClick={alternar}
        title={`Filtrar ${titulo}`}
        className={`relative p-1 rounded-lg transition-all ${
          ativo
            ? "text-teal-600 bg-teal-50"
            : "text-slate-300 hover:text-teal-600 hover:bg-teal-50"
        }`}
      >
        <Filter className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>

      {aberto && (
        <div
          ref={popoverRef}
          style={{
            top: posicao.top,
            left: posicao.left,
            width: LARGURA_POPOVER,
          }}
          className="fixed z-50 p-4 bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/60 space-y-3 normal-case tracking-normal"
        >
          {ordenavel && onOrdenar && (
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Ordenar
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onOrdenar("asc")}
                  className={classeOrdenar("asc")}
                >
                  ▲ {textoCrescente}
                </button>
                <button
                  type="button"
                  onClick={() => onOrdenar("desc")}
                  className={classeOrdenar("desc")}
                >
                  ▼ {textoDecrescente}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Pesquisar
            </p>
            {tipo === "select" ? (
              <select
                value={rascunho}
                onChange={(e) => setRascunho(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
              >
                <option value="">Todos</option>
                {opcoes.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </select>
            ) : (
              <input
                autoFocus
                type={tipo === "numero" ? "number" : "text"}
                min={tipo === "numero" ? 1 : undefined}
                value={rascunho}
                onChange={(e) => setRascunho(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscar()}
                placeholder={`Buscar por ${titulo.toLowerCase()}`}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={buscar}
              className="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-100 transition-all"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={limpar}
              className="flex-1 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
