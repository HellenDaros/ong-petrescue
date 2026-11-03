import axios from "axios";
import api from "./api";
import { Vacina, VacinaRequest } from "../types/vacina";

const extrairErro = (error: unknown, padrao: string): Error => {
  if (axios.isAxiosError(error) && typeof error.response?.data === "string") {
    return new Error(error.response.data);
  }
  return new Error(padrao);
};

export const listarVacinas = async (): Promise<Vacina[]> => {
  const response = await api.get<Vacina[]>("/vacinas");
  return response.data;
};

export const cadastrarVacina = async (
  vacina: VacinaRequest,
): Promise<Vacina> => {
  try {
    const response = await api.post<Vacina>("/vacinas", vacina);
    return response.data;
  } catch (error) {
    throw extrairErro(error, "Erro ao cadastrar vacina. Tente novamente.");
  }
};

export const atualizarVacina = async (
  id: number,
  vacina: VacinaRequest,
): Promise<Vacina> => {
  try {
    const response = await api.put<Vacina>(`/vacinas/${id}`, vacina);
    return response.data;
  } catch (error) {
    throw extrairErro(error, "Erro ao atualizar vacina. Tente novamente.");
  }
};
