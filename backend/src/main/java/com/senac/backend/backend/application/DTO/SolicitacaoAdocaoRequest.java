package com.senac.backend.backend.application.DTO;

public record SolicitacaoAdocaoRequest(
        Long animalId,
        String cep,
        String complemento,
        String assinaturaBase64
) {
}
