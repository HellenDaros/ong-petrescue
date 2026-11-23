"use client";
import { PawPrint } from "lucide-react";
import { useState } from "react";
import { FotoAnimalProps } from "@/app/types/animal";

export default function FotoAnimal({
  urlFoto,
  alt,
  className = "",
}: FotoAnimalProps) {
  const [falhou, setFalhou] = useState(false);

  if (!urlFoto || falhou) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300"
      >
        <PawPrint className="w-1/2 h-1/2" strokeWidth={1.75} />
      </div>
    );
  }

  return (
    <img
      src={urlFoto}
      alt={alt}
      className={className}
      onError={() => setFalhou(true)}
    />
  );
}
