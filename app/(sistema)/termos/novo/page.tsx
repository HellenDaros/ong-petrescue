"use client";

import BotaoVoltar from "@/app/components/BotaoVoltar";
import TermoForm from "../components/termo-form";

export default function NovoTermoPage() {
  return (
    <div>
      <BotaoVoltar href="/termos">Voltar para Termos e Leis</BotaoVoltar>

      <TermoForm />
    </div>
  );
}
