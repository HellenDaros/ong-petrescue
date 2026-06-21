"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Usuario, UsuarioFormProps } from "@/app/types/usuarios";
import { salvarUsuario } from "@/app/services/usuarioService";

export default function UsuarioForm({ usuarioExistente }: UsuarioFormProps) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario>(
    usuarioExistente || new Usuario(null, "", "", "", "ATIVO", "", ""),
  );

  const handleChange = (
    campo: "name" | "email" | "cpf" | "senha",
    valor: string,
  ) => {
    setUsuario(
      (prev) =>
        new Usuario(
          prev.id,
          campo === "name" ? valor : prev.name,
          campo === "email" ? valor : prev.email,
          campo === "cpf" ? valor : prev.cpf,
          prev.status,
          campo === "senha" ? valor : prev.senha,
          prev.role,
        ),
    );
  };

  const handleSalvar = async (formData: FormData) => {
    const isEdicao = !!usuarioExistente;

    const sucesso = await salvarUsuario(usuario, isEdicao);

    if (!sucesso) {
      alert("Erro ao salvar usuário");
      return;
    }

    alert("Usuário salvo com sucesso!");
    router.push("/usuarios");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
        <div className="bg-stone-50/50 px-10 py-8 border-b border-stone-100">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Dados do Usuário
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Preencha as informações para salvar o cadastro.
          </p>
        </div>

        <form action={handleSalvar} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Nome completo
            </label>
            <input
              type="text"
              required
              onChange={(e) => handleChange("name", e.target.value)}
              value={usuario.name}
              placeholder="João da Silva Salro"
              className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
              E-mail
            </label>
            <input
              type="email"
              required
              onChange={(e) => handleChange("email", e.target.value)}
              value={usuario.email}
              placeholder="seu@email"
              className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Senha
            </label>
            <input
              type="password"
              required={!usuarioExistente}
              onChange={(e) => handleChange("senha", e.target.value)}
              value={usuario.senha}
              placeholder="••••••••"
              className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Link
              href="/usuarios"
              className="flex-1 text-center py-4 rounded-2xl font-black text-slate-400 hover:text-slate-600 hover:bg-stone-50 transition-all"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-orange-100 active:scale-95"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
