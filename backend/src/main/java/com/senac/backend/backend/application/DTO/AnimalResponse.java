package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.entities.Animal;

public record AnimalResponse(

        Long id,

        String nameAnimal,

        String raca,

        String sexo,

        String idade,

        String urlFoto,

        String porte,

        String corPelagem,

        String castrado,

        String vermifugado,

        String vacinado,

        String vacinadoDescricao,

        String especie,

        String nameDoador,

        String telefoneDoador,

        String statusAnimal

) {

    public AnimalResponse(Animal animal) {
        this(
                animal.getId(),
                animal.getNameAnimal(),
                animal.getRaca(),
                animal.getSexo().toString(),
                animal.getIdade(),
                animal.getUrlFoto(),
                animal.getPorte().toString(),
                animal.getCorPelagem(),
                animal.getCastrado().toString(),
                animal.getVermifugado().toString(),
                animal.getVacinado().toString(),
                animal.getVacinadoDescricao(),
                animal.getEspecie().toString(),
                animal.getNameDoador(),
                animal.getTelefoneDoador(),
                animal.getStatusAnimal().toString()
        );
    }
}
