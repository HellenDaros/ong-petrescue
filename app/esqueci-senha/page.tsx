"use client";

import { Mail, ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { solicitarRecuperacaoSenha } from "../services/authService";

export default function EsqueciSenhaPage() {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleEnviar = async (formData: FormData) => {
    const email = formData.get("email")?.toString().trim() ?? "";

    if (!email) {
      alert("Informe o e-mail.");
      return;
    }

    setEnviando(true);
    try {
      await solicitarRecuperacaoSenha({ email });
      setEnviado(true);
    } catch (error: any) {
      const mensagem =
        error.response?.data && typeof error.response.data === "string"
          ? error.response.data
          : "Não foi possível enviar o e-mail. Tente novamente.";
      alert(mensagem);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-50 flex flex-col justify-center items-center p-4">
      <div className="flex items-center gap-2 font-black text-teal-600 text-xl mb-4 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-700">
        <span className="tracking-tighter uppercase">I🧡PET</span>
      </div>

      <div className="w-full max-w-85 bg-white rounded-3xl shadow-xl shadow-stone-200/60 border border-stone-100 p-5 md:p-6 animate-in fade-in zoom-in duration-500">
        {enviado ? (
          <div className="text-center space-y-3">
            <div className="mx-auto w-11 h-11 rounded-2xl bg-teal-50 flex items-center justify-center">
              <MailCheck className="text-teal-600" size={20} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Confira seu e-mail
            </h1>
            <p className="text-slate-500 text-[11px] font-medium leading-relaxed">
              Se o e-mail estiver cadastrado, você vai receber um link para
              criar uma nova senha. O link vale por 30 minutos. Olhe também a
              caixa de spam.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                Esqueceu a senha?
              </h1>
              <p className="text-slate-500 text-[11px] font-medium mt-0.5">
                Informe seu e-mail e enviaremos um link para redefinir
              </p>
            </div>

            <form action={handleEnviar} className="space-y-3">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  E-mail
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="exemplo@email.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 outline-none text-xs font-bold text-slate-700 transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 group-hover:border-stone-300"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                    size={14}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full py-2 mt-1 bg-slate-900 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-black text-xs shadow-xl shadow-slate-200 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.97]"
              >
                {enviando ? "Enviando..." : "Enviar link"}
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
