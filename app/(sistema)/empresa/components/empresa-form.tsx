"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Empresa, EmpresaFormProps } from "@/app/types/empresa";
import { salvarEmpresa } from "@/app/services/empresaService";
import { Usuario } from "@/app/types/usuarios";

export default function EmpresaForm({ empresaExistente }: EmpresaFormProps) {
  const router = useRouter();

  const [empresa, setEmpresa] = useState<Empresa>(
    empresaExistente ||
      new Empresa(
        null,
        "",
        "",
        "",
        new Usuario(null, "", "", "", "ATIVO", "", ""),
      ),
  );

  const handleEmpresaChange = (
    campo: "nameFantasia" | "razaoSocial" | "cnpj",
    valor: string,
  ) => {
    setEmpresa((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleAdminChange = (
    campo: "name" | "email" | "senha" | "cpf",
    valor: string,
  ) => {
    setEmpresa((prev) => ({
      ...prev,
      usuarioAdmin: {
        ...prev.usuarioAdmin,
        [campo]: valor,
      },
    }));
  };

  const handleSalvar = async (formData: FormData) => {
    const isEdicao = !!empresaExistente;

    try {
      const sucesso = await salvarEmpresa(empresa, isEdicao);

      alert("ONG salva com sucesso!");
      router.push("/empresa");
    } catch (error) {
      console.log(error);
      alert(error instanceof Error ? error.message : "Erro ao salvar ONG");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
        <div className="bg-stone-50/50 px-10 py-8 border-b border-stone-100">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Cadastro de ONG
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Crie a conta da sua instituição para começar a gerenciar suas
            adoções.
          </p>
        </div>

        <form action={handleSalvar} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Nome Fantasia
              </label>
              <input
                type="text"
                required
                onChange={(e) =>
                  handleEmpresaChange("nameFantasia", e.target.value)
                }
                value={empresa.nameFantasia}
                placeholder="Ex: Abrigo dos Pets"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                CNPJ
              </label>
              <input
                type="text"
                required
                onChange={(e) => handleEmpresaChange("cnpj", e.target.value)}
                value={empresa.cnpj}
                placeholder="00.000.000/0000-00"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Razão Social
              </label>
              <input
                type="text"
                required
                onChange={(e) =>
                  handleEmpresaChange("razaoSocial", e.target.value)
                }
                value={empresa.razaoSocial}
                placeholder="Ex: Associação de Proteção Animal LTDA"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Nome Completo do Responsável
              </label>
              <input
                type="text"
                required
                onChange={(e) => handleAdminChange("name", e.target.value)}
                value={empresa.usuarioAdmin.name}
                placeholder="João da Silva"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                CPF do Responsável
              </label>
              <input
                type="text"
                required
                value={empresa.usuarioAdmin.cpf ?? ""}
                placeholder="000.000.000-00"
                onChange={(e) => handleAdminChange("cpf", e.target.value)}
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                E-mail de Login
              </label>
              <input
                type="email"
                autoComplete="off"
                required
                onChange={(e) => handleAdminChange("email", e.target.value)}
                value={empresa.usuarioAdmin.email}
                placeholder="admin@ong.com"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Senha
              </label>
              <input
                type="password"
                required
                onChange={(e) => handleAdminChange("senha", e.target.value)}
                value={empresa.usuarioAdmin.senha}
                placeholder="••••••••"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Link
              href="/empresa"
              className="flex-1 text-center py-4 rounded-2xl font-black text-slate-400 hover:text-slate-600 hover:bg-stone-50 transition-all"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-orange-100 active:scale-95"
            >
              Finalizar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
