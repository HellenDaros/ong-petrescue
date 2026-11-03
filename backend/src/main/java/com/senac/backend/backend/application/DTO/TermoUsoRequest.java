package com.senac.backend.backend.application.DTO;

public record TermoUsoRequest(
        String titulo,
        String conteudo,
        boolean textoPadrao
) {
}
