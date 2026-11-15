package com.senac.backend.backend.application.DTO;

public record DashboardResponse(
        long animaisDisponiveis,
        long animaisAdotados,
        long animaisInativos,
        long solicitacoesPendentes
) {
}
