"use client";

import { useSearchParams } from "next/navigation";
import AdotanteForm from "../(sistema)/adotantes/components/AdotanteForm";
import { Suspense } from "react";

function CadastroAdotanteContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 mb-6">
      <div className="flex items-center gap-2 font-black text-teal-600 text-3xl mb-8 mt-8 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-10 h-10"
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001Z" />
        </svg>
        <span className="tracking-tighter uppercase">
          PET
          <span className="text-orange-500 underline decoration-4 underline-offset-4">
            RESCUE
          </span>
        </span>
      </div>
      <AdotanteForm redirectTo={redirectTo} />
      <p className="mt-8 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
        © 2026 PetRescue
      </p>
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
