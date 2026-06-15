"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  FileText,
  MapPin,
  Phone,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { salvarAdotante } from "@/app/services/adotanteService";
import { Adotante, AdotanteFormProps } from "@/app/types/adotante";

export default function AdotanteForm({ adotanteExistente }: AdotanteFormProps) {
  const router = useRouter();

  const [adotante, setAdotante] = useState<Adotante>(
    adotanteExistente ||
      new Adotante(
        null,
        "",
        "",
        "ATIVO",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ),
  );

  const handleChange = (
    campo:
      | "name"
      | "email"
      | "senha"
      | "cpf"
      | "identidade"
      | "endereco"
      | "bairro"
      | "cidade"
      | "uf"
      | "profissao"
      | "telefoneFixo"
      | "telefoneMovel",
    valor: string,
  ) => {
    setAdotante(
      (prev) =>
        new Adotante(
          prev.id,
          campo === "name" ? valor : prev.name,
          campo === "email" ? valor : prev.email,
          prev.status,
          campo === "senha" ? valor : prev.senha || "",
          campo === "cpf" ? valor : prev.cpf || "",
          campo === "identidade" ? valor : prev.identidade,
          campo === "endereco" ? valor : prev.endereco,
          campo === "bairro" ? valor : prev.bairro,
          campo === "cidade" ? valor : prev.cidade,
          campo === "uf" ? valor : prev.uf,
          campo === "profissao" ? valor : prev.profissao,
          campo === "telefoneFixo" ? valor : prev.telefoneFixo,
          campo === "telefoneMovel" ? valor : prev.telefoneMovel,
        ),
    );
  };

  const handleSalvar = async (formData: FormData) => {
    const isEdicao = !!adotanteExistente;
    const sucesso = await salvarAdotante(adotante, isEdicao);

    if (!sucesso) {
      alert("Erro ao salvar os dados. Tente novamente.");
      return;
    }

    alert(isEdicao ? "Perfil atualizado com sucesso!" : "Cadastro realizado!");
    router.push(isEdicao ? "/home" : "/login");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
        <div className="bg-stone-50/50 px-10 py-8 border-b border-stone-100">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {adotanteExistente ? "Meu Perfil" : "Crie sua Conta"}
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {adotanteExistente
              ? "Atualize suas informações para continuar."
              : "Preencha as informações para salvar o cadastro."}
          </p>
        </div>

        <form action={handleSalvar} className="p-10 space-y-5">
          {/* Acesso */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={adotante.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="João da Silva"
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
              value={adotante.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Senha
            </label>
            <input
              type="password"
              required={!adotanteExistente}
              value={adotante.senha}
              onChange={(e) => handleChange("senha", e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                CPF
              </label>
              <input
                type="text"
                required
                value={adotante.cpf ? adotante.cpf : ""}
                onChange={(e) => handleChange("cpf", e.target.value)}
                placeholder="000.000.000-00"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Identidade (RG)
              </label>
              <input
                type="text"
                required
                value={adotante.identidade}
                onChange={(e) => handleChange("identidade", e.target.value)}
                placeholder="00.000.000-0"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Profissão
            </label>
            <input
              type="text"
              required
              value={adotante.profissao}
              onChange={(e) => handleChange("profissao", e.target.value)}
              placeholder="Sua ocupação"
              className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Endereço
            </label>
            <input
              type="text"
              required
              value={adotante.endereco}
              onChange={(e) => handleChange("endereco", e.target.value)}
              placeholder="Rua, Número, Complemento"
              className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Bairro
            </label>
            <input
              type="text"
              required
              value={adotante.bairro}
              onChange={(e) => handleChange("bairro", e.target.value)}
              placeholder="Seu bairro"
              className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Cidade
              </label>
              <input
                type="text"
                required
                value={adotante.cidade}
                onChange={(e) => handleChange("cidade", e.target.value)}
                placeholder="Sua cidade"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                UF
              </label>
              <input
                type="text"
                required
                value={adotante.uf}
                onChange={(e) => handleChange("uf", e.target.value)}
                placeholder="Ex: SP"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Celular
              </label>
              <input
                type="text"
                required
                value={adotante.telefoneMovel}
                onChange={(e) => handleChange("telefoneMovel", e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Fixo
              </label>
              <input
                type="text"
                value={adotante.telefoneFixo}
                onChange={(e) => handleChange("telefoneFixo", e.target.value)}
                placeholder="(00) 0000-0000"
                className="w-full bg-stone-50 border-2 border-stone-50 focus:border-teal-500 focus:bg-white outline-none px-5 py-4 rounded-2xl text-slate-700 font-bold transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <button
              onClick={() => router.back()}
              className="flex-1 text-center py-4 rounded-2xl font-black text-slate-400 hover:text-slate-600 hover:bg-stone-50 transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-orange-100 active:scale-95"
            >
              {adotanteExistente ? "Salvar" : "Finalizar Cadastro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
