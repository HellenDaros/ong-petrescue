"use client";
import CampoData from "@/app/components/CampoData";
import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TipoCampo = "texto" | "numero" | "select" | "data";

interface OpcaoFiltro {
  valor: string;
  rotulo: string;
}

interface CampoAdicional {
  rotulo: string;
  tipo: TipoCampo;
  valor: string;
  onFiltrar: (valor: string) => void;
  opcoes?: OpcaoFiltro[] | ((valorPrincipal: string) => OpcaoFiltro[]);
  dependeDoPrincipal?: boolean;
  textoSemPrincipal?: string;
}

interface FiltroColunaProps {
  titulo: string;
  tipo: TipoCampo;
  valor: string;
  onFiltrar: (valor: string) => void;
  rotuloPesquisa?: string;
  opcoes?: OpcaoFiltro[];
  adicionais?: CampoAdicional[];
  ordenavel?: boolean;
  ordenacaoAtiva?: "asc" | "desc" | null;
  onOrdenar?: (direcao: "asc" | "desc") => void;
  textoCrescente?: string;
  textoDecrescente?: string;
}

const classeCampo =
  "w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400";
const classeRotulo =
  "text-[10px] font-black uppercase tracking-widest text-slate-400";

const LARGURA_POPOVER = 224;

export default function FiltroColuna({
  titulo,
  tipo,
  valor,
  onFiltrar,
  rotuloPesquisa = "Pesquisar",
  opcoes = [],
  adicionais = [],
  ordenavel = false,
  ordenacaoAtiva = null,
  onOrdenar,
  textoCrescente = "Crescente",
  textoDecrescente = "Decrescente",
}: FiltroColunaProps) {
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState(valor);
  const [rascunhoAdicionais, setRascunhoAdicionais] = useState<string[]>(
    adicionais.map((a) => a.valor),
  );
  const [posicao, setPosicao] = useState({ top: 0, left: 0 });
  const botaoRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const ativo =
    valor !== "" ||
    adicionais.some((a) => a.valor !== "") ||
    ordenacaoAtiva !== null;

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
    adicionais.forEach((a, i) =>
      a.onFiltrar((rascunhoAdicionais[i] ?? "").trim()),
    );
    setAberto(false);
  };

  const limpar = () => {
    setRascunho("");
    setRascunhoAdicionais(adicionais.map(() => ""));
    onFiltrar("");
    adicionais.forEach((a) => a.onFiltrar(""));
    setAberto(false);
  };

  const alterarAdicional = (indice: number, novo: string) =>
    setRascunhoAdicionais((r) => r.map((v, i) => (i === indice ? novo : v)));

  const alterarPrincipal = (novo: string) => {
    setRascunho(novo);
    setRascunhoAdicionais((r) =>
      r.map((v, i) => (adicionais[i]?.dependeDoPrincipal ? "" : v)),
    );
  };

  const renderCampo = (
    campo: {
      rotulo: string;
      tipo: TipoCampo;
      opcoes?: OpcaoFiltro[];
      desabilitado?: boolean;
      textoVazio?: string;
    },
    valorCampo: string,
    alterar: (novo: string) => void,
    limites: { min?: string; max?: string } = {},
    focar = false,
  ) => {
    if (campo.tipo === "select") {
      return (
        <select
          value={valorCampo}
          onChange={(e) => alterar(e.target.value)}
          disabled={campo.desabilitado}
          className={`${classeCampo} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-50`}
        >
          <option value="">
            {campo.desabilitado ? (campo.textoVazio ?? "Todos") : "Todos"}
          </option>
          {(campo.opcoes ?? []).map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.rotulo}
            </option>
          ))}
        </select>
      );
    }

    if (campo.tipo === "data") {
      return (
        <CampoData
          value={valorCampo}
          onChange={alterar}
          min={limites.min}
          max={limites.max}
          className={classeCampo}
        />
      );
    }

    return (
      <input
        autoFocus={focar}
        type={campo.tipo === "numero" ? "number" : "text"}
        min={campo.tipo === "numero" ? 1 : undefined}
        value={valorCampo}
        onChange={(e) => alterar(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && buscar()}
        placeholder={`Buscar por ${campo.rotulo.toLowerCase()}`}
        className={classeCampo}
      />
    );
  };

  const alternar = () => {
    if (!aberto && botaoRef.current) {
      setRascunho(valor);
      setRascunhoAdicionais(adicionais.map((a) => a.valor));
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
            <p className={classeRotulo}>{rotuloPesquisa}</p>
            {renderCampo(
              {
                rotulo:
                  rotuloPesquisa === "Pesquisar" ? titulo : rotuloPesquisa,
                tipo,
                opcoes,
              },
              rascunho,
              alterarPrincipal,
              {
                max:
                  tipo === "data" && adicionais[0]?.tipo === "data"
                    ? rascunhoAdicionais[0]
                    : undefined,
              },
              true,
            )}
          </div>

          {adicionais.map((adicional, i) => (
            <div key={adicional.rotulo} className="space-y-2">
              <p className={classeRotulo}>{adicional.rotulo}</p>
              {renderCampo(
                {
                  ...adicional,
                  opcoes:
                    typeof adicional.opcoes === "function"
                      ? adicional.opcoes(rascunho)
                      : adicional.opcoes,
                  desabilitado:
                    !!adicional.dependeDoPrincipal && rascunho === "",
                  textoVazio: adicional.textoSemPrincipal,
                },
                rascunhoAdicionais[i] ?? "",
                (novo) => alterarAdicional(i, novo),
                { min: i === 0 && tipo === "data" ? rascunho : undefined },
              )}
            </div>
          ))}

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
