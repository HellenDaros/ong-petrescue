"use client";

import BotaoVoltar from "@/app/components/BotaoVoltar";
import EventoForm from "../components/evento-form";

export default function NovoEventoPage() {
  return (
    <div>
      <BotaoVoltar href="/eventos">Voltar para Eventos</BotaoVoltar>

      <EventoForm />
    </div>
  );
}
