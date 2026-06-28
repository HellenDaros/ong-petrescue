package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.application.DTO.AdotanteRequest;
import com.senac.backend.backend.application.DTO.EnderecoResponse;
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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true)
    private Usuario usuario;

    private String identidade;

    private String cep;

    private String endereco;

    private String bairro;

    private String cidade;

    private String uf;

    private String complemento;

    private String profissao;

    private String telefoneFixo;

    private String telefoneMovel;

    public Adotante(AdotanteRequest adotante, Usuario usuario, EnderecoResponse endereco) {
        this.usuario = usuario;
        this.identidade = adotante.identidade();
        this.cep = endereco.cep();
        this.endereco = endereco.logradouro();
        this.bairro = endereco.bairro();
        this.cidade = endereco.cidade();
        this.uf = endereco.uf();
        this.complemento = adotante.complemento();
        this.profissao = adotante.profissao();
        this.telefoneFixo = adotante.telefoneFixo();
        this.telefoneMovel = adotante.telefoneMovel();
    }

}
