"use client";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { RootState, store } from "../redux/store";

export default function SistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = useSelector((state: RootState) => state.auth.usuario);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const salvo = localStorage.getItem("sidebar-collapsed");
    if (salvo === "true") {
      setCollapsed(true);
    }
  }, []);

  // Área logada usa tamanho-base menor (13px em vez de 16px). Como o Tailwind usa rem,
  // fontes, paddings e larguras escalam juntos. Restaura ao sair do sistema.
  useEffect(() => {
    const html = document.documentElement;
    const anterior = html.style.fontSize;
    html.style.fontSize = "13px";
    return () => {
      html.style.fontSize = anterior;
    };
  }, []);

  useEffect(() => {
    if (mounted && usuario == null) {
      router.push("/login");
    }
  }, [mounted, usuario, router]);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-y-auto relative min-w-0">
        <Header onOpenMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 flex flex-col py-5 px-6 md:px-10">
          {/* zoom reduz o conteúdo de todas as telas do sistema de uma vez.
              Conteúdo alinhado ao topo para o botão "Voltar" ficar sempre na mesma posição. */}
          <div
            className="sistema-conteudo w-full max-w-7xl mx-auto flex-1 flex flex-col"
            style={{ zoom: 0.9 }}
          >
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
