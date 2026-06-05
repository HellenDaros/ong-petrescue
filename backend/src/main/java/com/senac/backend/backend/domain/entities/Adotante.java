package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.application.DTO.AdotanteRequest;
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

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    private String identidade;

    private String endereco;

    private String bairro;

    private String cidade;

    private String uf;

    private String profissao;

    private String telefoneFixo;

    private String telefoneMovel;

    public Adotante(AdotanteRequest adotante, Usuario usuario) {
        this.usuario = usuario;
        this.identidade = adotante.identidade();
        this.endereco = adotante.endereco();
        this.bairro = adotante.bairro();
        this.cidade = adotante.cidade();
        this.uf = adotante.uf();
        this.profissao = adotante.profissao();
        this.telefoneFixo = adotante.telefoneFixo();
        this.telefoneMovel = adotante.telefoneMovel();
    }

}
