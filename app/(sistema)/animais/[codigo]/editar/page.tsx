// 'use client'
// import { Animal } from "@/app/context/AnimalContext"
// import Link from "next/link"
// import { useParams, useRouter } from "next/navigation"
// import { useEffect, useState } from "react"
// import AnimalForm from "../../components/animal-form"
// import axios from "axios"

// export default function EditarAnimal() {
//     const params = useParams()
//     const router = useRouter()

//     const id = Number(params.id || params.codigo)

//     const [animal, setAnimal] = useState<Animal | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (id) {
//             buscarDados();
//         }
//     }, [id])

//     const buscarDados = async () => {
//         try {
//             const response = await axios.get<Animal>(`http://localhost:8080/animais/${id}`)

//             if (response.data) {
//                 setAnimal(response.data)
//             } else {
//                 router.push("/animais")
//             }
//         } catch (error) {
//             console.error("Erro ao buscar pet:", error)
//             router.push("/animais")
//         } finally {
//             setLoading(false)
//         }
//     }

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-[#BDB2FF]/5">
//                 <div className="flex flex-col items-center gap-4">
//                     <div className="w-12 h-12 border-4 border-[#BDB2FF] border-t-transparent rounded-full animate-spin"></div>
//                     <p className="text-[#BDB2FF] font-black uppercase tracking-widest text-xs">Carregando Pet...</p>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-[#BDB2FF]/5 py-20 px-6 font-[family-name:var(--font-poppins)]">
//             <div className="max-w-2xl mx-auto">

//                 <div className="flex flex-col items-start mb-8 gap-4">
//                     <Link
//                         href="/animais"
//                         className="flex items-center gap-2 text-[#BDB2FF] font-black text-sm uppercase tracking-widest hover:translate-x-[-4px] transition-all"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
//                         Voltar para Galeria
//                     </Link>

//                     <div className="flex items-end gap-3">
//                         <h1 className="text-slate-800 text-4xl md:text-5xl font-[900] tracking-tighter leading-tight">
//                             Editar <span className="text-[#FF69EB]">{animal?.nameAnimal}</span>
//                         </h1>
//                         <span className="mb-2 px-3 py-1 bg-white rounded-lg text-[10px] font-black text-slate-400 border border-slate-100 shadow-sm">
//                             ID #{id}
//                         </span>
//                     </div>
//                 </div>

//                 {animal && <AnimalForm animalExistente={animal} />}

//             </div>
//         </div>
//     )
// }
"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AnimalForm from "../../components/animal-form";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { Animal } from "@/app/types/animal";
import { buscarAnimalPorId } from "@/app/services/animalService";

export default function EditarAnimal() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id || params.codigo);

  const [animal, setAnimal] = useState<Animal | null>(null);

  // useEffect(() => {
  //     const buscarDados = async () => {
  //         try {
  //             const response = await axios.get<Animal>(`http://localhost:8080/animais/${id}`)
  //             if (response.data) {
  //                 setAnimal(response.data)
  //             } else {
  //                 router.push("/animais")
  //             }
  //         } catch (error) {
  //             router.push("/animais")
  //         }
  //     };
  //     if (id) buscarDados();
  // }, [id, router])

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
