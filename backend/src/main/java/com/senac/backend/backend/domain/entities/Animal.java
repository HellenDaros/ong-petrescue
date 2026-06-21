package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.application.DTO.AnimalRequest;
import com.senac.backend.backend.domain.enuns.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table (name = "animal")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nameAnimal;

    private String raca;

    @Enumerated(EnumType.STRING)
    private EnumSexo sexo;

    private String idade;

    private String urlFoto;

    @Enumerated(EnumType.STRING)
    private EnumPorte porte;

    private String corPelagem;

    @Enumerated(EnumType.STRING)
    private EnumConfirmacao castrado;

    @Enumerated(EnumType.STRING)
    private EnumConfirmacao vermifugado;

    @Enumerated(EnumType.STRING)
    private EnumConfirmacao vacinado;

    private String vacinadoDescricao;

    @Enumerated(EnumType.STRING)
    private EnumEspecieAnimal especie;

    private String nameDoador;

    private String telefoneDoador;

    private EnumStatusAnimal statusAnimal = EnumStatusAnimal.DISPONIVEL;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", referencedColumnName = "id")
    private Empresa empresa;

    public Animal(AnimalRequest animal) {
        this.nameAnimal = animal.nameAnimal();
        this.raca = animal.raca();
        this.sexo = animal.sexo();
        this.idade = animal.idade();
        this.urlFoto = animal.urlFoto();
        this.porte = animal.porte();
        this.corPelagem = animal.corPelagem();
        this.castrado = animal.castrado();
        this.vermifugado = animal.vermifugado();
        this.vacinado = animal.vacinado();
        this.vacinadoDescricao = animal.vacinadoDescricao();
        this.especie = animal.especie();
        this.nameDoador = animal.nameDoador();
        this.telefoneDoador = animal.telefoneDoador();
    }
}
