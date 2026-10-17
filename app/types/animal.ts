export class Animal {
  constructor(
    public id: number | null,
    public nameAnimal: string,
    public raca: string,
    public sexo: string,
    public idade: string,
    public urlFoto: string,
    public porte: string,
    public corPelagem: string,
    public castrado: string,
    public vermifugado: string,
    public vacinado: string,
    public vacinadoDescricao: string,
    public especie: string,
    public nameDoador: string,
    public telefoneDoador: string,
    public statusAnimal: string,
  ) {}
}

export interface AnimaisPaginados {
  content: Animal[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface FiltrosAnimais {
  codigo?: string;
  nome?: string;
  especie?: string;
  status?: string;
  ordenarPor?: "codigo" | "nome";
  direcao?: "asc" | "desc";
}

export interface FiltrosGaleria {
  nome: string;
  especie: string;
  direcao: "asc" | "desc";
}

export interface AnimalContextType {
  favoritos: Animal[];
  adicionarFavorito: (animal: Animal) => void;
  removerFavorito: (id: number) => void;
  isFavorito: (id: number) => boolean;
}

export interface AnimalFormProps {
  animalExistente?: Animal;
}
