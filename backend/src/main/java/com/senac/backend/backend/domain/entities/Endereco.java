package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.application.DTO.EnderecoResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "endereco")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cep;

    private String logradouro;

    private String bairro;

    private String cidade;

    private String uf;

    public Endereco(EnderecoResponse endereco) {
        this.cep = endereco.cep();
        this.logradouro = endereco.logradouro();
        this.bairro = endereco.bairro();
        this.cidade = endereco.cidade();
        this.uf = endereco.uf();
    }
}
