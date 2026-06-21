"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  buscarAdotanteLogado,
  buscarAdotantePorId,
} from "@/app/services/adotanteService";
import { Adotante } from "@/app/types/adotante";
import { RootState } from "@/app/redux/store";

export default function MeuPerfilAdotante() {
  const router = useRouter();

  const { usuario, token } = useSelector((state: RootState) => state.auth);

  const [perfil, setPerfil] = useState<Adotante | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    if (!usuario || !token) {
      router.push("/login");
      return;
    }

    carregarPerfil();
  }, [usuario, token, router]);

  const carregarPerfil = async () => {
    try {
      setCarregando(true);

      const dados = await buscarAdotanteLogado();

      setPerfil(dados);
    } catch (error) {
      alert("Erro ao carregar as informações do perfil.");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-[400px] w-full">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-10 h-10 text-teal-600 animate-spin"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Carregando seu perfil...
          </p>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="w-full max-w-4xl mx-auto p-12 text-center bg-white rounded-[2.5rem] shadow-sm border border-stone-100">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
          Perfil não encontrado
        </h2>
        <p className="text-slate-500 font-medium mb-6">
          Não conseguimos localizar os dados vinculados a esta conta.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Meu Perfil
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Visualize e gerencie suas informações pessoais.
          </p>
        </div>

        <Link
          href={`/adotantes/${perfil.id}/editar`}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg shadow-teal-100 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          Editar Dados
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
              </svg>
            </span>
            Dados Pessoais
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Nome Completo
              </label>
              <p className="text-slate-700 font-semibold">
                {usuario?.name || "Não informado"}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                CPF
              </label>
              <p className="text-slate-700 font-semibold">
                {usuario?.cpf || "Não informado"}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                E-mail
              </label>
              <p className="text-slate-700 font-semibold">
                {usuario?.email || "Não informado"}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Identidade (RG)
              </label>
              <p className="text-slate-700 font-semibold">
                {perfil.identidade || "Não informado"}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Profissão
              </label>
              <p className="text-slate-700 font-semibold">
                {perfil.profissao || "Não informado"}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Celular
              </label>
              <p className="text-slate-700 font-semibold">
                {perfil.telefoneMovel || "Não informado"}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Telefone Fixo
              </label>
              <p className="text-slate-700 font-semibold">
                {perfil.telefoneFixo || "Não informado"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11 0 .308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Endereço
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Logradouro
              </label>
              <p className="text-slate-700 font-semibold">
                {perfil.endereco || "Não informado"}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Bairro
              </label>
              <p className="text-slate-700 font-semibold">
                {perfil.bairro || "Não informado"}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Cidade
              </label>
              <p className="text-slate-700 font-semibold">
                {perfil.cidade || "Não informado"}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                UF
              </label>
              <p className="text-slate-700 font-semibold">{perfil.uf || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
