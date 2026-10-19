import { EnderecoResponse } from "../types/endereco";
import { buscarEnderecoPorCep } from "../services/enderecoService";
import { onlyDigits } from "./masks";

// Consulta o CEP quando ele estiver completo. Retorna null se estiver incompleto ou se der erro (o erro é exibido ao usuário).
export async function consultarCep(cep: string): Promise<EnderecoResponse | null> {
  const cepLimpo = onlyDigits(cep);

  if (cepLimpo.length !== 8) {
    return null;
  }

  try {
    return await buscarEnderecoPorCep(cepLimpo);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
    return null;
  }
}
