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
      const mensagem =
        typeof error.response.data === "string"
          ? error.response.data
          : "CEP não encontrado. Verifique o número informado.";
      throw new Error(mensagem);
    }

    throw new Error("Erro ao consultar o CEP.");
  }
}
