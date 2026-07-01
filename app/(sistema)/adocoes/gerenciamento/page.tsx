"use client";

import React, { useEffect, useState } from "react";
import {
  buscarAdocoesOng,
  responderSolicitacaoAdocao,
} from "@/app/services/adocaoService";
import {
  Briefcase,
  Phone,
  Mail,
  ClipboardList,
  Check,
  X,
  CalendarDays,
} from "lucide-react";
import { SolicitacaoAdocaoResponse } from "@/app/types/solicitacaoAdocao";
import { getStatusBadge } from "../utils/status-badge";

export default function GerenciamentoAdocoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoAdocaoResponse[]>(
    [],
  );
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  const carregarSolicitacoes = async () => {
    try {
      const data = await buscarAdocoesOng();
      setSolicitacoes(data);
    } catch (error) {
      console.error("Erro ao buscar solicitações da ONG:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const handleResponder = async (
    id: number,
    novoStatus: "APROVADO" | "REJEITADO",
  ) => {
    const confirmacao = confirm(
      `Tem certeza que deseja ${novoStatus === "APROVADO" ? "APROVAR" : "REJEITAR"} esta solicitação de adoção?`,
    );
    if (!confirmacao) return;

    setProcessandoId(id);
    try {
      const sucesso = await responderSolicitacaoAdocao(id, novoStatus);
      if (sucesso) {
        alert(
          `Solicitação de adoção ${novoStatus === "APROVADO" ? "aprovada" : "rejeitada"} com sucesso!`,
        );
        setSolicitacoes((prev) =>
          prev.map((sol) =>
            sol.id === id ? { ...sol, statusAdocao: novoStatus } : sol,
          ),
        );
      } else {
        alert("Erro ao responder solicitação de adoção. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao responder solicitação:", error);
      alert("Erro ao processar resposta.");
    } finally {
      setProcessandoId(null);
    }
  };

  const formatarData = (dataString?: string) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#008080] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Gerenciamento de Adoções
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Analise e responda às solicitações de adoção para os pets da sua
            ONG.
          </p>
        </div>
      </div>

      {solicitacoes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm p-8">
          <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <ClipboardList className="text-stone-300" size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-700">
            Nenhuma solicitação recebida
          </h3>
          <p className="text-slate-500 text-sm font-medium mt-2 max-w-sm mx-auto">
            Não há solicitações de adoção pendentes ou processadas para seus
            animais no momento.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-5 whitespace-nowrap">Pet</th>
                  <th className="px-6 py-5 whitespace-nowrap">Adotante</th>
                  <th className="px-6 py-5 whitespace-nowrap">Contato</th>
                  <th className="px-6 py-5 whitespace-nowrap">
                    Endereço Adotante
                  </th>
                  <th className="px-6 py-5 whitespace-nowrap">
                    Endereço Destino
                  </th>
                  <th className="px-6 py-5 whitespace-nowrap">
                    Data da Solicitação
                  </th>
                  <th className="px-6 py-5 whitespace-nowrap">Status</th>
                  <th className="px-6 py-5 text-center whitespace-nowrap">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {solicitacoes.map((sol) => (
                  <tr
                    key={sol.id}
                    className="hover:bg-stone-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 shadow-sm border border-stone-200">
                          <img
                            src={sol.animal.urlFoto}
                            alt={sol.animal.nameAnimal}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 leading-none">
                            {sol.animal.nameAnimal}
                          </p>
                          <p className="text-teal-600 font-bold text-[10px] uppercase tracking-widest mt-1">
                            {sol.animal.especie}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700">
                          {sol.adotante.name}
                        </p>
                        <div className="flex flex-col text-[11px] text-slate-500 font-medium">
                          <span>CPF: {sol.adotante.cpf || "N/A"}</span>
                          {sol.adotante.identidade && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span>RG: {sol.adotante.identidade}</span>
                            </>
                          )}
                        </div>
                        {sol.adotante.profissao && (
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                            <Briefcase size={10} />
                            {sol.adotante.profissao}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                          <Phone size={12} className="text-stone-400" />
                          {sol.adotante.telefoneMovel}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                          <Mail size={12} className="text-stone-400" />
                          <span
                            className="truncate max-w-[150px]"
                            title={sol.adotante.email}
                          >
                            {sol.adotante.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-slate-600 leading-relaxed max-w-[200px]">
                        {sol.enderecoAnimal}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs font-medium text-slate-600 leading-relaxed max-w-[200px]">
                        <span>{sol.adotante.endereco} -</span>
                        <span>{sol.adotante.bairro}</span>
                        <span className="text-slate-400 mt-0.5">
                          {sol.adotante.cidade} / {sol.adotante.uf}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <CalendarDays size={12} className="text-slate-400" />
                        {formatarData(sol.dataSolicitacao)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(sol.statusAdocao)}
                    </td>

                    <td className="px-6 py-4">
                      {sol.statusAdocao === "PENDENTE" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleResponder(sol.id, "REJEITADO")}
                            disabled={processandoId !== null}
                            title="Recusar"
                            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors disabled:bg-slate-100 disabled:text-slate-400"
                          >
                            <X size={16} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleResponder(sol.id, "APROVADO")}
                            disabled={processandoId !== null}
                            title="Aprovar"
                            className="p-2.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-xl transition-colors disabled:bg-slate-100 disabled:text-slate-400"
                          >
                            <Check size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center text-slate-300">
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Concluído
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
