package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.entities.Empresa;
import com.senac.backend.backend.domain.entities.Usuario;

public record EmpresaResponse(Long id,
                              String nameFantasia,
                              String razaoSocial,
                              String cnpj,

                              UsuarioResponse usuarioAdmin) {
    public EmpresaResponse(Empresa empresa, Usuario administrador) {
        this(
                empresa.getId(),
                empresa.getNameFantasia(),
                empresa.getRazaoSocial(),
                empresa.getCnpj().toString(),

                new UsuarioResponse(administrador)
        );
    }
}
