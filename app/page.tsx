"use client";
import {
  Heart,
  Dog,
  Cat,
  User,
  ArrowRight,
  Instagram,
  Facebook,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/slices/authSlice";
import { RootState } from "./redux/store";
import GaleriaPublica from "./components/Galeria";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const usuario = useSelector((state: RootState) => state.auth.usuario);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 font-sans selection:bg-teal-100">
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 px-6 py-2">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-teal-600 text-xl tracking-tight group"
          >
            <span>
              I🧡PET
            </span>
          </Link>

          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link href="#sobre" className="hover:text-teal-600 transition">
              Como Funciona
            </Link>
            <Link href="#galeria" className="hover:text-teal-600 transition">
              Galeria
            </Link>
            <Link href="#contato" className="hover:text-teal-600 transition">
              Contato
            </Link>
          </div>

          {usuario ? (
            <div className="flex items-center gap-3">
              <Link href="/home" className="group relative flex items-center">
                <div className="flex items-center gap-2 bg-slate-900 hover:bg-teal-600 text-white px-4 py-2 text-sm rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-orange-200">
                  <span>Acessar Minha Conta</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="group relative flex items-center"
              >
                <div className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-red-200">
                  <span>Sair</span>
                </div>
              </button>
            </div>
          ) : (
            <Link href="/login" className="group relative flex items-center">
              <div className="flex items-center gap-2 bg-slate-900 hover:bg-orange-500 text-white px-4 py-2 text-sm rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-orange-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                Login
              </div>
            </Link>
          )}
        </div>
      </nav>

      <header className="relative min-h-screen flex items-center justify-center bg-teal-700 text-white overflow-hidden pt-24 pb-10 md:pt-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=2000"
            alt="Resgate animal"
            className="w-full h-full object-cover mix-blend-overlay opacity-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold mb-4 animate-fade-in">
            🐶 Unindo ONGs e Adotantes em uma só rede
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tighter">
            Amor não se compra, <br />
            <span className="text-orange-400">se adota.</span>
          </h1>

          <p className="text-sm md:text-lg mb-6 text-teal-50 max-w-xl mx-auto leading-relaxed opacity-90">
            Conectamos ONGs comprometidas a pessoas que buscam transformar vidas
            através da adoção responsável.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/cadastro-adotante"
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-xl text-sm shadow-xl transition-all hover:scale-105 active:scale-95 text-center"
            >
              Ser um adotante
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-white hover:bg-teal-50 text-teal-700 font-bold py-2.5 md:py-3 px-6 md:px-8 rounded-xl text-sm shadow-xl transition-all border-b-4 border-stone-200 active:border-b-0 text-center"
            >
              Já tenho uma conta
            </Link>
          </div>
        </div>
      </header>

      <section id="galeria">
        <GaleriaPublica />
      </section>

      <section
        id="sobre"
        className="bg-slate-900 py-10 px-6 w-full mb-10 text-white text-center"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-black mb-6 leading-tight">
            Como funciona o <span className="text-teal-400">I🧡PET</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <h4 className="text-orange-400 font-bold text-sm mb-2">Para ONGs</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Um painel exclusivo para gerenciar seus animais e adotantes de
                forma 100% privada e segura.
              </p>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <h4 className="text-teal-400 font-bold text-sm mb-2">Para Adotantes</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Crie seu perfil, candidate-se a adoções e acompanhe o status da
                sua aprovação em tempo real.
              </p>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <h4 className="text-blue-400 font-bold text-sm mb-2">Privacidade</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                O sistema garante que cada ONG tenha visibilidade apenas dos
                seus próprios dados e processos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="contato"
        className="bg-stone-50 py-5 px-6 border-t border-stone-200"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 font-black text-teal-600 text-lg mb-1">
              <span>I🧡PET</span>
            </div>
            <p className="text-slate-500 text-xs max-w-xs">
              Plataforma dedicada a conectar ONGs e adotantes para salvar vidas.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="#"
              className="p-2 bg-white shadow-sm rounded-full text-slate-400 hover:text-teal-600 transition duration-300"
            >
              <Instagram size={16} />
            </Link>
            <Link
              href="#"
              className="p-2 bg-white shadow-sm rounded-full text-slate-400 hover:text-teal-600 transition duration-300"
            >
              <Facebook size={16} />
            </Link>
          </div>
          <div className="text-center md:text-right text-slate-400 text-xs leading-relaxed">
            © {new Date().getFullYear()} I🧡PET. <br /> Todos os direitos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
