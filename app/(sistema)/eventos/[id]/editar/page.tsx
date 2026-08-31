"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventoForm from "../../components/evento-form";
import { Evento } from "@/app/types/evento";
import { buscarEventoPorId } from "@/app/services/eventoService";

export default function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const eventoId = Number(resolvedParams.id);
  const router = useRouter();

  const [evento, setEvento] = useState<Evento | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await buscarEventoPorId(eventoId);
        setEvento(data);
      } catch (error) {
        console.error("Erro ao carregar evento:", error);
        alert("Erro ao carregar evento.");
        router.push("/eventos");
      }
    }
    if (eventoId) carregar();
  }, [eventoId, router]);

  if (!evento) {
    return (
      <div className="w-full max-w-5xl mx-auto py-24 text-center font-bold text-slate-400">
        Carregando dados do evento...
      </div>
    );
  }

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

      <EventoForm eventoExistente={evento} />
    </div>
  );
}
