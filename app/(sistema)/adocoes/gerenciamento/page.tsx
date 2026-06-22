"use client";

import React, { useEffect, useState } from "react";
import {
  buscarAdocoesOng,
  responderSolicitacaoAdocao,
  SolicitacaoAdocaoResponse,
} from "@/app/services/adocaoService";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Briefcase,
  Phone,
  Mail,
  FileText,
  MapPin,
  ClipboardList,
  Check,
  X,
} from "lucide-react";

export default function GerenciamentoAdocoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoAdocaoResponse[]>([]);
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

  const handleResponder = async (id: number, novoStatus: "APROVADO" | "REJEITADO") => {
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
        // Atualizar lista local
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

  const getStatusBadge = (status: "PENDENTE" | "APROVADO" | "REJEITADO") => {
    switch (status) {
      case "APROVADO":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <CheckCircle size={14} />
            Aprovado
          </span>
        );
      case "REJEITADO":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <XCircle size={14} />
            Recusado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider animate-pulse">
            <Clock size={14} />
            Pendente
          </span>
        );
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#008080] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Gerenciamento de Adoções
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          Analise e responda às solicitações de adoção para os pets da sua ONG.
        </p>
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
            Não há solicitações de adoção pendentes ou processadas para seus animais no momento.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {solicitacoes.map((sol) => (
            <div
              key={sol.id}
              className="bg-white rounded-[2.5rem] border border-stone-100 shadow-md p-6 lg:p-8 flex flex-col xl:flex-row gap-8 relative overflow-hidden"
            >
              {/* Pet Info */}
              <div className="w-full xl:w-72 flex-shrink-0 flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-stone-100 pb-6 xl:pb-0 xl:pr-8">
                <div className="space-y-4">
                  <div className="relative h-44 w-full rounded-3xl overflow-hidden bg-stone-100">
                    <img
                      src={sol.animal.urlFoto}
                      alt={sol.animal.nameAnimal}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/95 backdrop-blur-sm text-[#008080] text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm">
                        {sol.animal.especie}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                      {sol.animal.nameAnimal}
                    </h2>
                    <p className="text-[#008080] font-black text-xs uppercase tracking-widest mt-1">
                      Raça: <span className="text-slate-400">{sol.animal.raca}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    Status da Solicitação
                  </span>
                  <div>{getStatusBadge(sol.statusAdocao)}</div>
                </div>
              </div>

              {/* Adopter & Request Details */}
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={16} className="text-teal-600" />
                    Dados do Adotante
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Nome Completo
                      </span>
                      <p className="text-slate-700 font-bold text-sm">{sol.adotante.name}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        CPF
                      </span>
                      <p className="text-slate-700 font-bold text-sm">
                        {sol.adotante.cpf?.numero || "Não informado"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Identidade (RG)
                      </span>
                      <p className="text-slate-700 font-bold text-sm">
                        {sol.adotante.identidade || "Não informado"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Contato
                      </span>
                      <p className="text-slate-700 font-bold text-sm flex items-center gap-1.5">
                        <Phone size={14} className="text-stone-400" />
                        {sol.adotante.telefoneMovel}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        E-mail
                      </span>
                      <p className="text-slate-700 font-bold text-sm flex items-center gap-1.5">
                        <Mail size={14} className="text-stone-400" />
                        {sol.adotante.email}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Profissão
                      </span>
                      <p className="text-slate-700 font-bold text-sm flex items-center gap-1.5">
                        <Briefcase size={14} className="text-stone-400" />
                        {sol.adotante.profissao}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-stone-100 w-full" />

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={16} className="text-teal-600" />
                    Detalhes do Pedido
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50 p-5 rounded-3xl border border-stone-100">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <MapPin size={12} className="text-stone-400" />
                        Endereço de destino do pet
                      </span>
                      <p className="text-slate-700 font-bold text-sm leading-relaxed">
                        {sol.enderecoAnimal}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Cadastro do Adotante
                      </span>
                      <p className="text-slate-700 font-bold text-sm leading-relaxed">
                        {sol.adotante.endereco}, {sol.adotante.bairro}
                        <br />
                        {sol.adotante.cidade} - {sol.adotante.uf}
                      </p>
                    </div>
                  </div>
                </div>

                {sol.statusAdocao === "PENDENTE" && (
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => handleResponder(sol.id, "REJEITADO")}
                      disabled={processandoId !== null}
                      className="px-6 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <X size={16} strokeWidth={2.5} />
                      Recusar Adoção
                    </button>
                    <button
                      onClick={() => handleResponder(sol.id, "APROVADO")}
                      disabled={processandoId !== null}
                      className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-teal-100 disabled:bg-slate-300"
                    >
                      <Check size={16} strokeWidth={2.5} />
                      Aprovar Adoção
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
