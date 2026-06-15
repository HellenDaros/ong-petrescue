"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { buscarEmpresaLogada } from "@/app/services/empresaService";
import { Empresa } from "@/app/types/empresa";

export default function MeuPerfilOng() {
  const router = useRouter();

  const { usuario, token } = useSelector((state: RootState) => state.auth);

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!usuario || !token) {
      router.push("/login");
      return;
    }

    carregarPerfil();
  }, [usuario, token]);

  const carregarPerfil = async () => {
    try {
      setCarregando(true);

      const dados = await buscarEmpresaLogada();

      setEmpresa(dados);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar perfil da ONG");
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Carregando perfil...
          </p>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="w-full max-w-4xl mx-auto p-12 text-center bg-white rounded-[2.5rem] shadow-sm border border-stone-100">
        <h2 className="text-2xl font-black text-slate-800">
          ONG não encontrada
        </h2>

        <p className="text-slate-500 mt-2">
          Nenhuma ONG foi encontrada para este usuário.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Perfil da ONG</h1>

          <p className="text-slate-500 text-sm font-medium">
            Visualize e gerencie os dados da instituição.
          </p>
        </div>

        <Link
          href={`/ong/${empresa.id}/editar`}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg shadow-teal-100"
        >
          Editar Dados
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ONG */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            Dados da ONG
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Nome Fantasia
              </label>

              <p className="text-slate-700 font-semibold">
                {empresa.nameFantasia}
              </p>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Razão Social
              </label>

              <p className="text-slate-700 font-semibold">
                {empresa.razaoSocial}
              </p>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                CNPJ
              </label>

              <p className="text-slate-700 font-semibold">{empresa.cnpj}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            Administrador Responsável
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Nome
              </label>

              <p className="text-slate-700 font-semibold">
                {empresa.usuarioAdmin.name}
              </p>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                E-mail
              </label>

              <p className="text-slate-700 font-semibold">
                {empresa.usuarioAdmin.email}
              </p>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                CPF
              </label>

              <p className="text-slate-700 font-semibold">
                {empresa.usuarioAdmin.cpf || "Não informado"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
