package com.senac.backend.backend.domain.repository;

import com.senac.backend.backend.domain.entities.SolicitacaoAdocao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoAdocaoRepository extends JpaRepository<SolicitacaoAdocao, Long> {
    List<SolicitacaoAdocao> findByAdotanteUsuarioId(Long usuarioId);
    List<SolicitacaoAdocao> findByAnimalEmpresaId(Long empresaId);
}
