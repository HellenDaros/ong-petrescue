import { Dashboard } from "../types/dashboard";
import api from "./api";

export async function buscarDashboard(): Promise<Dashboard | null> {
  try {
    const response = await api.get<Dashboard>("/dashboard");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Erro ao buscar indicadores:", error);
  }
  return null;
}
