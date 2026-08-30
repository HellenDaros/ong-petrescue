"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Empresa } from "@/app/types/empresa";
import { buscarEmpresaLogada } from "@/app/services/empresaService";
import EmpresaForm from "../../components/empresa-form";

export default function EditarEmpresaPage() {
  const router = useRouter();

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      const dados = await buscarEmpresaLogada();

      if (dados) {
        setEmpresa(dados);
      } else {
        router.push("/empresa");
      }
    } catch (error) {
      console.error("Erro ao carregar dados da ONG:", error);
      alert("Erro ao carregar dados da ONG.");
      router.push("/empresa");
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex w-full justify-center p-8 text-slate-500 font-medium">
        Carregando dados...
      </div>
    );
  }

  if (!empresa) {
    return null;
  }

  return (
    <div>
      <Link
        href="/empresa"
        className="text-sm font-bold text-slate-400 hover:text-teal-600 transition-colors w-fit"
      >
        &larr; Voltar
      </Link>

      <EmpresaForm empresaExistente={empresa} />
    </div>
  );
}
