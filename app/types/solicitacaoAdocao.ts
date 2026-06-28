export interface SolicitacaoAdocaoRequest {
  animalId: number;
  enderecoAnimal: string;
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
    especie: string;
    urlFoto: string;
  };
  enderecoAnimal: string;
  statusAdocao: "PENDENTE" | "APROVADO" | "REJEITADO";
  dataSolicitacao: string;
}
