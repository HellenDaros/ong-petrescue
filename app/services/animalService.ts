import api from "./api";
import { Animal } from "../types/animal";

export async function buscarListaAnimais(): Promise<Animal[]> {
  try {
    const response = await api.get<Animal[]>("/animais");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Erro ao buscar lista de animais:", error);
  }
  return [];
}

export async function buscarListaAnimaisPublico(): Promise<Animal[]> {
  try {
    const response = await api.get<Animal[]>("/animais/publicos");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Erro ao buscar lista de animais:", error);
  }
  return [];
}

export async function buscarAnimalPorId(id: number): Promise<Animal | null> {
  try {
    const response = await api.get<Animal>(`/animais/${id}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(`Erro ao buscar animal ${id}:`, error);
  }
  return null;
}

export async function alterarStatusAnimal(animal: Animal): Promise<boolean> {
  try {
    const novoStatus =
      animal.statusAnimal === "DISPONIVEL" ? "INATIVO" : "DISPONIVEL";
    const payload = { statusAnimal: novoStatus };

    const response = await api.put(
      `/animais/${animal.id}/AlterarStatusAnimal`,
      payload,
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro na requisição de alteração de status:", error);
    return false;
  }
}

export async function salvarAnimal(
  animal: Animal,
  isEdicao: boolean,
): Promise<boolean> {
  try {
    let response;
    if (isEdicao) {
      response = await api.put(`/animais/${animal.id}`, animal);
    } else {
      response = await api.post("/animais", animal);
    }

    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Erro ao salvar animal:", error);
    return false;
  }
}
