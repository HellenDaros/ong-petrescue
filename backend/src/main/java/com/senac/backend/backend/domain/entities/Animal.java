package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.domain.enuns.EnumConfirmacao;
import com.senac.backend.backend.domain.enuns.EnumEspecieAnimal;
import com.senac.backend.backend.domain.enuns.EnumSexo;
import com.senac.backend.backend.domain.enuns.EnumStatusAnimal;
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

    private EnumSexo sexo;

    private Integer idade;

    private String urlFoto;

    private String porte;

    private String corPelagem;

    private EnumConfirmacao castrado;

    private EnumConfirmacao vermifugado;
    
    private EnumConfirmacao vacinado;

    private String vacinadoDescricao;

    private EnumEspecieAnimal especie;

    private String nameDoador;

    private EnumStatusAnimal statusAnimal = EnumStatusAnimal.DISPONIVEL;

}
