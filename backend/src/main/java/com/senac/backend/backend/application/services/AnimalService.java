package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.AlterarStatusAnimalRequest;
import com.senac.backend.backend.application.DTO.AnimalRequest;
import com.senac.backend.backend.application.DTO.AnimalResponse;
import com.senac.backend.backend.domain.entities.Animal;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.enuns.EnumStatusAnimal;
import com.senac.backend.backend.domain.repository.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository animalRepository;

    public List<AnimalResponse> ListarTodos() {

        try {
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if (usuarioLogado.getEmpresa() == null) {
                return List.of();
            }

            return animalRepository.findByEmpresa_Id(usuarioLogado.getEmpresa().getId())
                    .stream()
                    .map(AnimalResponse::new)
                    .collect(Collectors.toList());

        } catch (Exception e) {

            throw new RuntimeException(e);

        }
    }

    @Transactional(readOnly = true)
    public List<AnimalResponse> listarPublicos() {
        return animalRepository.findByStatusAnimal(EnumStatusAnimal.DISPONIVEL)
                .stream()
                .map(AnimalResponse::new)
                .collect(Collectors.toList());
    }

    public AnimalResponse BuscarPorId(Long id) {

        try {
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            Animal animal;
            if ("ROLE_ADOTANTE".equals(usuarioLogado.getRole())) {
                animal = animalRepository
                        .findByIdAndStatusAnimal(id, EnumStatusAnimal.DISPONIVEL)
                        .orElseThrow(() -> new RuntimeException("Animal não encontrado."));
            } else {
                animal = animalRepository
                        .findByIdAndEmpresa_Id(id, usuarioLogado.getEmpresa().getId())
                        .orElseThrow(() -> new RuntimeException("Animal não encontrado."));
            }

            return new AnimalResponse(animal);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }
    }

    public Long SalvarAnimal(AnimalRequest animalRequest) {
        try {
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            Animal animal = new Animal(animalRequest);
            animal.setEmpresa(usuarioLogado.getEmpresa());

            return animalRepository.save(animal).getId();

        } catch (Exception e) {

            throw new RuntimeException(e);

        }
    }

    public boolean AlterarAnimal(Long id, AnimalRequest animalRequest) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Animal animalBanco = animalRepository
                .findByIdAndEmpresa_Id(id, usuarioLogado.getEmpresa().getId())
                .orElse(null);

        if (animalBanco != null) {

            animalBanco.setNameAnimal(animalRequest.nameAnimal());
            animalBanco.setRaca(animalRequest.raca());
            animalBanco.setSexo(animalRequest.sexo());
            animalBanco.setIdade(animalRequest.idade());
            animalBanco.setUrlFoto(animalRequest.urlFoto());
            animalBanco.setPorte(animalRequest.porte());
            animalBanco.setCorPelagem(animalRequest.corPelagem());
            animalBanco.setCastrado(animalRequest.castrado());
            animalBanco.setVermifugado(animalRequest.vermifugado());
            animalBanco.setVacinado(animalRequest.vacinado());
            animalBanco.setVacinadoDescricao(animalRequest.vacinadoDescricao());
            animalBanco.setEspecie(animalRequest.especie());
            animalBanco.setNameDoador(animalRequest.nameDoador());
            animalBanco.setTelefoneDoador(animalRequest.telefoneDoador());

            animalRepository.save(animalBanco);

            return true;
        }

        return false;
    }

    public boolean AlterarStatus(Long id, AlterarStatusAnimalRequest statusRequest) {

        Usuario usuarioLogado =
                (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            Animal animalBanco = animalRepository
                .findByIdAndEmpresa_Id(id, usuarioLogado.getEmpresa().getId())
                .orElse(null);

        if (animalBanco != null) {
            animalBanco.setStatusAnimal(statusRequest.statusAnimal());
            animalRepository.save(animalBanco);
            return true;
        }

        return false;
    }
}
