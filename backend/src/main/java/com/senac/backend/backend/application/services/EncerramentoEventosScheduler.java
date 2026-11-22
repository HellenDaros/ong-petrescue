package com.senac.backend.backend.application.services;

import com.senac.backend.backend.domain.entities.Evento;
import com.senac.backend.backend.domain.enuns.EnumStatusEvento;
import com.senac.backend.backend.domain.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

@Component
public class EncerramentoEventosScheduler {

    private static final ZoneId FUSO = ZoneId.of("America/Sao_Paulo");

    @Autowired
    private EventoRepository eventoRepository;

    @Scheduled(fixedRate = 10 * 60 * 1000)
    @Transactional
    public void encerrarEventosPassados() {
        LocalDate hoje = LocalDate.now(FUSO);
        LocalTime agora = LocalTime.now(FUSO);

        List<Evento> passados = eventoRepository.findByStatus(EnumStatusEvento.AGENDADO)
                .stream()
                .filter(e -> e.getData().isBefore(hoje)
                        || (e.getData().isEqual(hoje)
                        && e.getHorarioTermino() != null
                        && e.getHorarioTermino().isBefore(agora)))
                .toList();

        passados.forEach(e -> e.setStatus(EnumStatusEvento.ENCERRADO));
        eventoRepository.saveAll(passados);
    }
}
