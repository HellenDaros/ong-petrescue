"use client";
import CampoData from "@/app/components/CampoData";
import { FiltrosEventos } from "@/app/types/evento";
import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FiltroEventosProps {
  filtros: FiltrosEventos;
  cidades: string[];
  onAplicar: (filtros: FiltrosEventos) => void;
}

const campo =
  "w-full min-w-0 px-3 py-3.5 sm:py-2 rounded-xl border border-stone-200 bg-white text-lg sm:text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400";
const rotulo = "text-sm sm:text-[10px] font-black uppercase tracking-widest text-slate-400";

export default function FiltroEventos({
  filtros,
  cidades,
  onAplicar,
}: FiltroEventosProps) {
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState(filtros);
  const containerRef = useRef<HTMLDivElement>(null);

  const ativo =
    filtros.nome !== "" ||
    filtros.cidade !== "" ||
    filtros.status !== "" ||
    filtros.dataInicio !== "" ||
    filtros.dataFim !== "" ||
    filtros.direcao !== "desc";

  useEffect(() => {
    if (!aberto) return;

    const aoClicarFora = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setAberto(false);
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  const alternar = () => {
    if (!aberto) setRascunho(filtros);
    setAberto((a) => !a);
  };

  const alterar = (chave: keyof FiltrosEventos, valor: string) =>
    setRascunho((r) => ({ ...r, [chave]: valor }));

  const buscar = () => {
    onAplicar({ ...rascunho, nome: rascunho.nome.trim() });
    setAberto(false);
  };

  const limpar = () => {
    const vazio: FiltrosEventos = {
      nome: "",
      cidade: "",
      status: "",
      dataInicio: "",
      dataFim: "",
      direcao: "desc",
    };
    setRascunho(vazio);
    onAplicar(vazio);
    setAberto(false);
  };

  return (
    <div ref={containerRef} className="sm:relative">
      <button
        type="button"
        onClick={alternar}
        title="Filtrar eventos"
        className={`p-3 rounded-2xl border transition-all active:scale-95 ${
          ativo
            ? "text-teal-600 bg-teal-50 border-teal-200"
            : "text-slate-400 bg-white border-stone-200 hover:text-teal-600 hover:bg-teal-50"
        }`}
      >
        <Filter size={18} strokeWidth={2.5} />
      </button>

      {aberto && (
        <div className="absolute top-full mt-2 z-50 left-0 right-0 sm:left-auto sm:w-80 p-5 sm:p-4 bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/60 space-y-4 sm:space-y-3">
          <div className="space-y-2">
            <p className={rotulo}>Ordenar</p>
            <select
              value={rascunho.direcao}
              onChange={(e) => alterar("direcao", e.target.value)}
              className={campo}
            >
              <option value="desc">Mais recentes</option>
              <option value="asc">Mais antigos</option>
            </select>
          </div>

          <div className="space-y-2">
            <p className={rotulo}>Nome</p>
            <input
              type="text"
              value={rascunho.nome}
              onChange={(e) => alterar("nome", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="Buscar por nome"
              className={campo}
            />
          </div>

          <div className="space-y-2">
            <p className={rotulo}>Cidade</p>
            <select
              value={rascunho.cidade}
              onChange={(e) => alterar("cidade", e.target.value)}
              className={campo}
            >
              <option value="">Todas</option>
              {cidades.map((cidade) => (
                <option key={cidade} value={cidade}>
                  {cidade}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <p className={rotulo}>Status</p>
            <select
              value={rascunho.status}
              onChange={(e) => alterar("status", e.target.value)}
              className={campo}
            >
              <option value="">Todos</option>
              <option value="AGENDADO">Agendado</option>
              <option value="ENCERRADO">Encerrado</option>
            </select>
          </div>

          <div className="space-y-2">
            <p className={rotulo}>Período do evento</p>
            <div className="grid grid-cols-2 gap-2">
              <label className="min-w-0 space-y-1">
                <span className="text-sm sm:text-[10px] font-bold text-slate-400">De</span>
                <CampoData
                  value={rascunho.dataInicio}
                  max={rascunho.dataFim}
                  onChange={(v) => alterar("dataInicio", v)}
                  className={campo}
                  expandirNoMobile
                />
              </label>
              <label className="min-w-0 space-y-1">
                <span className="text-sm sm:text-[10px] font-bold text-slate-400">Até</span>
                <CampoData
                  value={rascunho.dataFim}
                  min={rascunho.dataInicio}
                  onChange={(v) => alterar("dataFim", v)}
                  className={campo}
                  alinhar="direita"
                  expandirNoMobile
                />
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={buscar}
              className="flex-1 px-3 py-3.5 sm:py-2 rounded-xl text-base sm:text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-100 transition-all"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={limpar}
              className="flex-1 px-3 py-3.5 sm:py-2 rounded-xl text-base sm:text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
