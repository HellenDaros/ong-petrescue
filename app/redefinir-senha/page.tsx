"use client";

import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { redefinirSenha } from "../services/authService";

function RedefinirSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [salvando, setSalvando] = useState(false);

  const handleRedefinir = async (formData: FormData) => {
    const novaSenha = formData.get("novaSenha")?.toString() ?? "";
    const confirmacao = formData.get("confirmacao")?.toString() ?? "";

    if (!novaSenha.trim()) {
      alert("Informe a nova senha.");
      return;
    }

    if (novaSenha !== confirmacao) {
      alert("As senhas não conferem.");
      return;
    }

    setSalvando(true);
    try {
      await redefinirSenha({ token, novaSenha });
      alert("Senha redefinida com sucesso! Entre com a nova senha.");
      router.push("/login");
    } catch (error: any) {
      const mensagem =
        error.response?.data && typeof error.response.data === "string"
          ? error.response.data
          : "Não foi possível redefinir a senha. Tente novamente.";
      alert(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  const inputClass =
    "w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 outline-none text-xs font-bold text-slate-700 transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 group-hover:border-stone-300";
  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors";
  const labelClass =
    "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1";

  return (
    <div className="min-h-screen w-full bg-stone-50 flex flex-col justify-center items-center p-4">
      <div className="flex items-center gap-2 font-black text-teal-600 text-xl mb-4 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-700">
        <span className="tracking-tighter uppercase">I🧡PET</span>
      </div>

      <div className="w-full max-w-85 bg-white rounded-3xl shadow-xl shadow-stone-200/60 border border-stone-100 p-5 md:p-6 animate-in fade-in zoom-in duration-500">
        {!token ? (
          <div className="text-center space-y-3">
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Link inválido
            </h1>
            <p className="text-slate-500 text-[11px] font-medium leading-relaxed">
              Este link de recuperação está incompleto. Peça um novo link na
              tela de recuperação de senha.
            </p>
            <Link
              href="/esqueci-senha"
              className="inline-block text-[10px] font-black uppercase text-orange-500 hover:text-teal-600 underline underline-offset-4 decoration-2"
            >
              Pedir novo link
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                Nova senha
              </h1>
              <p className="text-slate-500 text-[11px] font-medium mt-0.5">
                Escolha uma nova senha para sua conta
              </p>
            </div>

            <form action={handleRedefinir} className="space-y-3">
              <div className="space-y-2">
                <label className={labelClass}>Nova senha</label>
                <div className="relative group">
                  <input
                    type="password"
                    name="novaSenha"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={inputClass}
                  />
                  <Lock className={iconClass} size={14} />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Confirmar senha</label>
                <div className="relative group">
                  <input
                    type="password"
                    name="confirmacao"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={inputClass}
                  />
                  <Lock className={iconClass} size={14} />
                </div>
              </div>

              <button
                type="submit"
                disabled={salvando}
                className="w-full py-2 mt-1 bg-slate-900 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-black text-xs shadow-xl shadow-slate-200 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.97]"
              >
                {salvando ? "Salvando..." : "Salvar nova senha"}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          </>
        )}

        <div className="mt-4 pt-3 border-t border-stone-100 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-tight text-orange-500 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft size={12} />
            Voltar para o login
          </Link>
        </div>
      </div>

      <p className="mt-4 text-stone-400 text-[9px] font-bold uppercase tracking-widest">
        © 2026 I🧡PET
      </p>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50 text-slate-500">
          Carregando...
        </div>
      }
    >
      <RedefinirSenhaContent />
    </Suspense>
  );
}
