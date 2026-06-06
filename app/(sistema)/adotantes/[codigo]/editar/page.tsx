"use client";

import Link from "next/link";
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
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <Link
          href="/home"
          className="text-sm font-bold text-slate-400 hover:text-teal-600 transition-colors w-fit"
        >
          &larr; Voltar
        </Link>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Editar Adotante #{codigo}
        </h1>
      </header>

      <AdotanteForm adotanteExistente={adotante} />
    </div>
  );
}
