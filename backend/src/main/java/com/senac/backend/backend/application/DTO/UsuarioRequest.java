package com.senac.backend.backend.application.DTO;

public record UsuarioRequest(
        String name,
        String email,
        String senha
) {
}
