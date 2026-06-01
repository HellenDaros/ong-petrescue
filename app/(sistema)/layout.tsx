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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // debugger;
    if (isMounted && usuario == null) {
      router.push("/login");
    }
  }, [usuario, router, isMounted]);

  if (!isMounted) return null;

  if (usuario == null) return null;

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-y-auto relative">
        <Header />

        <main className="flex-1 flex flex-col justify-center py-8 px-6 md:px-12">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
