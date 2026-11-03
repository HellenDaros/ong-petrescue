"use client";
import { useEffect, useRef, useState } from "react";
import { Vacina, VacinaSelectProps } from "@/app/types/vacina";
import {
  atualizarVacina,
  cadastrarVacina,
  listarVacinas,
} from "@/app/services/vacinaService";

const SEPARADOR = ", ";

const parseSelecionadas = (value: string): string[] =>
  value
    .split(",")
    .map((nome) => nome.trim())
    .filter(Boolean);

const ordenarPorNome = (lista: Vacina[]) =>
  [...lista].sort((a, b) => a.nome.localeCompare(b.nome));

export default function VacinaSelect({ value, onChange }: VacinaSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nomeEditado, setNomeEditado] = useState("");
  const [salvando, setSalvando] = useState(false);

  const selecionadas = parseSelecionadas(value);
  const termo = busca.trim();

  const carregarVacinas = async () => {
    try {
      setVacinas(await listarVacinas());
    } catch (error) {
      console.error("Erro ao carregar vacinas:", error);
    }
  };

  useEffect(() => {
    carregarVacinas();
  }, []);

  useEffect(() => {
    const fecharAoClicarFora = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("mousedown", fecharAoClicarFora);
    return () => document.removeEventListener("mousedown", fecharAoClicarFora);
  }, []);

  const atualizarSelecao = (nomes: string[]) => onChange(nomes.join(SEPARADOR));

  const estaSelecionada = (nome: string) =>
    selecionadas.some((s) => s.toLowerCase() === nome.toLowerCase());

  const alternar = (nome: string) => {
    atualizarSelecao(
      estaSelecionada(nome)
        ? selecionadas.filter((s) => s.toLowerCase() !== nome.toLowerCase())
        : [...selecionadas, nome],
    );
  };

  const filtradas = vacinas.filter((v) =>
    v.nome.toLowerCase().includes(termo.toLowerCase()),
  );
  const existeIgual = vacinas.some(
    (v) => v.nome.toLowerCase() === termo.toLowerCase(),
  );

  const handleCadastrar = async () => {
    if (!termo || salvando) return;
    setSalvando(true);
    try {
      const nova = await cadastrarVacina({ nome: termo });
      setVacinas((prev) => ordenarPorNome([...prev, nova]));
      if (!estaSelecionada(nova.nome)) {
        atualizarSelecao([...selecionadas, nova.nome]);
      }
      setBusca("");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erro ao cadastrar vacina.",
      );
    } finally {
      setSalvando(false);
    }
  };

  const iniciarEdicao = (vacina: Vacina) => {
    setEditandoId(vacina.id);
    setNomeEditado(vacina.nome);
  };

  const handleSalvarEdicao = async (vacina: Vacina) => {
    const novoNome = nomeEditado.trim();
    if (!novoNome || salvando) return;
    if (novoNome === vacina.nome) {
      setEditandoId(null);
      return;
    }
    setSalvando(true);
    try {
      const atualizada = await atualizarVacina(vacina.id, { nome: novoNome });
      setVacinas((prev) =>
        ordenarPorNome(prev.map((v) => (v.id === atualizada.id ? atualizada : v))),
      );
      atualizarSelecao(
        selecionadas.map((s) =>
          s.toLowerCase() === vacina.nome.toLowerCase() ? atualizada.nome : s,
        ),
      );
      setEditandoId(null);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erro ao atualizar vacina.",
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {selecionadas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selecionadas.map((nome) => (
            <span
              key={nome}
              className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full"
            >
              {nome}
              <button
                type="button"
                onClick={() => alternar(nome)}
                aria-label={`Remover ${nome}`}
                className="hover:text-teal-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setAberto(true);
        }}
        onFocus={() => setAberto(true)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          if (termo && !existeIgual) handleCadastrar();
        }}
        placeholder="Busque ou digite para cadastrar. Ex: V10, Raiva..."
        className="w-full bg-teal-50/30 border border-teal-100 focus:border-teal-500 focus:bg-white outline-none px-4 py-2.5 text-sm rounded-xl text-slate-700 font-bold transition-all placeholder:text-teal-200"
      />

      {aberto && (
        <ul className="max-h-56 overflow-y-auto bg-white border border-stone-200 rounded-xl py-1">
          {filtradas.map((vacina) => (
            <li
              key={vacina.id}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-stone-50"
            >
              {editandoId === vacina.id ? (
                <>
                  <input
                    type="text"
                    autoFocus
                    value={nomeEditado}
                    onChange={(e) => setNomeEditado(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSalvarEdicao(vacina);
                      }
                      if (e.key === "Escape") setEditandoId(null);
                    }}
                    className="flex-1 bg-stone-50 border border-stone-200 focus:border-teal-500 outline-none px-2 py-1 text-sm rounded-lg text-slate-700 font-bold"
                  />
                  <button
                    type="button"
                    disabled={salvando}
                    onClick={() => handleSalvarEdicao(vacina)}
                    className="text-xs font-black text-[#008080] hover:text-teal-700 disabled:opacity-60"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditandoId(null)}
                    className="text-xs font-black text-slate-400 hover:text-slate-600"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => alternar(vacina.nome)}
                    className="flex-1 flex items-center gap-2 text-left text-sm font-bold text-slate-700"
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={estaSelecionada(vacina.nome)}
                      className="accent-[#008080] pointer-events-none"
                    />
                    {vacina.nome}
                  </button>
                  <button
                    type="button"
                    onClick={() => iniciarEdicao(vacina)}
                    className="text-xs font-black text-slate-400 hover:text-[#008080]"
                  >
                    Editar
                  </button>
                </>
              )}
            </li>
          ))}

          {termo && !existeIgual && (
            <li>
              <button
                type="button"
                disabled={salvando}
                onClick={handleCadastrar}
                className="w-full text-left px-3 py-2 text-sm font-black text-[#008080] hover:bg-teal-50 disabled:opacity-60"
              >
                + Cadastrar &quot;{termo}&quot;
              </button>
            </li>
          )}

          {filtradas.length === 0 && !termo && (
            <li className="px-3 py-2 text-sm text-stone-400">
              Nenhuma vacina cadastrada. Digite para cadastrar.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
