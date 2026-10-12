package com.senac.backend.backend.domain.repository;

import com.senac.backend.backend.domain.entities.Evento;
import com.senac.backend.backend.domain.enuns.EnumStatusEvento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByEmpresa_Id(Long empresaId);
    Page<Evento> findByEmpresa_Id(Long empresaId, Pageable pageable);
    Optional<Evento> findByIdAndEmpresa_Id(Long id, Long empresaId);
    List<Evento> findByStatus(EnumStatusEvento status);
}
