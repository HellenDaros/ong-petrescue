"use client";

import { Check, X } from "lucide-react";
import { SolicitacaoAdocaoResponse } from "@/app/types/solicitacaoAdocao";

interface ResponderSolicitacaoModalProps {
  solicitacao: SolicitacaoAdocaoResponse;
  processando: boolean;
  onFechar: () => void;
  onResponder: (status: "APROVADO" | "REJEITADO") => void;
}

export default function ResponderSolicitacaoModal({
  solicitacao,
  processando,
  onFechar,
  onResponder,
}: ResponderSolicitacaoModalProps) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !processando) onFechar();
      }}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl border border-stone-100 p-8 text-center">
        <button
          type="button"
          onClick={onFechar}
          disabled={processando}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-stone-100 transition-all disabled:opacity-50"
        >
          <X size={18} strokeWidth={3} />
        </button>

        <h3 className="text-lg font-black text-slate-800 tracking-tight">
          Responder Solicitação
        </h3>
        <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">
          Deseja aprovar ou recusar a adoção de{" "}
          <span className="font-bold text-slate-700">
            {solicitacao.animal.nameAnimal}
          </span>{" "}
          para{" "}
          <span className="font-bold text-slate-700">
            {solicitacao.adotante.name}
          </span>
          ?
        </p>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={() => onResponder("REJEITADO")}
            disabled={processando}
            className="flex-1 inline-flex items-center justify-center gap-2 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:bg-slate-100 disabled:text-slate-400"
          >
            <X size={14} strokeWidth={3} />
            Recusar
          </button>
          <button
            type="button"
            onClick={() => onResponder("APROVADO")}
            disabled={processando}
            className="flex-1 inline-flex items-center justify-center gap-2 py-4 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:bg-slate-100 disabled:text-slate-400"
          >
            <Check size={14} strokeWidth={3} />
            Aprovar
          </button>
        </div>
      </div>
    </div>
  );
}
