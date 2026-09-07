export interface SolicitacaoAdocaoRequest {
  animalId: number;
  enderecoAnimal: string;
  assinaturaBase64: string;
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
  enderecoAnimal: string;
  statusAdocao: "PENDENTE" | "APROVADO" | "REJEITADO";
  assinaturaBase64: string | null;
  dataSolicitacao: string;
}
