package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.DashboardResponse;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.enuns.EnumStatusAdocao;
import com.senac.backend.backend.domain.enuns.EnumStatusAnimal;
import com.senac.backend.backend.domain.repository.AnimalRepository;
import com.senac.backend.backend.domain.repository.SolicitacaoAdocaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private SolicitacaoAdocaoRepository solicitacaoAdocaoRepository;

    @Transactional(readOnly = true)
    public DashboardResponse buscarIndicadores() {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (usuarioLogado.getEmpresa() == null) {
            throw new RuntimeException("Usuário não está associado a nenhuma ONG.");
        }
        Long empresaId = usuarioLogado.getEmpresa().getId();

        return new DashboardResponse(
                animalRepository.countByEmpresa_IdAndStatusAnimal(empresaId, EnumStatusAnimal.DISPONIVEL),
                animalRepository.countByEmpresa_IdAndStatusAnimal(empresaId, EnumStatusAnimal.ADOTADO),
                animalRepository.countByEmpresa_IdAndStatusAnimal(empresaId, EnumStatusAnimal.INATIVO),
                solicitacaoAdocaoRepository.countByAnimalEmpresaIdAndStatusAdocao(empresaId, EnumStatusAdocao.PENDENTE)
        );
    }
}
