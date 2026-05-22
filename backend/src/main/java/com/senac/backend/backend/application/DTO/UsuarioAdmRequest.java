package com.senac.backend.backend.application.DTO;

public record UsuarioAdmRequest(String name,
                                String email,
                                String senha,
                                String secretKey) {
}
