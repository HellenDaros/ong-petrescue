"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit3, Plus, Power } from "lucide-react";
import { Termo } from "@/app/types/termo";
import { alterarStatusTermo, listarTermos } from "@/app/services/termoService";

const formatarDataHora = (data: string) =>
  new Date(data).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

const mensagemErro = (error: unknown, padrao: string) =>
  error instanceof Error ? error.message : padrao;

export default function TermosPage() {
  const [termos, setTermos] = useState<Termo[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarTermos = async () => {
    try {
      setCarregando(true);
      setTermos(await listarTermos());
    } catch (error) {
      console.error("Erro ao carregar termos:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarTermos();
  }, []);

  const handleAtivacao = async (termo: Termo) => {
    const ativar = !termo.ativo;
    const confirmacao = confirm(
      ativar
        ? `Ativar o termo "${termo.titulo}"? Ele passará a ser exibido para quem solicitar a adoção de um animal da sua ONG.`
        : `Desativar o termo "${termo.titulo}"? Ele deixará de ser exibido na solicitação de adoção. Se nenhum termo ficar ativo, será exibido o texto padrão da Lei Federal 9.605/98.`,
    );
    if (!confirmacao) return;

    try {
      await alterarStatusTermo(termo.id, ativar);
      carregarTermos();
    } catch (error) {
      alert(mensagemErro(error, "Falha ao alterar o termo."));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Termos e Leis
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Cadastre o termo que o adotante precisa ler e aceitar ao solicitar
            uma adoção. Todos os termos ativos são exibidos e precisam ser aceitos.
          </p>
        </div>

        <Link
          href="/termos/novo"
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg shadow-teal-100 active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} />
          Cadastrar Termo
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Cód.
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Título
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Última edição
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {termos.map((termo) => (
                <tr
                  key={termo.id}
                  className="hover:bg-stone-50/40 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">
                    #{termo.id}
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-700">
                        {termo.titulo}
                      </span>
                      <span className="text-xs text-slate-400 line-clamp-1">
                        {termo.conteudo}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        termo.ativo
                          ? "bg-teal-50 text-teal-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${termo.ativo ? "bg-teal-500" : "bg-red-500"}`}
                      />
                      {termo.ativo ? "ATIVO" : "INATIVO"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {formatarDataHora(termo.dataAtualizacao)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/termos/${termo.id}/editar`}
                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                        title="Editar"
                      >
                        <Edit3 size={20} strokeWidth={2} />
                      </Link>

                      <button
                        onClick={() => handleAtivacao(termo)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title={termo.ativo ? "Desativar" : "Ativar"}
                      >
                        <Power size={20} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {termos.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center text-slate-400 font-medium"
                  >
                    {carregando
                      ? "Carregando termos..."
                      : "Nenhum termo cadastrado. Enquanto não houver termo ativo, a solicitação de adoção exibe o texto padrão da Lei Federal 9.605/98."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
