"use client";

import BotaoVoltar from "@/app/components/BotaoVoltar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Adotante } from "@/app/types/adotante";
import { buscarAdotantePorId } from "@/app/services/adotanteService";
import AdotanteForm from "../../components/AdotanteForm";

export default function EditarAdotante() {
  const params = useParams();
  const router = useRouter();
  const codigo = Number(params.codigo);

  const [adotante, setAdotante] = useState<Adotante | null>(null);

  useEffect(() => {
    if (codigo) {
      buscarDados();
    }
  }, [codigo]);

  const buscarDados = async () => {
    const data = await buscarAdotantePorId(codigo);

    if (data) {
      setAdotante(data);
    } else {
      router.push("/home");
    }
  };

  if (!adotante) {
    return (
      <div className="flex w-full justify-center p-8 text-slate-500 font-medium">
        Carregando dados...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <BotaoVoltar href="/home">Voltar</BotaoVoltar>

      <AdotanteForm adotanteExistente={adotante} />
    </div>
  );
}
