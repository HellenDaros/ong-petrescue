"use client";

import React from "react";
import {
  LayoutDashboard,
  PawPrint,
  MessageCircle,
  Settings,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <section className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            Olá, Au-migo! 👋
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Estamos felizes em ter você aqui. Utilize o menu lateral para
            navegar entre as funcionalidades.
          </p>
        </div>
        <LayoutDashboard size={48} className="text-stone-200 hidden sm:block" />
      </section>

      <section className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm">
        <h2 className="font-black text-slate-800 text-xl mb-5">
          ✨ Dicas rápidas
        </h2>

        <ul className="space-y-4">
          <li className="flex gap-3">
            <MessageCircle className="text-orange-500 mt-1" size={18} />
            <p className="text-slate-500 font-medium">
              Mantenha seus dados sempre atualizados.
            </p>
          </li>

          <li className="flex gap-3">
            <Settings className="text-slate-500 mt-1" size={18} />
            <p className="text-slate-500 font-medium">
              As funcionalidades exibidas variam conforme o perfil de acesso.
            </p>
          </li>
        </ul>
      </section>

      <section className="text-center py-6">
        <PawPrint className="mx-auto text-teal-500 mb-3" />

        <p className="text-slate-500 italic">
          "Cuidar de um animal é transformar duas vidas: a dele e a sua."
        </p>
      </section>
    </div>
  );
}
