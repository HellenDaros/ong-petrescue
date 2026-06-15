import api from "./api";
import { Empresa } from "../types/empresa";

export async function salvarEmpresa(
  empresa: Empresa,
  isEdicao: boolean,
): Promise<boolean> {
  try {
    let response;

    if (isEdicao) {
      response = await api.put("/ong", empresa);
    } else {
      response = await api.post("/ong", empresa);
    }

    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Erro ao salvar empresa:", error);
    return false;
  }
}

export async function buscarEmpresaPorId(id: number): Promise<Empresa | null> {
  try {
    const response = await api.get<Empresa>(`/ong/${id}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(`Erro ao buscar empresa ${id}:`, error);
  }

  return null;
}

export async function buscarEmpresaLogada(): Promise<Empresa> {
  return (await api.get<Empresa>("/ong/empresalogada")).data;
}
