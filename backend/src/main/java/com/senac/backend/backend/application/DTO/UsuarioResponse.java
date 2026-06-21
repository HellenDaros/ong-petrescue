package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.entities.Usuario;

public record UsuarioResponse(
        Long id,
        String name,
        String email,
        String cpf,
        String status,
        String role
) {

    public UsuarioResponse(Usuario usuario){
        this(
                usuario.getId(),
                usuario.getName(),
                usuario.getEmail(),
                usuario.getCpf() != null ? usuario.getCpf().toString() : null,
                usuario.getStatus().toString(),
                usuario.getRole()
        );
    }
}
