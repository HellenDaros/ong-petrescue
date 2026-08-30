package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.entities.Evento;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

public record EventoResponse(
        Long id,
        String nome,
        String descricao,
        LocalDate data,
        LocalTime horarioInicio,
        LocalTime horarioTermino,
        String nomeLocal,
        String cep,
        String endereco,
        String bairro,
        String cidade,
        String uf,
        String complemento,
        String urlCapa,
        String status,
        Long empresaId,
        String empresaNome,
        List<AnimalResponse> animais
) {
    public EventoResponse(Evento evento) {
        this(
                evento.getId(),
                evento.getNome(),
                evento.getDescricao(),
                evento.getData(),
                evento.getHorarioInicio(),
                evento.getHorarioTermino(),
                evento.getNomeLocal(),
                evento.getEndereco().getCep(),
                evento.getEndereco().getLogradouro(),
                evento.getEndereco().getBairro(),
                evento.getEndereco().getCidade(),
                evento.getEndereco().getUf(),
                evento.getComplemento(),
                evento.getUrlCapa(),
                evento.getStatus() != null ? evento.getStatus().name() : null,
                evento.getEmpresa() != null ? evento.getEmpresa().getId() : null,
                evento.getEmpresa() != null ? evento.getEmpresa().getNameFantasia() : null,
                evento.getAnimais() != null ? evento.getAnimais().stream().map(AnimalResponse::new).collect(Collectors.toList()) : List.of()
        );
    }
}
