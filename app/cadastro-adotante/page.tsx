"use client";

import { useSearchParams } from "next/navigation";
import AdotanteForm from "../(sistema)/adotantes/components/AdotanteForm";
import { Suspense } from "react";

function CadastroAdotanteContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
      {/* zoom reduz a página toda; o AdotanteForm também é usado dentro do sistema, por isso não é alterado */}
      <div
        className="w-full flex flex-col items-center"
        style={{ zoom: 0.8 }}
      >
        <div className="flex items-center gap-2 font-black text-teal-600 text-2xl mb-4 mt-4 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="tracking-tighter uppercase">I🧡PET</span>
        </div>
        <AdotanteForm redirectTo={redirectTo} />
        <p className="mt-4 mb-4 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
          © 2026 I🧡PET
        </p>
      </div>
    </main>
  );
}

export default function CadastroAdotante() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-stone-50 text-slate-500">Carregando...</div>}>
      <CadastroAdotanteContent />
    </Suspense>
  );
}
