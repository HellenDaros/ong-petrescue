package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.enuns.EnumStatusEvento;

public record AlterarStatusEventoRequest(
        EnumStatusEvento status
) {
}
