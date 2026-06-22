package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.SolicitacaoAdocaoRequest;
import com.senac.backend.backend.application.DTO.SolicitacaoAdocaoResponse;
import com.senac.backend.backend.domain.entities.Adotante;
import com.senac.backend.backend.domain.entities.Animal;
import com.senac.backend.backend.domain.entities.SolicitacaoAdocao;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.enuns.EnumStatusAdocao;
import com.senac.backend.backend.domain.enuns.EnumStatusAnimal;
import com.senac.backend.backend.domain.repository.AdotanteRepository;
import com.senac.backend.backend.domain.repository.AnimalRepository;
import com.senac.backend.backend.domain.repository.SolicitacaoAdocaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitacaoAdocaoService {

    @Autowired
    private SolicitacaoAdocaoRepository solicitacaoAdocaoRepository;

    @Autowired
    private AdotanteRepository adotanteRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Transactional
    public Long criarSolicitacao(SolicitacaoAdocaoRequest request) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Adotante adotante = adotanteRepository.findByUsuario_Id(usuarioLogado.getId())
                .orElseThrow(() -> new RuntimeException("Perfil de adotante não encontrado para o usuário logado."));

        Animal animal = animalRepository.findById(request.animalId())
                .orElseThrow(() -> new RuntimeException("Animal não encontrado."));

        if (animal.getStatusAnimal() != EnumStatusAnimal.DISPONIVEL) {
            throw new RuntimeException("Animal não está disponível para adoção.");
        }

        SolicitacaoAdocao solicitacao = new SolicitacaoAdocao();
        solicitacao.setAdotante(adotante);
        solicitacao.setAnimal(animal);
        solicitacao.setEnderecoAnimal(request.enderecoAnimal());
        solicitacao.setStatusAdocao(EnumStatusAdocao.PENDENTE);
        solicitacao.setDataSolicitacao(LocalDateTime.now());

        return solicitacaoAdocaoRepository.save(solicitacao).getId();
    }

    public List<SolicitacaoAdocaoResponse> listarMinhasSolicitacoes() {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return solicitacaoAdocaoRepository.findByAdotanteUsuarioId(usuarioLogado.getId())
                .stream()
                .map(SolicitacaoAdocaoResponse::new)
                .collect(Collectors.toList());
    }

    public List<SolicitacaoAdocaoResponse> listarSolicitacoesOng() {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (usuarioLogado.getEmpresa() == null) {
            throw new RuntimeException("Usuário não está associado a nenhuma ONG.");
        }
        return solicitacaoAdocaoRepository.findByAnimalEmpresaId(usuarioLogado.getEmpresa().getId())
                .stream()
                .map(SolicitacaoAdocaoResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean responderSolicitacao(Long id, EnumStatusAdocao novoStatus) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (usuarioLogado.getEmpresa() == null) {
            throw new RuntimeException("Usuário não autorizado.");
        }

        SolicitacaoAdocao solicitacao = solicitacaoAdocaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação de adoção não encontrada."));

        if (!solicitacao.getAnimal().getEmpresa().getId().equals(usuarioLogado.getEmpresa().getId())) {
            throw new RuntimeException("Acesso negado: esta solicitação pertence a outra ONG.");
        }

        solicitacao.setStatusAdocao(novoStatus);
        solicitacaoAdocaoRepository.save(solicitacao);

        if (novoStatus == EnumStatusAdocao.APROVADO) {
            Animal animal = solicitacao.getAnimal();
            animal.setStatusAnimal(EnumStatusAnimal.INATIVO);
            animalRepository.save(animal);
        }

        return true;
    }
}
