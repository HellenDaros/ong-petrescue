package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.domain.valueobjects.CPF;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "adotante")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Adotante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nameAdotante;

    @Embedded
    private CPF cpf;

    private String identidade;

    private String endereco;

    private String bairro;

    private String cidade;

    private String uf;

    private String profissao;

    private String telefoneFixo;

    private String telefoneMovel;

}
