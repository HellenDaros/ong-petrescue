import {
  FiltrosAdocoes,
  SolicitacaoAdocaoRequest,
  SolicitacaoAdocaoResponse,
  SolicitacaoConcorrente,
  SolicitacoesPaginadas,
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

export async function buscarAdocoesOng(
  pagina: number = 0,
  tamanho: number = 10,
  filtros: FiltrosAdocoes = {},
  paginado: boolean = true,
): Promise<SolicitacoesPaginadas> {
  const response = await api.get<SolicitacoesPaginadas>("/adocoes/ong", {
    params: { pagina, tamanho, ...filtros, paginado },
  });
  return response.data;
}

export async function buscarConcorrentes(
  id: number,
): Promise<SolicitacaoConcorrente[]> {
  const response = await api.get<SolicitacaoConcorrente[]>(
    `/adocoes/${id}/concorrentes`,
  );
  return response.data;
}

export async function responderSolicitacaoAdocao(
  id: number,
  status: "APROVADO" | "REJEITADO",
  motivo?: string,
): Promise<boolean> {
  try {
    const response = await api.put(
      `/adocoes/${id}/status`,
      { motivo: motivo || null },
      { params: { status } },
    );
    return response.status === 200;
  } catch (error) {
    console.error(`Erro ao responder solicitação de adoção ${id}:`, error);
    return false;
  }
}
