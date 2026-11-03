package com.senac.backend.backend.domain.repository;

import com.senac.backend.backend.domain.entities.Vacina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VacinaRepository extends JpaRepository<Vacina, Long> {
    List<Vacina> findByEmpresa_IdOrderByNomeAsc(Long empresaId);
    Optional<Vacina> findByIdAndEmpresa_Id(Long id, Long empresaId);
    boolean existsByEmpresa_IdAndNomeIgnoreCase(Long empresaId, String nome);
    boolean existsByEmpresa_IdAndNomeIgnoreCaseAndIdNot(Long empresaId, String nome, Long id);
}
