"use client";
import { FiltrosGaleria } from "@/app/types/animal";
import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FiltroGaleriaProps {
  filtros: FiltrosGaleria;
  onAplicar: (filtros: FiltrosGaleria) => void;
}

const campo =
  "w-full min-w-0 px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400";
const rotulo = "text-[10px] font-black uppercase tracking-widest text-slate-400";

export default function FiltroGaleria({
  filtros,
  onAplicar,
}: FiltroGaleriaProps) {
  const [aberto, setAberto] = useState(false);
  const [rascunho, setRascunho] = useState(filtros);
  const containerRef = useRef<HTMLDivElement>(null);

  const ativo =
    filtros.nome !== "" || filtros.especie !== "" || filtros.direcao !== "desc";

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

  const buscar = () => {
    onAplicar({ ...rascunho, nome: rascunho.nome.trim() });
    setAberto(false);
  };

  const limpar = () => {
    const vazio: FiltrosGaleria = { nome: "", especie: "", direcao: "desc" };
    setRascunho(vazio);
    onAplicar(vazio);
    setAberto(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={alternar}
        title="Filtrar pets"
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${
          ativo
            ? "text-teal-600 bg-teal-50 border-teal-200"
            : "text-slate-500 bg-white border-stone-200 hover:text-teal-600 hover:bg-teal-50"
        }`}
      >
        <Filter size={16} strokeWidth={2.5} />
        Filtrar
      </button>

      {aberto && (
        <div className="absolute right-0 top-full mt-2 z-40 w-72 max-w-[calc(100vw-3rem)] p-4 bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/60 space-y-3">
          <div className="space-y-2">
            <p className={rotulo}>Ordenar</p>
            <select
              value={rascunho.direcao}
              onChange={(e) =>
                setRascunho((r) => ({
                  ...r,
                  direcao: e.target.value as "asc" | "desc",
                }))
              }
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
              onChange={(e) =>
                setRascunho((r) => ({ ...r, nome: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="Buscar pelo nome do pet"
              className={campo}
            />
          </div>

          <div className="space-y-2">
            <p className={rotulo}>Espécie</p>
            <select
              value={rascunho.especie}
              onChange={(e) =>
                setRascunho((r) => ({ ...r, especie: e.target.value }))
              }
              className={campo}
            >
              <option value="">Todas</option>
              <option value="CACHORRO">Cachorro</option>
              <option value="GATO">Gato</option>
            </select>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={buscar}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-100 transition-all"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={limpar}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
