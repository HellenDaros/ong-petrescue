package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.application.DTO.AdotanteRequest;
import com.senac.backend.backend.domain.valueobjects.Celular;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "endereco_id", referencedColumnName = "id")
    private Endereco endereco;

    private String complemento;

    private String profissao;

    private String telefoneFixo;

    @Embedded
    private Celular telefoneMovel;

    public Adotante(AdotanteRequest adotante, Usuario usuario, Endereco endereco) {
        this.usuario = usuario;
        this.identidade = adotante.identidade();
        this.endereco = endereco;
        this.complemento = adotante.complemento();
        this.profissao = adotante.profissao();
        this.telefoneFixo = adotante.telefoneFixo();
        this.telefoneMovel = new Celular(adotante.telefoneMovel());
    }

}
