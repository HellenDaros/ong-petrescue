import axios from "axios";
import api from "./api";
import { AlterarStatusTermoRequest, Termo, TermoRequest } from "../types/termo";

const extrairErro = (error: unknown, padrao: string): Error => {
  if (axios.isAxiosError(error) && typeof error.response?.data === "string") {
    return new Error(error.response.data);
  }
  return new Error(padrao);
};

export const listarTermos = async (): Promise<Termo[]> => {
  const response = await api.get<Termo[]>("/termos");
  return response.data;
};

export const buscarTermosAtivosDoAnimal = async (
  animalId: number,
): Promise<Termo[]> => {
  const response = await api.get<Termo[]>("/termos/ativo", {
    params: { animalId },
  });
  return response.data;
};

export const cadastrarTermo = async (termo: TermoRequest): Promise<number> => {
  try {
    const response = await api.post<number>("/termos", termo);
    return response.data;
  } catch (error) {
    throw extrairErro(error, "Erro ao cadastrar termo. Tente novamente.");
  }
};

export const atualizarTermo = async (
  id: number,
  termo: TermoRequest,
): Promise<void> => {
  try {
    await api.put(`/termos/${id}`, termo);
  } catch (error) {
    throw extrairErro(error, "Erro ao atualizar termo. Tente novamente.");
  }
};

export const alterarStatusTermo = async (
  id: number,
  ativo: boolean,
): Promise<void> => {
  try {
    const request: AlterarStatusTermoRequest = { ativo };
    await api.put(`/termos/${id}/status`, request);
  } catch (error) {
    throw extrairErro(error, "Erro ao alterar o status do termo. Tente novamente.");
  }
};
