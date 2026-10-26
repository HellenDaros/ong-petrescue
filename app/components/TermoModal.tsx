"use client";

import { X } from "lucide-react";
import { Termo } from "@/app/types/termo";

interface TermoModalProps {
  termos: Termo[];
  onFechar: () => void;
}

export default function TermoModal({ termos, onFechar }: TermoModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-[2rem] shadow-2xl border border-stone-100 overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-8 pt-8 pb-4 border-b border-stone-100">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Termos da ONG
          </h3>
          <button
            type="button"
            onClick={onFechar}
            className="p-2 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-stone-100 transition-all"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <div className="px-8 py-6 overflow-y-auto space-y-8">
          {termos.map((termo) => (
            <section key={termo.id} className="space-y-2">
              <h4 className="text-sm font-black text-orange-500 uppercase tracking-wider">
                {termo.titulo}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                {termo.conteudo}
              </p>
            </section>
          ))}
        </div>

        <div className="flex justify-end p-6 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onFechar}
            className="py-3 px-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-orange-100 active:scale-95"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
