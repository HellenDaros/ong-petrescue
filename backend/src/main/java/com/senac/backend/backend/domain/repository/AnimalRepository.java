package com.senac.backend.backend.domain.repository;

import com.senac.backend.backend.domain.entities.Animal;
import com.senac.backend.backend.domain.enuns.EnumStatusAnimal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    List<Animal> findByEmpresa_Id(Long empresaId);

    Optional<Animal> findByIdAndEmpresa_Id(Long id, Long empresaId);

    List<Animal> findByStatusAnimal(EnumStatusAnimal statusAnimal);

    Optional<Animal> findByIdAndStatusAnimal(Long id, EnumStatusAnimal statusAnimal);
}
