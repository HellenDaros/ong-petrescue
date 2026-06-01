"use client";
import { useEffect } from "react";
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

  useEffect(() => {
    // debugger;
    if (usuario == null) {
      router.push("/login");
    }
  });

  if (usuario == null) return null;

  return (
    /* h-screen impede o scroll na sidebar enquanto o conteúdo rola */
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* 1. Sidebar fixa na lateral */}
      <Sidebar />

      {/* 2. Área de conteúdo: Header + Main + Footer */}
      <div className="flex flex-col flex-1 overflow-y-auto relative">
        {/* O Header agora vive dentro deste container flexível,
            então ele automaticamente respeita a largura da Sidebar. */}
        <Header />

        {/* 3. Main com flex-1 para ocupar o espaço entre Header e Footer.
            Usamos justify-center para centralizar verticalmente o conteúdo. */}
        <main className="flex-1 flex flex-col justify-center py-8 px-6 md:px-12">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
