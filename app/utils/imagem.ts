const EXTENSOES_PERMITIDAS = ["jpg", "jpeg", "png", "webp"];
const TAMANHO_MAXIMO_MB = 5;

export function validarImagem(file: File): string | null {
  const extensao = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (!EXTENSOES_PERMITIDAS.includes(extensao)) {
    return "Formato de imagem inválido. Use JPG, PNG ou WEBP.";
  }

  if (file.size > TAMANHO_MAXIMO_MB * 1024 * 1024) {
    return `A imagem deve ter no máximo ${TAMANHO_MAXIMO_MB} MB.`;
  }

  return null;
}
