package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.AlterarStatusAnimalRequest;
import com.senac.backend.backend.application.DTO.AnimalRequest;
import com.senac.backend.backend.application.DTO.AnimalResponse;
import com.senac.backend.backend.domain.entities.Animal;
import com.senac.backend.backend.domain.repository.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository animalRepository;

    public List<AnimalResponse> ListarTodos() {

        try {

            return animalRepository.findAll()
                    .stream()
                    .map(AnimalResponse::new)
                    .collect(Collectors.toList());

        } catch (Exception e) {

            throw new RuntimeException(e);

        }
    }

    public AnimalResponse BuscarPorId(Long id) {

        try {

            var animal = animalRepository.findById(id).orElse(null);

            return new AnimalResponse(animal);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }
    }

    public Long SalvarAnimal(AnimalRequest animal) {

        try {

            return animalRepository.save(new Animal(animal)).getId();

        } catch (Exception e) {

            throw new RuntimeException(e);

        }
    }

    public boolean AlterarAnimal(Long id, AnimalRequest animalRequest) {

        var animalBanco = animalRepository.findById(id).orElse(null);

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

        var animalBanco = animalRepository.findById(id).orElse(null);

        if (animalBanco != null) {

            animalBanco.setStatusAnimal(statusRequest.statusAnimal());

            animalRepository.save(animalBanco);

            return true;
        }

        return false;
    }
}
