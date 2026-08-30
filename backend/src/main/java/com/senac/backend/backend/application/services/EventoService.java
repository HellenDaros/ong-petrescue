package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.AlterarStatusEventoRequest;
import com.senac.backend.backend.application.DTO.EventoRequest;
import com.senac.backend.backend.application.DTO.EventoResponse;
import com.senac.backend.backend.domain.entities.Animal;
import com.senac.backend.backend.domain.entities.Endereco;
import com.senac.backend.backend.domain.entities.Evento;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.enuns.EnumStatusEvento;
import com.senac.backend.backend.domain.exceptions.BusinessException;
import com.senac.backend.backend.domain.repository.AnimalRepository;
import com.senac.backend.backend.domain.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import java.util.stream.Collectors;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private EnderecoService enderecoService;

    @Transactional(readOnly = true)
    public List<EventoResponse> listarTodosPorOng() {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (usuarioLogado.getEmpresa() == null) {
            return List.of();
        }

        return eventoRepository.findByEmpresa_Id(usuarioLogado.getEmpresa().getId())
                .stream()
                .map(EventoResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventoResponse> listarPublicos() {
        return eventoRepository.findAll()
                .stream()
                .map(EventoResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventoResponse buscarPublicoPorId(Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Evento não encontrado."));
        return new EventoResponse(evento);
    }

    @Transactional(readOnly = true)
    public EventoResponse buscarPorId(Long id) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Evento evento = eventoRepository.findByIdAndEmpresa_Id(id, usuarioLogado.getEmpresa().getId())
                .orElseThrow(() -> new BusinessException("Evento não encontrado."));

        return new EventoResponse(evento);
    }

    @Transactional
    public Long salvarEvento(EventoRequest request) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (usuarioLogado.getEmpresa() == null) {
            throw new BusinessException("Usuário não possui uma ONG associada.");
        }

        Endereco endereco = enderecoService.buscarOuCriarEndereco(request.cep());

        Evento evento = new Evento();
        evento.setNome(request.nome());
        evento.setDescricao(request.descricao());
        evento.setData(request.data());
        evento.setHorarioInicio(request.horarioInicio());
        evento.setHorarioTermino(request.horarioTermino());
        evento.setNomeLocal(request.nomeLocal());
        evento.setEndereco(endereco);
        evento.setComplemento(request.complemento());
        evento.setUrlCapa(request.urlCapa());
        evento.setStatus(request.status() != null ? request.status() : EnumStatusEvento.AGENDADO);
        evento.setEmpresa(usuarioLogado.getEmpresa());

        if (request.animaisIds() != null && !request.animaisIds().isEmpty()) {
            List<Long> distinctIds = request.animaisIds().stream().distinct().collect(Collectors.toList());
            List<Animal> animais = animalRepository.findAllById(distinctIds).stream()
                    .filter(a -> a.getEmpresa() != null && a.getEmpresa().getId().equals(usuarioLogado.getEmpresa().getId()))
                    .collect(Collectors.toList());
            evento.setAnimais(animais);
        } else {
            evento.setAnimais(new ArrayList<>());
        }

        return eventoRepository.save(evento).getId();
    }

    @Transactional
    public boolean alterarEvento(Long id, EventoRequest request) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Evento eventoBanco = eventoRepository.findByIdAndEmpresa_Id(id, usuarioLogado.getEmpresa().getId())
                .orElseThrow(() -> new BusinessException("Evento não encontrado."));

        Endereco endereco = enderecoService.buscarOuCriarEndereco(request.cep());

        eventoBanco.setNome(request.nome());
        eventoBanco.setDescricao(request.descricao());
        eventoBanco.setData(request.data());
        eventoBanco.setHorarioInicio(request.horarioInicio());
        eventoBanco.setHorarioTermino(request.horarioTermino());
        eventoBanco.setNomeLocal(request.nomeLocal());
        eventoBanco.setEndereco(endereco);
        eventoBanco.setComplemento(request.complemento());

        eventoBanco.setUrlCapa(request.urlCapa());
        if (request.status() != null) {
            eventoBanco.setStatus(request.status());
        }

        if (request.animaisIds() != null) {
            List<Long> distinctIds = request.animaisIds().stream().distinct().collect(Collectors.toList());
            List<Animal> animais = animalRepository.findAllById(distinctIds).stream()
                    .filter(a -> a.getEmpresa() != null && a.getEmpresa().getId().equals(usuarioLogado.getEmpresa().getId()))
                    .collect(Collectors.toList());
            eventoBanco.setAnimais(animais);
        }

        eventoRepository.save(eventoBanco);
        return true;
    }

    @Transactional
    public boolean alterarStatus(Long id, AlterarStatusEventoRequest request) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Evento eventoBanco = eventoRepository.findByIdAndEmpresa_Id(id, usuarioLogado.getEmpresa().getId())
                .orElseThrow(() -> new BusinessException("Evento não encontrado."));

        eventoBanco.setStatus(request.status());
        eventoRepository.save(eventoBanco);
        return true;
    }
}
