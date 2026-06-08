import Link from "next/link";
import UsuarioForm from "../components/UsuarioForm";
import { ChevronLeft } from "lucide-react";

export default function cadastrarUsuario() {
  return (
    <div>
      <Link
        href="/usuarios"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-[#008080] font-black text-xs uppercase tracking-widest transition-colors"
      >
        <ChevronLeft size={16} strokeWidth={3} />
        Voltar para gestão de Usuários
      </Link>
      <UsuarioForm />
    </div>
  );
}
