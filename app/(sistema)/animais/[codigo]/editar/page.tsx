"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AnimalForm from "../../components/animal-form";
import { ChevronLeft } from "lucide-react";
import { Animal } from "@/app/types/animal";
import { buscarAnimalPorId } from "@/app/services/animalService";

export default function EditarAnimal() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id || params.codigo);

  const [animal, setAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    async function carregar() {
      const data = await buscarAnimalPorId(id);
      if (data) setAnimal(data);
      else router.push("/animais");
    }
    if (id) carregar();
  }, [id, router]);

  if (!animal)
    return (
      <div className="p-8 text-slate-400 font-bold text-center">
        Carregando dados do pet...
      </div>
    );

  return (
    <div>
      <Link
        href="/animais"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-[#008080] font-black text-xs uppercase tracking-widest transition-colors"
      >
        <ChevronLeft size={16} strokeWidth={3} />
        Voltar para gestão de Animais
      </Link>

      <AnimalForm animalExistente={animal} />
    </div>
  );
}
