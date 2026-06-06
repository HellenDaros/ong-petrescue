import api from "./api";
import { Adotante } from "../types/adotante";

export async function salvarAdotante(
  adotante: Adotante,
  isEdicao: boolean,
): Promise<boolean> {
  try {
    let response;

    if (isEdicao && adotante.id) {
      response = await api.put(`/adotantes/${adotante.id}`, adotante);
    } else {
      response = await api.post("/adotantes", adotante);
    }

    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Erro ao salvar adotante:", error);
    return false;
  }
}

export async function buscarAdotantePorId(
  id: number,
): Promise<Adotante | null> {
  try {
    const response = await api.get<Adotante>(`/adotantes/${id}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(`Erro ao buscar adotante ${id}:`, error);
  }

  return null;
}
