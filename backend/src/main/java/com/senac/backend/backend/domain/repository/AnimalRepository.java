package com.senac.backend.backend.domain.repository;

import com.senac.backend.backend.domain.entities.Animal;
import com.senac.backend.backend.domain.enuns.EnumStatusAnimal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long>, JpaSpecificationExecutor<Animal> {
    List<Animal> findByEmpresa_Id(Long empresaId);

    List<Animal> findByEmpresa_IdAndStatusAnimal(Long empresaId, EnumStatusAnimal statusAnimal);

    Page<Animal> findByEmpresa_Id(Long empresaId, Pageable pageable);

    Optional<Animal> findByIdAndEmpresa_Id(Long id, Long empresaId);

    List<Animal> findByStatusAnimal(EnumStatusAnimal statusAnimal);

    Page<Animal> findByStatusAnimal(EnumStatusAnimal statusAnimal, Pageable pageable);

    Optional<Animal> findByIdAndStatusAnimal(Long id, EnumStatusAnimal statusAnimal);
}
