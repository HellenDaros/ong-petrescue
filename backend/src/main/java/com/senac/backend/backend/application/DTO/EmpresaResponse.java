package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.entities.Empresa;
import com.senac.backend.backend.domain.entities.Usuario;

public record EmpresaResponse(Long id,
                              String nameFantasia,
                              String razaoSocial,
                              String cnpj,
                              String cep,
                              String endereco,
                              String bairro,
                              String cidade,
                              String uf,
                              String complemento,

                              UsuarioResponse usuarioAdmin) {
    public EmpresaResponse(Empresa empresa, Usuario administrador) {
        this(
                empresa.getId(),
                empresa.getNameFantasia(),
                empresa.getRazaoSocial(),
                empresa.getCnpj().toString(),
                empresa.getEndereco().getCep(),
                empresa.getEndereco().getLogradouro(),
                empresa.getEndereco().getBairro(),
                empresa.getEndereco().getCidade(),
                empresa.getEndereco().getUf(),
                empresa.getComplemento(),

                new UsuarioResponse(administrador)
        );
    }
}
