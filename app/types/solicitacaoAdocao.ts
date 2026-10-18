export interface SolicitacaoAdocaoRequest {
  animalId: number;
  cep: string;
  complemento: string;
  assinaturaBase64: string;
}

export interface FiltrosAdocoes {
  codigo?: string;
  pet?: string;
  especie?: string;
  adotante?: string;
  cidade?: string;
  bairro?: string;
  status?: string;
  dataInicio?: string; // YYYY-MM-DD
  dataFim?: string; // YYYY-MM-DD
  ordenarPor?: "codigo" | "pet" | "adotante";
  direcao?: "asc" | "desc";
}

export interface SolicitacoesPaginadas {
  content: SolicitacaoAdocaoResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface SolicitacaoAdocaoResponse {
  id: number;
  adotante: {
    id: number;
    name: string;
    email: string;
    cpf: string | null;
    identidade: string;
    endereco: string;
    bairro: string;
    cidade: string;
    uf: string;
    complemento: string | null;
    profissao: string;
    telefoneFixo: string;
    telefoneMovel: string;
  };
  animal: {
    id: number;
    nameAnimal: string;
    raca: string;
    idade: string;
    especie: string;
    urlFoto: string;
    castrado: string;
    vermifugado: string;
    vacinado: string;
    vacinadoDescricao: string | null;
  };
  cep: string | null;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  complemento: string | null;
  statusAdocao: "PENDENTE" | "APROVADO" | "REJEITADO";
  assinaturaBase64: string | null;
  dataSolicitacao: string;
}

export function formatarEnderecoAdocao(adocao: SolicitacaoAdocaoResponse): string {
  const endereco = [
    adocao.endereco,
    adocao.complemento,
    adocao.bairro,
    adocao.cidade && adocao.uf ? `${adocao.cidade} - ${adocao.uf}` : adocao.cidade,
  ]
    .filter(Boolean)
    .join(", ");

  return endereco || "-";
}
