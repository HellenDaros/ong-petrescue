"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventoForm from "../components/evento-form";

export default function NovoEventoPage() {
  return (
    <div>
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <Link
          href="/eventos"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold text-sm transition-all"
        >
          <ArrowLeft size={16} />
          Voltar para Eventos
        </Link>
      </div>

      <EventoForm />
    </div>
  );
}
