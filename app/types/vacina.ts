export interface Vacina {
  id: number;
  nome: string;
}

export interface VacinaRequest {
  nome: string;
}

export interface VacinaSelectProps {
  value: string;
  onChange: (valor: string) => void;
}
