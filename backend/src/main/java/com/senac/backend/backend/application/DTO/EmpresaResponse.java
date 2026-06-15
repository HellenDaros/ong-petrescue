package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.entities.Empresa;
import com.senac.backend.backend.domain.entities.Usuario;

public record EmpresaResponse(Long id,
                              String nameFantasia,
                              String razaoSocial,
                              String cnpj,

                              String name,
                              String email,
                              String cpf) {
    public EmpresaResponse(Empresa empresa, Usuario administrador) {
        this(
                empresa.getId(),
                empresa.getNameFantasia(),
                empresa.getRazaoSocial(),
                empresa.getCnpj().toString(),

                administrador.getName(),
                administrador.getEmail(),
                administrador.getCpf().toString()
        );
    }
}
