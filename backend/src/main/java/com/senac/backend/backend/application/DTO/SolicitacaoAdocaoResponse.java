package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.entities.SolicitacaoAdocao;
import java.time.LocalDateTime;

public record SolicitacaoAdocaoResponse(
        Long id,
        AdotanteResponse adotante,
        AnimalResponse animal,
        String enderecoAnimal,
        String statusAdocao,
        String assinaturaBase64,
        LocalDateTime dataSolicitacao
) {
    public SolicitacaoAdocaoResponse(SolicitacaoAdocao solicitacao) {
        this(
                solicitacao.getId(),
                new AdotanteResponse(solicitacao.getAdotante()),
                new AnimalResponse(solicitacao.getAnimal()),
                solicitacao.getEnderecoAnimal(),
                solicitacao.getStatusAdocao().toString(),
                solicitacao.getAssinaturaBase64(),
                solicitacao.getDataSolicitacao()
        );
    }
}
