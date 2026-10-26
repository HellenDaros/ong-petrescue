package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.AlterarStatusTermoRequest;
import com.senac.backend.backend.application.DTO.TermoUsoRequest;
import com.senac.backend.backend.application.DTO.TermoUsoResponse;
import com.senac.backend.backend.domain.entities.Animal;
import com.senac.backend.backend.domain.entities.TermoUso;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.exceptions.BusinessException;
import com.senac.backend.backend.domain.repository.AnimalRepository;
import com.senac.backend.backend.domain.repository.TermoUsoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TermoUsoService {

    @Autowired
    private TermoUsoRepository termoUsoRepository;

    @Autowired
    private AnimalRepository animalRepository;

    private Usuario usuarioDaOng() {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (usuarioLogado.getEmpresa() == null) {
            throw new BusinessException("Usuário não possui uma ONG associada.");
        }
        return usuarioLogado;
    }

    private TermoUso buscarDaOng(Long id) {
        return termoUsoRepository.findByIdAndEmpresa_Id(id, usuarioDaOng().getEmpresa().getId())
                .orElseThrow(() -> new BusinessException("Termo não encontrado."));
    }

    private void validarRequest(TermoUsoRequest request) {
        if (request.titulo() == null || request.titulo().isBlank()) {
            throw new BusinessException("Informe o título do termo.");
        }
        if (request.conteudo() == null || request.conteudo().isBlank()) {
            throw new BusinessException("Informe o conteúdo do termo.");
        }
    }

    @Transactional(readOnly = true)
    public List<TermoUsoResponse> listar() {
        return termoUsoRepository.findByEmpresa_IdOrderByIdDesc(usuarioDaOng().getEmpresa().getId()).stream()
                .map(TermoUsoResponse::new)
                .toList();
    }

    @Transactional
    public Long salvar(TermoUsoRequest request) {
        validarRequest(request);

        TermoUso termo = new TermoUso();
        termo.setTitulo(request.titulo().trim());
        termo.setConteudo(request.conteudo().trim());
        termo.setAtivo(true);
        termo.setEmpresa(usuarioDaOng().getEmpresa());
        return termoUsoRepository.save(termo).getId();
    }

    @Transactional
    public void alterar(Long id, TermoUsoRequest request) {
        validarRequest(request);
        TermoUso termo = buscarDaOng(id);
        termo.setTitulo(request.titulo().trim());
        termo.setConteudo(request.conteudo().trim());
        termo.setDataAtualizacao(LocalDateTime.now());
        termoUsoRepository.save(termo);
    }

    @Transactional
    public void alterarStatus(Long id, AlterarStatusTermoRequest request) {
        TermoUso termo = buscarDaOng(id);
        termo.setAtivo(request.ativo());
        termoUsoRepository.save(termo);
    }

    @Transactional(readOnly = true)
    public List<TermoUsoResponse> buscarAtivosDoAnimal(Long animalId) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new BusinessException("Animal não encontrado."));
        return termosAtivosDaOng(animal).stream()
                .map(TermoUsoResponse::new)
                .toList();
    }

    private List<TermoUso> termosAtivosDaOng(Animal animal) {
        if (animal.getEmpresa() == null) {
            return List.of();
        }
        return termoUsoRepository.findByEmpresa_IdAndAtivoTrue(animal.getEmpresa().getId());
    }

   @Transactional(readOnly = true)
    public List<TermoUso> validarTermosDaSolicitacao(Animal animal, List<Long> termoIds) {
        List<TermoUso> ativos = termosAtivosDaOng(animal);

        Set<Long> idsAtivos = ativos.stream().map(TermoUso::getId).collect(Collectors.toSet());
        Set<Long> idsAceitos = termoIds == null ? Set.of() : new HashSet<>(termoIds);

        if (!idsAtivos.equals(idsAceitos)) {
            throw new BusinessException("Os termos da ONG foram atualizados. Recarregue a página e leia os termos vigentes antes de enviar.");
        }
        return ativos;
    }
}
