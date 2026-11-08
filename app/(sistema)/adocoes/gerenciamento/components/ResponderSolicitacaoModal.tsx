"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import {
  SolicitacaoAdocaoResponse,
  SolicitacaoConcorrente,
} from "@/app/types/solicitacaoAdocao";
import { buscarConcorrentes } from "@/app/services/adocaoService";

const TAMANHO_MAXIMO_MOTIVO = 500;

interface ResponderSolicitacaoModalProps {
  solicitacao: SolicitacaoAdocaoResponse;
  processando: boolean;
  onFechar: () => void;
  onResponder: (status: "APROVADO" | "REJEITADO", motivo?: string) => void;
}

export default function ResponderSolicitacaoModal({
  solicitacao,
  processando,
  onFechar,
  onResponder,
}: ResponderSolicitacaoModalProps) {
  const [concorrentes, setConcorrentes] = useState<SolicitacaoConcorrente[]>(
    [],
  );
  const [recusando, setRecusando] = useState(false);
  const [motivo, setMotivo] = useState("");

  const carregarConcorrentes = async () => {
    try {
      setConcorrentes(await buscarConcorrentes(solicitacao.id));
    } catch (error) {
      console.error("Erro ao carregar solicitações concorrentes:", error);
    }
  };

  useEffect(() => {
    carregarConcorrentes();
  }, [solicitacao.id]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !processando) onFechar();
      }}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
    >
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-stone-100 p-6 sm:p-8 text-center">
        <button
          type="button"
          onClick={onFechar}
          disabled={processando}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-stone-100 transition-all disabled:opacity-50"
        >
          <X size={18} strokeWidth={3} />
        </button>

        <h3 className="text-xl font-black text-slate-800 tracking-tight">
          {recusando ? "Recusar Solicitação" : "Responder Solicitação"}
        </h3>
        <p className="text-slate-500 text-lg font-medium mt-2 leading-relaxed">
          {recusando ? "Recusar" : "Deseja aprovar ou recusar"} a adoção de{" "}
          <span className="font-bold text-slate-700">
            {solicitacao.animal.nameAnimal}
          </span>{" "}
          para{" "}
          <span className="font-bold text-slate-700">
            {solicitacao.adotante.name}
          </span>
          ?
        </p>

        {recusando ? (
          <div className="mt-4 text-left space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">
              Justificativa{" "}
              <span className="normal-case font-medium text-stone-300">
                (opcional)
              </span>
            </label>
            <textarea
              rows={5}
              maxLength={TAMANHO_MAXIMO_MOTIVO}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Explique ao adotante o motivo da recusa. Ele poderá ver essa mensagem em Minhas Adoções."
              className="w-full bg-stone-50 border border-stone-200 focus:border-rose-300 focus:bg-white outline-none px-4 py-3 text-base rounded-xl text-slate-700 font-medium transition-all placeholder:text-stone-300 resize-none"
            />
            <p className="text-xs font-bold text-stone-300 text-right">
              {motivo.length}/{TAMANHO_MAXIMO_MOTIVO}
            </p>
          </div>
        ) : (
          concorrentes.length > 0 && (
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left">
              <p className="flex items-center gap-1.5 text-base font-black uppercase tracking-widest text-amber-700">
                <AlertTriangle size={14} />
                Atenção
              </p>
              <p className="text-lg text-amber-800 font-medium mt-1.5 leading-relaxed">
                Ao aprovar a solicitação #{solicitacao.id}, as outras
                solicitações pendentes para este animal serão recusadas
                automaticamente:
              </p>
              <ul className="mt-1.5 text-lg text-amber-800 font-bold space-y-0.5">
                {concorrentes.map((concorrente) => (
                  <li key={concorrente.id}>
                    #{concorrente.id} · {concorrente.adotanteNome}
                  </li>
                ))}
              </ul>
            </div>
          )
        )}

        <div className="flex gap-3 mt-8">
          {recusando ? (
            <>
              <button
                type="button"
                onClick={() => setRecusando(false)}
                disabled={processando}
                className="flex-1 inline-flex items-center justify-center py-4 bg-stone-100 hover:bg-stone-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:bg-slate-100 disabled:text-slate-400"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => onResponder("REJEITADO", motivo.trim())}
                disabled={processando}
                className="flex-1 inline-flex items-center justify-center gap-2 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:bg-slate-100 disabled:text-slate-400"
              >
                <X size={14} strokeWidth={3} />
                Confirmar recusa
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onResponder("APROVADO")}
                disabled={processando}
                className="flex-1 inline-flex items-center justify-center gap-2 py-4 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:bg-slate-100 disabled:text-slate-400"
              >
                <Check size={14} strokeWidth={3} />
                Aprovar
              </button>
              <button
                type="button"
                onClick={() => setRecusando(true)}
                disabled={processando}
                className="flex-1 inline-flex items-center justify-center gap-2 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:bg-slate-100 disabled:text-slate-400"
              >
                <X size={14} strokeWidth={3} />
                Recusar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
