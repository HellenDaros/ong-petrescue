package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.entities.SolicitacaoAdocao;

public record SolicitacaoConcorrenteResponse(
        Long id,
        String adotanteNome
) {
    public SolicitacaoConcorrenteResponse(SolicitacaoAdocao solicitacao) {
        this(solicitacao.getId(), solicitacao.getAdotante().getUsuario().getName());
    }
}
