package com.senac.backend.backend.domain.repository;

import com.senac.backend.backend.domain.entities.SolicitacaoAdocao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoAdocaoRepository extends JpaRepository<SolicitacaoAdocao, Long>, JpaSpecificationExecutor<SolicitacaoAdocao> {
    List<SolicitacaoAdocao> findByAdotanteUsuarioId(Long usuarioId);
    List<SolicitacaoAdocao> findByAnimalEmpresaId(Long empresaId);
    Page<SolicitacaoAdocao> findByAnimalEmpresaId(Long empresaId, Pageable pageable);
}
