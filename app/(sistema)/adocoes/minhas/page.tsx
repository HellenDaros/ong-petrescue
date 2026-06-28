"use client";

import React, { useEffect, useState } from "react";
import { buscarMinhasAdocoes } from "@/app/services/adocaoService";
import {
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { SolicitacaoAdocaoResponse } from "@/app/types/solicitacaoAdocao";

export default function MinhasAdocoesPage() {
  const [adocoes, setAdocoes] = useState<SolicitacaoAdocaoResponse[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarAdocoes = async () => {
    try {
      const data = await buscarMinhasAdocoes();
      setAdocoes(data);
    } catch (error) {
      console.error("Erro ao buscar minhas adoções:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarAdocoes();
  }, []);

  const getStatusBadge = (status: "PENDENTE" | "APROVADO" | "REJEITADO") => {
    switch (status) {
      case "APROVADO":
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <CheckCircle size={14} />
            Aprovado
          </span>
        );
      case "REJEITADO":
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <XCircle size={14} />
            Recusado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Clock size={14} />
            Pendente
          </span>
        );
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Minhas Adoções
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          Acompanhe o andamento das solicitações de adoção feitas por você.
        </p>
      </div>

      {adocoes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm p-8">
          <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Heart className="text-stone-300" size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-700">
            Nenhuma solicitação encontrada
          </h3>
          <p className="text-slate-500 text-sm font-medium mt-2 max-w-sm mx-auto">
            Você ainda não demonstrou interesse em nenhum de nossos protegidos.
            Acesse a galeria pública e comece agora!
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all"
            >
              Ver Animais Disponíveis
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adocoes.map((adocao) => (
            <div
              key={adocao.id}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 shadow-md hover:shadow-lg transition-all p-6 flex flex-col sm:flex-row gap-6 relative"
            >
              <div className="w-full sm:w-32 h-32 rounded-3xl overflow-hidden bg-stone-100 flex-shrink-0">
                <img
                  src={adocao.animal.urlFoto}
                  alt={adocao.animal.nameAnimal}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <h2 className="text-xl font-black text-slate-800 leading-tight">
                        {adocao.animal.nameAnimal}
                      </h2>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                        {adocao.animal.raca}
                      </p>
                    </div>
                    {getStatusBadge(adocao.statusAdocao)}
                  </div>

                  <div className="h-px bg-stone-50 w-full my-3" />

                  <div className="space-y-2 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-stone-400" />
                      <span>
                        Solicitado em:{" "}
                        {new Date(adocao.dataSolicitacao).toLocaleDateString(
                          "pt-BR",
                        )}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin
                        size={14}
                        className="text-stone-400 mt-0.5 flex-shrink-0"
                      />
                      <span>Local planejado: {adocao.enderecoAnimal}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-50 text-[10px] font-black text-[#008080] uppercase tracking-widest">
                  ONG responsável pelo animal
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
