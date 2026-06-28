import {
  SolicitacaoAdocaoRequest,
  SolicitacaoAdocaoResponse,
} from "../types/solicitacaoAdocao";
import api from "./api";

export async function criarSolicitacaoAdocao(
  request: SolicitacaoAdocaoRequest,
): Promise<boolean> {
  try {
    const response = await api.post("/adocoes", request);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Erro ao criar solicitação de adoção:", error);
    return false;
  }
}

export async function buscarMinhasAdocoes(): Promise<
  SolicitacaoAdocaoResponse[]
> {
  try {
    const response =
      await api.get<SolicitacaoAdocaoResponse[]>("/adocoes/minhas");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Erro ao buscar minhas adoções:", error);
  }
  return [];
}

export async function buscarAdocoesOng(): Promise<SolicitacaoAdocaoResponse[]> {
  try {
    const response = await api.get<SolicitacaoAdocaoResponse[]>("/adocoes/ong");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Erro ao buscar solicitações da ONG:", error);
  }
  return [];
}

export async function responderSolicitacaoAdocao(
  id: number,
  status: "APROVADO" | "REJEITADO",
): Promise<boolean> {
  try {
    const response = await api.put(`/adocoes/${id}/status`, null, {
      params: { status },
    });
    return response.status === 200;
  } catch (error) {
    console.error(`Erro ao responder solicitação de adoção ${id}:`, error);
    return false;
  }
}
