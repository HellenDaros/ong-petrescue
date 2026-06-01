"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  adicionarFavorito,
  removerFavorito,
  setFavoritos,
} from "../redux/slices/favoritoSlice";
import { Animal } from "../types/animal";
import { useEffect } from "react";
import { buscarListaAnimais } from "../services/animalService";

export const useFavoritos = () => {
  const dispatch = useDispatch();
  const favoritos = useSelector((state: RootState) => state.favoritos.items);
  const token = useSelector((state: RootState) => state.auth.token);

  const sincronizar = async () => {
    if (!token || favoritos.length === 0) return;

    try {
      const animaisServidor = await buscarListaAnimais();
      if (animaisServidor.length === 0) return;

      const favsAtualizados = favoritos.map((favLocal) => {
        const animalNoServidor = animaisServidor.find(
          (s) => s.id === favLocal.id,
        );
        return animalNoServidor ? animalNoServidor : favLocal;
      });

      dispatch(setFavoritos({ items: favsAtualizados }));
    } catch (e) {
      console.error("Erro ao sincronizar favoritos:", e);
    }
  };

  useEffect(() => {
    sincronizar();
    const intervalo = setInterval(sincronizar, 30000);
    return () => clearInterval(intervalo);
  }, [token]);

  return {
    favoritos,
    addFavorito: (animal: Animal) => dispatch(adicionarFavorito({ animal })),
    removeFavorito: (id: number) => dispatch(removerFavorito({ id })),
    isFavorito: (id: number) => favoritos.some((fav) => fav.id === id),
  };
};
