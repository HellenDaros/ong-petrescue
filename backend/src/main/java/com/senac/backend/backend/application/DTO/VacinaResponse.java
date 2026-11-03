package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.entities.Vacina;

public record VacinaResponse(
        Long id,
        String nome
) {
    public VacinaResponse(Vacina vacina) {
        this(vacina.getId(), vacina.getNome());
    }
}
