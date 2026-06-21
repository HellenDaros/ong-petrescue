package com.senac.backend.backend.application.DTO;

public record EmpresaRequest(
                             String nameFantasia,
                             String razaoSocial,
                             String cnpj,
                             UsuarioRequest usuarioAdmin) {
}
