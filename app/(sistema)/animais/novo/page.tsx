"use client";

import BotaoVoltar from "@/app/components/BotaoVoltar";
import AnimalForm from "../components/animal-form";

export default function CadastrarAnimalPage() {
  return (
    <main>
      <div>
        <div>
          <BotaoVoltar href="/animais">Voltar para gestão de Animais</BotaoVoltar>
        </div>

        <AnimalForm />
      </div>
    </main>
  );
}
