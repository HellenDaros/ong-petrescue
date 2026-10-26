"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BotaoVoltar from "@/app/components/BotaoVoltar";
import TermoForm from "../../components/termo-form";
import { Termo } from "@/app/types/termo";
import { listarTermos } from "@/app/services/termoService";

export default function EditarTermoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const termoId = Number(resolvedParams.id);
  const router = useRouter();

  const [termo, setTermo] = useState<Termo | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const termos = await listarTermos();
        const encontrado = termos.find((t) => t.id === termoId);
        if (!encontrado) throw new Error("Termo não encontrado.");
        setTermo(encontrado);
      } catch (error) {
        console.error("Erro ao carregar termo:", error);
        alert("Erro ao carregar termo.");
        router.push("/termos");
      }
    }
    if (termoId) carregar();
  }, [termoId, router]);

  if (!termo) {
    return (
      <div className="w-full max-w-5xl mx-auto py-24 text-center font-bold text-slate-400">
        Carregando dados do termo...
      </div>
    );
  }

  return (
    <div>
      <BotaoVoltar href="/termos">Voltar para Termos e Leis</BotaoVoltar>

      <TermoForm termoExistente={termo} />
    </div>
  );
}
