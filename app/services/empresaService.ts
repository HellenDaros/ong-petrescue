import api from "./api";
import { Empresa } from "../types/empresa";
import axios from "axios";

export async function salvarEmpresa(
  empresa: Empresa,
  isEdicao: boolean,
): Promise<boolean> {
  try {
    let response;

    if (isEdicao) {
      response = await api.put("/empresa", empresa);
    } else {
      response = await api.post("/empresa", empresa);
    }

    return response.status === 200 || response.status === 201;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data);
    }
    throw error;
  }
}

// export async function buscarEmpresaPorId(id: number): Promise<Empresa | null> {
//   try {
//     const response = await api.get<Empresa>(`/empresa/${id}`);

//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     console.error(`Erro ao buscar empresa ${id}:`, error);
//   }

//   return null;
// }

export async function buscarEmpresaLogada(): Promise<Empresa> {
  return (await api.get<Empresa>("/empresa/empresalogada")).data;
}
