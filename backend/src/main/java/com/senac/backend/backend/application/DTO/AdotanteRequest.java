package com.senac.backend.backend.application.DTO;

public record AdotanteRequest(String name,
                              String email,
                              String senha,
                              String cpf,

                              String identidade,
                              String cep,
                              String profissao,
                              String telefoneFixo,
                              String telefoneMovel) {
}
