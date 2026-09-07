"use client";

import { useState } from "react";
import {
  Briefcase,
  CalendarDays,
  FileSignature,
  IdCard,
  Info,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { SolicitacaoAdocaoResponse } from "@/app/types/solicitacaoAdocao";
import { CONFIRMACAO_LABEL } from "@/app/(sistema)/animais/constants/animal-constants";
import { getStatusBadge } from "../../utils/status-badge";

const rotuloConfirmacao = (valor: string) =>
  CONFIRMACAO_LABEL[valor as keyof typeof CONFIRMACAO_LABEL] ?? valor;

interface DetalhesSolicitacaoModalProps {
  solicitacao: SolicitacaoAdocaoResponse;
  onFechar: () => void;
}

function Campo({
  label,
  valor,
  icon: Icon,
}: {
  label: string;
  valor: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
        {Icon && <Icon size={13} className="text-stone-400 flex-shrink-0" />}
        <span>{valor}</span>
      </div>
    </div>
  );
}

export default function DetalhesSolicitacaoModal({
  solicitacao,
  onFechar,
}: DetalhesSolicitacaoModalProps) {
  const { adotante, animal } = solicitacao;
  const [mostrarInfoVacina, setMostrarInfoVacina] = useState(false);

  const formatarData = (dataString?: string) => {
    if (!dataString) return "-";
    return new Date(dataString).toLocaleDateString("pt-BR");
  };

  const temDescricaoVacina =
    animal.vacinado === "SIM" && !!animal.vacinadoDescricao;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden bg-white rounded-[2rem] shadow-2xl border border-stone-100">
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-stone-100 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 shadow-sm border border-stone-200">
              <img
                src={animal.urlFoto}
                alt={animal.nameAnimal}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none">
                Solicitação para {animal.nameAnimal}
              </h3>
              <p className="text-teal-600 font-bold text-[11px] uppercase tracking-widest mt-1.5">
                {animal.especie} · {animal.idade}
              </p>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-1">
                Castrado: {rotuloConfirmacao(animal.castrado)} · Vermifugado:{" "}
                {rotuloConfirmacao(animal.vermifugado)}
              </p>
              <div className="relative flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-0.5">
                Vacinado: {rotuloConfirmacao(animal.vacinado)}
                {temDescricaoVacina && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMostrarInfoVacina((v) => !v)}
                      className="text-slate-400 hover:text-teal-600 transition-colors"
                    >
                      <Info size={12} />
                    </button>
                    {mostrarInfoVacina && (
                      <div className="absolute left-0 top-full mt-2 w-60 bg-slate-800 text-white text-[10px] normal-case font-medium tracking-normal leading-relaxed rounded-xl p-3 shadow-xl z-10">
                        {animal.vacinadoDescricao}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-right space-y-2 shrink-0">
            <button
              type="button"
              onClick={onFechar}
              className="inline-flex p-2 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-stone-100 transition-all"
            >
              <X size={18} strokeWidth={3} />
            </button>
            <div>{getStatusBadge(solicitacao.statusAdocao)}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 [scrollbar-width:thin] [scrollbar-color:#d6d3d1_transparent]">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              Dados do Adotante
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-stone-50 rounded-2xl p-5">
              <Campo label="Nome" valor={adotante.name} />
              <Campo label="CPF" valor={adotante.cpf || "N/A"} />
              <Campo
                label="Identidade (RG)"
                valor={adotante.identidade || "N/A"}
                icon={IdCard}
              />
              <Campo
                label="Profissão"
                valor={adotante.profissao || "N/A"}
                icon={Briefcase}
              />
              <Campo label="E-mail" valor={adotante.email} icon={Mail} />
              <Campo
                label="Telefone Celular"
                valor={adotante.telefoneMovel || "N/A"}
                icon={Phone}
              />
              <Campo
                label="Telefone Fixo"
                valor={adotante.telefoneFixo || "N/A"}
                icon={Phone}
              />
              <Campo
                label="Endereço do Adotante"
                valor={`${adotante.endereco}, ${adotante.bairro} - ${adotante.cidade}/${adotante.uf}`}
                icon={MapPin}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              Adoção
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-stone-50 rounded-2xl p-5">
              <Campo
                label="Endereço onde o animal ficará"
                valor={solicitacao.enderecoAnimal}
                icon={MapPin}
              />
              <Campo
                label="Data da Solicitação"
                valor={formatarData(solicitacao.dataSolicitacao)}
                icon={CalendarDays}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <FileSignature size={14} />
              Assinatura do Termo de Compromisso
            </h4>
            {solicitacao.assinaturaBase64 ? (
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-3 flex justify-center">
                <img
                  src={solicitacao.assinaturaBase64}
                  alt={`Assinatura de ${adotante.name}`}
                  className="max-h-24 bg-white rounded-xl"
                />
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium bg-stone-50 rounded-2xl border border-dashed border-stone-200 p-5 text-center">
                Nenhuma assinatura registrada para esta solicitação.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
