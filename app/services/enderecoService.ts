import { EnderecoResponse } from "../types/endereco";
import api from "./api";
import axios from "axios";

export async function buscarEnderecoPorCep(
  cep: string,
): Promise<EnderecoResponse> {
  try {
    const response = await api.get<EnderecoResponse>(`/api/enderecos/${cep}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }

    throw new Error("Erro ao consultar o CEP.");
  }
}
