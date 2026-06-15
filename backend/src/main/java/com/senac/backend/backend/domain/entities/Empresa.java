package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.application.DTO.EmpresaRequest;
import com.senac.backend.backend.domain.valueobjects.CNPJ;
import com.senac.backend.backend.domain.valueobjects.CPF;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "empresa")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nameFantasia;

    private String razaoSocial;

    @Embedded
    private CNPJ cnpj;

    @OneToOne
    @JoinColumn(name = "administrador_id")
    private Usuario administrador;

    @OneToMany(mappedBy = "empresa")
    private List<Usuario> usuarios;

    public Empresa(EmpresaRequest empresa) {
        this.nameFantasia = empresa.nameFantasia();
        this.razaoSocial = empresa.razaoSocial();
        this.cnpj = new CNPJ(empresa.cnpj());
    }
}
