package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.enuns.EnumStatusEvento;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record EventoRequest(
        String nome,
        String descricao,
        LocalDate data,
        LocalTime horarioInicio,
        LocalTime horarioTermino,
        String nomeLocal,
        String cep,
        String complemento,
        String urlCapa,
        EnumStatusEvento status,
        List<Long> animaisIds
) {
}
