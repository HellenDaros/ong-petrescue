"use client";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface CampoDataProps {
  value: string; // YYYY-MM-DD
  onChange: (valor: string) => void;
  min?: string;
  max?: string;
  required?: boolean;
  className?: string;
  alinhar?: "esquerda" | "direita";
  expandirNoMobile?: boolean; // no celular, o calendário ocupa a largura do painel que contém o campo
}

const MARGEM = 8;

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

const doisDigitos = (n: number) => String(n).padStart(2, "0");
const paraISO = (ano: number, mes: number, dia: number) =>
  `${ano}-${doisDigitos(mes + 1)}-${doisDigitos(dia)}`;

function separar(
  iso: string,
): { ano: number; mes: number; dia: number } | null {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return ano && mes && dia ? { ano, mes: mes - 1, dia } : null;
}

function hojeISO() {
  const hoje = new Date();
  return paraISO(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
}

export default function CampoData({
  value,
  onChange,
  min,
  max,
  required,
  className = "",
  alinhar = "esquerda",
  expandirNoMobile = false,
}: CampoDataProps) {
  const [aberto, setAberto] = useState(false);
  const [visivel, setVisivel] = useState(() => {
    const base = separar(value) ?? separar(hojeISO())!;
    return { ano: base.ano, mes: base.mes };
  });
  const [deslocamento, setDeslocamento] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    const fechar = () => setAberto(false);
    const aoClicarFora = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) fechar();
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  useLayoutEffect(() => {
    if (!aberto || !popoverRef.current || !containerRef.current) return;

    const escala =
      containerRef.current.getBoundingClientRect().width /
        containerRef.current.offsetWidth || 1;
    const rect = popoverRef.current.getBoundingClientRect();
    const fundoNatural = rect.bottom + deslocamento * escala;
    const excesso = fundoNatural - (window.innerHeight - MARGEM);
    const novo = excesso > 0 ? excesso / escala : 0;

    if (Math.abs(novo - deslocamento) > 0.5) setDeslocamento(novo);
  }, [aberto, visivel, deslocamento]);

  const alternar = () => {
    if (!aberto) setDeslocamento(0);
    if (!aberto) {
      const base = separar(value) ?? separar(hojeISO())!;
      setVisivel({ ano: base.ano, mes: base.mes });
    }
    setAberto((a) => !a);
  };

  const mudarMes = (delta: number) => {
    setVisivel(({ ano, mes }) => {
      const data = new Date(ano, mes + delta, 1);
      return { ano: data.getFullYear(), mes: data.getMonth() };
    });
  };

  const selecionar = (iso: string) => {
    onChange(iso);
    setAberto(false);
  };

  const bloqueado = (iso: string) =>
    (min !== undefined && min !== "" && iso < min) ||
    (max !== undefined && max !== "" && iso > max);

  const partes = separar(value);
  const textoValor = partes
    ? `${doisDigitos(partes.dia)}/${doisDigitos(partes.mes + 1)}/${partes.ano}`
    : "";

  const primeiroDiaSemana = new Date(visivel.ano, visivel.mes, 1).getDay();
  const diasNoMes = new Date(visivel.ano, visivel.mes + 1, 0).getDate();
  const celulas: (number | null)[] = [
    ...Array<null>(primeiroDiaSemana).fill(null),
    ...Array.from({ length: diasNoMes }, (_, i) => i + 1),
  ];
  const hoje = hojeISO();

  return (
    <div
      ref={containerRef}
      className={`${expandirNoMobile ? "sm:relative" : "relative"} min-w-0`}
    >
      <button
        type="button"
        onClick={alternar}
        className={`${className} flex items-center justify-between gap-2 text-left`}
      >
        <span className={textoValor ? "" : "text-slate-400"}>
          {textoValor || "dd/mm/aaaa"}
        </span>
        <Calendar className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
      </button>

      {required && (
        <input
          tabIndex={-1}
          aria-hidden
          required
          value={value}
          onChange={() => {}}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        />
      )}

      {aberto && (
        <div
          ref={popoverRef}
          style={{ transform: `translateY(-${deslocamento}px)` }}
          className={`absolute mt-1 z-50 p-3 bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/60 ${
            expandirNoMobile
              ? `left-3 right-3 sm:top-full sm:w-64 ${
                  alinhar === "direita"
                    ? "sm:left-auto sm:right-0"
                    : "sm:left-0 sm:right-auto"
                }`
              : `top-full w-[19rem] sm:w-64 ${
                  alinhar === "direita" ? "right-0" : "left-0"
                }`
          }`}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-2">
            <button
              type="button"
              onClick={() => mudarMes(-1)}
              className="p-3 sm:p-1.5 rounded-lg text-slate-500 hover:bg-stone-100"
              title="Mês anterior"
            >
              <ChevronLeft className="w-6 h-6 sm:w-4 sm:h-4" />
            </button>
            <span className="text-lg sm:text-xs font-black text-slate-700">
              {MESES[visivel.mes]} de {visivel.ano}
            </span>
            <button
              type="button"
              onClick={() => mudarMes(1)}
              className="p-3 sm:p-1.5 rounded-lg text-slate-500 hover:bg-stone-100"
              title="Próximo mês"
            >
              <ChevronRight className="w-6 h-6 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 text-center">
            {DIAS_SEMANA.map((d, i) => (
              <span
                key={i}
                className="text-sm sm:text-[10px] font-black text-slate-400 py-1.5 sm:py-1"
              >
                {d}
              </span>
            ))}
            {celulas.map((dia, i) => {
              if (dia === null) return <span key={`vazio-${i}`} />;

              const iso = paraISO(visivel.ano, visivel.mes, dia);
              const selecionado = iso === value;
              const desabilitado = bloqueado(iso);

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={desabilitado}
                  onClick={() => selecionar(iso)}
                  className={`h-12 sm:h-8 rounded-lg text-lg sm:text-xs font-bold transition-colors ${
                    selecionado
                      ? "bg-teal-600 text-white"
                      : iso === hoje
                        ? "text-teal-600 bg-teal-50 hover:bg-teal-100"
                        : "text-slate-600 hover:bg-stone-100"
                  } disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
                >
                  {dia}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => selecionar("")}
              className="text-base sm:text-[11px] font-bold text-red-500 hover:bg-red-50 px-4 py-3 sm:px-2 sm:py-1 rounded-lg"
            >
              Limpar
            </button>
            <button
              type="button"
              disabled={bloqueado(hoje)}
              onClick={() => selecionar(hoje)}
              className="text-base sm:text-[11px] font-bold text-teal-600 hover:bg-teal-50 px-4 py-3 sm:px-2 sm:py-1 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
