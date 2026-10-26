package com.senac.backend.backend.application.DTO;

import java.util.List;

public record SolicitacaoAdocaoRequest(
        Long animalId,
        String cep,
        String complemento,
        String assinaturaBase64,
        List<Long> termoIds
) {
}
