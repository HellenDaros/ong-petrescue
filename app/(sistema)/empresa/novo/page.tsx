import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import EmpresaForm from "../components/empresa-form";

export default function CadastrarEmpresa() {
  return (
    <div>
      <Link
        href="/empresa"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-[#008080] font-black text-xs uppercase tracking-widest transition-colors"
      >
        <ChevronLeft size={16} strokeWidth={3} />
        Voltar para Gestão de Empresas
      </Link>

      <EmpresaForm />
    </div>
  );
}
