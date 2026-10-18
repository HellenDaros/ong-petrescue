package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.entities.SolicitacaoAdocao;
import java.time.LocalDateTime;

public record SolicitacaoAdocaoResponse(
        Long id,
        AdotanteResponse adotante,
        AnimalResponse animal,
        String cep,
        String endereco,
        String bairro,
        String cidade,
        String uf,
        String complemento,
        String statusAdocao,
        String assinaturaBase64,
        LocalDateTime dataSolicitacao
) {
    public SolicitacaoAdocaoResponse(SolicitacaoAdocao solicitacao) {
        this(
                solicitacao.getId(),
                new AdotanteResponse(solicitacao.getAdotante()),
                new AnimalResponse(solicitacao.getAnimal()),
                solicitacao.getEndereco() != null ? solicitacao.getEndereco().getCep() : null,
                solicitacao.getEndereco() != null ? solicitacao.getEndereco().getLogradouro() : null,
                solicitacao.getEndereco() != null ? solicitacao.getEndereco().getBairro() : null,
                solicitacao.getEndereco() != null ? solicitacao.getEndereco().getCidade() : null,
                solicitacao.getEndereco() != null ? solicitacao.getEndereco().getUf() : null,
                solicitacao.getComplemento(),
                solicitacao.getStatusAdocao().toString(),
                solicitacao.getAssinaturaBase64(),
                solicitacao.getDataSolicitacao()
        );
    }

    public SolicitacaoAdocaoResponse semAssinatura() {
        return new SolicitacaoAdocaoResponse(id, adotante, animal, cep, endereco, bairro, cidade, uf,
                complemento, statusAdocao, null, dataSolicitacao);
    }
}
