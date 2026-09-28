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
    } catch (error: any) {
      const mensagem =
        error.response?.data && typeof error.response.data === "string"
          ? error.response.data
          : "Erro ao entrar no sistema";
      alert(mensagem);
    }
  };

  const registerLink = redirectTo
    ? `/cadastro-adotante?redirectTo=${encodeURIComponent(redirectTo)}`
    : "/cadastro-adotante";

  return (
    <div className="min-h-screen w-full bg-stone-50 flex flex-col justify-center items-center p-4">
      <div className="flex items-center gap-2 font-black text-teal-600 text-xl mb-4 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-700">
        
        <span className="tracking-tighter uppercase">
          I🧡PET
        </span>
      </div>

      <div className="w-full max-w-85 bg-white rounded-3xl shadow-xl shadow-stone-200/60 border border-stone-100 p-5 md:p-6 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-4">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            Bem-vindo!
          </h1>
          <p className="text-slate-500 text-[11px] font-medium mt-0.5">
            Acesse sua conta para continuar
          </p>
        </div>

        <form action={handleLogin} className="space-y-3">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              E-mail
            </label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                placeholder="exemplo@email.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 outline-none text-xs font-bold text-slate-700 transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 group-hover:border-stone-300"
              />
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                size={14}
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
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 outline-none text-xs font-bold text-slate-700 transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 group-hover:border-stone-300"
              />
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                size={14}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-1 bg-slate-900 hover:bg-teal-600 text-white rounded-xl font-black text-xs shadow-xl shadow-slate-200 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.97]"
          >
            Acessar Sistema
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-stone-100 text-center">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">
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

      <p className="mt-4 text-stone-400 text-[9px] font-bold uppercase tracking-widest">
        © 2026 I🧡PET
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50 text-slate-500">
          Carregando...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
