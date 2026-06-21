package com.senac.backend.backend.domain.repository;

import com.senac.backend.backend.domain.entities.Adotante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdotanteRepository extends JpaRepository<Adotante, Long> {

    Optional<Adotante> findByUsuario_Id(Long usuarioId);

}
