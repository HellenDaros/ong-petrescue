"use client";

import {
  LayoutDashboard,
  PawPrint,
  MessageCircle,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { buscarDashboard } from "@/app/services/dashboardService";
import { Dashboard } from "@/app/types/dashboard";

export default function HomePage() {
  const usuario = useSelector((state: RootState) => state.auth.usuario);
  const usuarioDaOng =
    usuario?.role === "ROLE_ADMIN_ONG" ||
    usuario?.role === "ROLE_FUNCIONARIO_ONG";
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  useEffect(() => {
    if (!usuarioDaOng) return;
    carregarDashboard();
  }, [usuarioDaOng]);

  const carregarDashboard = async () => {
    const dados = await buscarDashboard();
    setDashboard(dados);
  };

  const cartoes = dashboard
    ? [
        {
          rotulo: "Disponíveis",
          valor: dashboard.animaisDisponiveis,
          cor: "text-teal-600",
        },
        {
          rotulo: "Adotados",
          valor: dashboard.animaisAdotados,
          cor: "text-amber-600",
        },
        {
          rotulo: "Inativos",
          valor: dashboard.animaisInativos,
          cor: "text-red-500",
        },
        {
          rotulo: "Solicitações pendentes",
          valor: dashboard.solicitacoesPendentes,
          cor: "text-orange-500",
        },
      ]
    : [];

  return (
    <div className="w-full max-w-5xl mx-auto my-auto space-y-10 animate-in fade-in duration-500">
      {usuarioDaOng && cartoes.length > 0 && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cartoes.map((cartao) => (
            <div
              key={cartao.rotulo}
              className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm"
            >
              <p className={`text-4xl font-black ${cartao.cor}`}>
                {cartao.valor}
              </p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-2">
                {cartao.rotulo}
              </p>
            </div>
          ))}
        </section>
      )}

      <section className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            Olá, Au-migo! 👋
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Estamos felizes em ter você aqui. Utilize o menu lateral para
            navegar entre as funcionalidades.
          </p>
        </div>
        <LayoutDashboard size={48} className="text-stone-200 hidden sm:block" />
      </section>

      <section className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm">
        <h2 className="font-black text-slate-800 text-xl mb-5">
          ✨ Dicas rápidas
        </h2>

        <ul className="space-y-4">
          <li className="flex gap-3">
            <MessageCircle className="text-orange-500 mt-1" size={18} />
            <p className="text-slate-500 font-medium">
              Mantenha seus dados sempre atualizados.
            </p>
          </li>

          <li className="flex gap-3">
            <Settings className="text-slate-500 mt-1" size={18} />
            <p className="text-slate-500 font-medium">
              As funcionalidades exibidas variam conforme o perfil de acesso.
            </p>
          </li>
        </ul>
      </section>

      <section className="text-center py-6">
        <PawPrint className="mx-auto text-teal-500 mb-3" />

        <p className="text-slate-500 italic">
          "Cuidar de um animal é transformar duas vidas: a dele e a sua."
        </p>
      </section>
    </div>
  );
}
