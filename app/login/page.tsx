"use client";

import { Mail, Lock, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginService } from "../services/authService";
import { useDispatch } from "react-redux";
import { setToken, setUsuario } from "../redux/slices/authSlice";
import { buscarUsuarioLogado } from "../services/usuarioService";
import Link from "next/link";
import { Suspense } from "react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const redirectTo = searchParams.get("redirectTo");

  const handleLogin = async (formData: FormData) => {
    const email = formData.get("email")?.toString() ?? "";
    const senha = formData.get("senha")?.toString() ?? "";

    try {
      const loginResult = await loginService({ email: email, senha: senha });
      if (!loginResult.token) {
        alert("Usuario ou senha invalido!");
        return;
      }
      var token = loginResult.token;
      dispatch(
        setToken({
          token: token,
        }),
      );
      const usuario = await buscarUsuarioLogado();

      dispatch(
        setUsuario({
          usuario: { ...usuario },
        }),
      );

      router.push(redirectTo || "/home");
    } catch (error) {
      console.error("Erro ao entrar no sistema:", error);
      alert("Erro ao entrar no sistema");
    }
  };

  const registerLink = redirectTo
    ? `/cadastro-adotante?redirectTo=${encodeURIComponent(redirectTo)}`
    : "/cadastro-adotante";

  return (
    <div className="min-h-screen w-full bg-stone-50 flex flex-col justify-center items-center p-6">
      <div className="flex items-center gap-2 font-black text-teal-600 text-3xl mb-8 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-10 h-10"
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001Z" />
        </svg>
        <span className="tracking-tighter uppercase">
          PET
          <span className="text-orange-500 underline decoration-4 underline-offset-4">
            RESCUE
          </span>
        </span>
      </div>

      <div className="w-full max-w-[450px] bg-white rounded-[3rem] shadow-2xl shadow-stone-200/60 border border-stone-100 p-8 md:p-12 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Bem-vindo!
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2">
            Acesse sua conta para continuar
          </p>
        </div>

        <form action={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              E-mail
            </label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                placeholder="exemplo@email.com"
                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-stone-50 border border-stone-200 outline-none text-sm font-bold text-slate-700 transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 group-hover:border-stone-300"
              />
              <Mail
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                size={20}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Senha
              </label>
            </div>
            <div className="relative group">
              <input
                type="password"
                name="senha"
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-stone-50 border border-stone-200 outline-none text-sm font-bold text-slate-700 transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 group-hover:border-stone-300"
              />
              <Lock
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                size={20}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-slate-900 hover:bg-teal-600 text-white rounded-[1.5rem] font-black text-base shadow-xl shadow-slate-200 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.97]"
          >
            Acessar Sistema
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-stone-100 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">
            Ainda não tem conta?
            <Link
              href={registerLink}
              className="ml-2 text-orange-500 font-black hover:text-teal-600 transition-colors underline underline-offset-4 decoration-2"
            >
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
        © 2026 PetRescue
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-stone-50 text-slate-500">Carregando...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
