"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UsuarioForm from "../../components/UsuarioForm";
import { Usuario } from "@/app/types/usuarios";
import { buscarUsuarioPorId } from "@/app/services/usuarioService";
import { ChevronLeft } from "lucide-react";

export default function EditarUsuario() {
  const params = useParams();
  const router = useRouter();
  const codigo = Number(params.codigo);

  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    const user = await buscarUsuarioPorId(codigo);

    if (user) {
      setUsuario(user);
    } else {
      router.push("/usuarios");
    }
  };
  if (!usuario) return <div className="p-8">Carregando dados...</div>;
  return (
    <div>
      <Link
        href="/usuarios"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-[#008080] font-black text-xs uppercase tracking-widest transition-colors"
      >
        <ChevronLeft size={16} strokeWidth={3} />
        Voltar para gestão de Usuários
      </Link>
      <UsuarioForm usuarioExistente={usuario} />
    </div>
  );
}
