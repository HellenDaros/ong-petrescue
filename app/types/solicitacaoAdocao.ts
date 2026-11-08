export interface SolicitacaoAdocaoRequest {
  animalId: number;
  cep: string;
  complemento: string;
  assinaturaBase64: string;
  termoIds: number[];
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
    sexo: string;
    idade: string;
    porte: string;
    corPelagem: string;
    especie: string;
    urlFoto: string;
    castrado: string;
    vermifugado: string;
    vacinado: string;
    vacinadoDescricao: string | null;
  };
  ongNome: string | null;
  cep: string | null;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  complemento: string | null;
  statusAdocao: "PENDENTE" | "APROVADO" | "REJEITADO";
  assinaturaBase64: string | null;
  termosTitulos: string[];
  textoPadraoTitulo: string | null;
  textoPadraoConteudo: string | null;
  motivoRecusa: string | null;
  dataSolicitacao: string;
}

export interface SolicitacaoConcorrente {
  id: number;
  adotanteNome: string;
}

export interface FichaAdocaoModalProps {
  solicitacao: SolicitacaoAdocaoResponse;
  onFechar: () => void;
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
