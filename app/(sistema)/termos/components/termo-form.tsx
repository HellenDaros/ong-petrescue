"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TermoFormProps, TermoRequest } from "@/app/types/termo";
import {
  atualizarTermo,
  cadastrarTermo,
  listarTermos,
} from "@/app/services/termoService";

export default function TermoForm({ termoExistente }: TermoFormProps) {
  const router = useRouter();
  const isEdicao = !!termoExistente;

  const [termo, setTermo] = useState<TermoRequest>({
    titulo: termoExistente?.titulo ?? "",
    conteudo: termoExistente?.conteudo ?? "",
    textoPadrao: termoExistente?.textoPadrao ?? false,
  });
  const [salvando, setSalvando] = useState(false);

  const confirmarSubstituicaoTextoPadrao = async (): Promise<boolean> => {
    const termos = await listarTermos();
    const atual = termos.find(
      (t) => t.ativo && t.textoPadrao && t.id !== termoExistente?.id,
    );
    if (!atual) return true;

    return confirm(
      `Sua ONG já tem um texto padrão definido ("${atual.titulo}"). Ele será inativado e substituído por este. Deseja continuar?`,
    );
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const vaiSerAtivo = !termoExistente || termoExistente.ativo;
      if (termo.textoPadrao && vaiSerAtivo) {
        if (!(await confirmarSubstituicaoTextoPadrao())) return;
      }

      if (termoExistente) {
        await atualizarTermo(termoExistente.id, termo);
      } else {
        await cadastrarTermo(termo);
      }
      router.push("/termos");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Falha ao salvar o termo.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          {isEdicao ? "Editar Termo" : "Cadastrar Novo Termo"}
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          {isEdicao
            ? "Altere o título ou o texto que o adotante precisa ler e aceitar."
            : "Escreva a lei ou o termo que o adotante precisa ler e aceitar ao solicitar uma adoção."}
        </p>
      </div>

      <form onSubmit={handleSalvar} className="space-y-5">
        <div className="bg-white rounded-3xl border border-stone-100 shadow-md p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Título
            </label>
            <input
              type="text"
              required
              value={termo.titulo}
              onChange={(e) => setTermo({ ...termo, titulo: e.target.value })}
              placeholder="Ex.: Lei Federal nº 9.605/98 (Artigo 32)"
              className="w-full bg-white border border-stone-200 focus:border-teal-500 outline-none px-4 py-2.5 text-sm rounded-xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Conteúdo
            </label>
            <textarea
              required
              rows={14}
              value={termo.conteudo}
              onChange={(e) => setTermo({ ...termo, conteudo: e.target.value })}
              placeholder="Escreva aqui as leis e condições que o adotante deve aceitar."
              className="w-full bg-white border border-stone-200 focus:border-teal-500 outline-none px-4 py-2.5 text-sm rounded-xl text-slate-700 font-medium transition-all placeholder:text-stone-300 resize-y"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termo.textoPadrao}
              onChange={(e) =>
                setTermo({ ...termo, textoPadrao: e.target.checked })
              }
              className="mt-0.5 accent-[#008080]"
            />
            <span>
              <span className="block text-sm font-black text-slate-700">
                Texto inicial padrão{" "}
                <span className="font-medium text-stone-300">(opcional)</span>
              </span>
              <span className="block text-xs font-medium text-slate-400">
                Este texto será exibido em primeiro lugar, antes das demais leis.
                A ONG pode ter apenas um texto padrão.
              </span>
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/termos"
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-slate-600 font-bold text-sm hover:bg-stone-100 transition-all"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={salvando}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-lg shadow-teal-100 transition-all disabled:opacity-50"
          >
            {salvando
              ? isEdicao
                ? "Salvando..."
                : "Cadastrando..."
              : isEdicao
                ? "Salvar Alterações"
                : "Cadastrar Termo"}
          </button>
        </div>
      </form>
    </div>
  );
}
