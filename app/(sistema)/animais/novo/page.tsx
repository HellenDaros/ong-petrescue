"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AnimalForm from "../components/animal-form";

export default function CadastrarAnimalPage() {
  return (
    <main>
      <div>
        <div>
          <Link
            href="/animais"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#008080] font-black text-xs uppercase tracking-widest transition-colors"
          >
            <ChevronLeft size={16} strokeWidth={3} />
            Voltar para gestão de Animais
          </Link>
        </div>

        <AnimalForm />
      </div>
    </main>
  );
}
