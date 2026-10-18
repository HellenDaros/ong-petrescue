export function valoresUnicos(valores: (string | null | undefined)[]): string[] {
  return [...new Set(valores.filter((valor): valor is string => !!valor))].sort();
}
