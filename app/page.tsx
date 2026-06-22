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

export default function LandingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const usuario = useSelector((state: RootState) => state.auth.usuario);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 font-sans selection:bg-teal-100">
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-teal-600 text-2xl tracking-tight group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-teal-600 group-hover:scale-110 transition-transform"
            >
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001Z" />
            </svg>
            <span>
              PET
              <span className="text-orange-500 underline decoration-2 underline-offset-4">
                RESCUE
              </span>
            </span>
          </Link>

          <div className="hidden md:flex gap-8 font-medium text-slate-600">
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
                <div className="flex items-center gap-2 bg-slate-900 hover:bg-teal-600 text-white px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-orange-200">
                  <span>Acessar Minha Conta</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="group relative flex items-center"
              >
                <div className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-red-200">
                  <span>Sair</span>
                </div>
              </button>
            </div>
          ) : (
            <Link href="/login" className="group relative flex items-center">
              <div className="flex items-center gap-2 bg-slate-900 hover:bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-orange-200">
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

      <header className="relative min-h-screen flex items-center justify-center bg-teal-700 text-white overflow-hidden pt-32 pb-12 md:pt-40">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=2000"
            alt="Resgate animal"
            className="w-full h-full object-cover mix-blend-overlay opacity-50"
          />
        </div>
        <div className="relative z-10 text-center px-2 max-w-4xl">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-fade-in">
            🐶 Unindo ONGs e Adotantes em uma só rede
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tighter">
            Amor não se compra, <br />
            <span className="text-orange-400">se adota.</span>
          </h1>

          <p className="text-lg md:text-2xl mb-10 text-teal-50 max-w-2xl mx-auto leading-relaxed opacity-90">
            Conectamos ONGs comprometidas a pessoas que buscam transformar vidas
            através da adoção responsável.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/cadastro-adotante"
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 md:py-5 px-8 md:px-10 rounded-2xl text-lg shadow-xl transition-all hover:scale-105 active:scale-95 text-center"
            >
              Ser um adotante
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-white hover:bg-teal-50 text-teal-700 font-bold py-4 md:py-5 px-8 md:px-10 rounded-2xl text-lg shadow-xl transition-all border-b-4 border-stone-200 active:border-b-0 text-center"
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
        className="bg-slate-900 py-24 px-6 rounded-[3rem] mx-4 mb-24 text-white text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 leading-tight">
            Como funciona o <span className="text-teal-400">PetRescue</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h4 className="text-orange-400 font-bold mb-4">Para ONGs</h4>
              <p className="text-slate-400 text-sm">
                Um painel exclusivo para gerenciar seus animais e adotantes de
                forma 100% privada e segura.
              </p>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h4 className="text-teal-400 font-bold mb-4">Para Adotantes</h4>
              <p className="text-slate-400 text-sm">
                Crie seu perfil, candidate-se a adoções e acompanhe o status da
                sua aprovação em tempo real.
              </p>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h4 className="text-blue-400 font-bold mb-4">Privacidade</h4>
              <p className="text-slate-400 text-sm">
                O sistema garante que cada ONG tenha visibilidade apenas dos
                seus próprios dados e processos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="contato"
        className="bg-stone-50 py-16 px-6 border-t border-stone-200"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 font-black text-teal-600 text-2xl mb-4">
              <span>PETRESCUE</span>
            </div>
            <p className="text-slate-500 max-w-xs">
              Plataforma dedicada a conectar ONGs e adotantes para salvar vidas.
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="#"
              className="p-3 bg-white shadow-sm rounded-full text-slate-400 hover:text-teal-600 transition duration-300"
            >
              <Instagram />
            </Link>
            <Link
              href="#"
              className="p-3 bg-white shadow-sm rounded-full text-slate-400 hover:text-teal-600 transition duration-300"
            >
              <Facebook />
            </Link>
          </div>
          <div className="text-center md:text-right text-slate-400 text-sm">
            © {new Date().getFullYear()} PetRescue. <br /> Todos os direitos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
