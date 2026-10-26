package com.senac.backend.backend.domain.repository;

import com.senac.backend.backend.domain.entities.TermoUso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TermoUsoRepository extends JpaRepository<TermoUso, Long> {
    List<TermoUso> findByEmpresa_IdOrderByIdDesc(Long empresaId);
    Optional<TermoUso> findByIdAndEmpresa_Id(Long id, Long empresaId);
    List<TermoUso> findByEmpresa_IdAndAtivoTrue(Long empresaId);
}
