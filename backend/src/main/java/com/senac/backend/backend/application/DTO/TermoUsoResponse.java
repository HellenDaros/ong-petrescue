package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.entities.TermoUso;

import java.time.LocalDateTime;

public record TermoUsoResponse(
        Long id,
        String titulo,
        String conteudo,
        boolean ativo,
        boolean textoPadrao,
        LocalDateTime dataAtualizacao
) {
    public TermoUsoResponse(TermoUso termo) {
        this(termo.getId(), termo.getTitulo(), termo.getConteudo(), termo.isAtivo(), termo.isTextoPadrao(), termo.getDataAtualizacao());
    }
}
