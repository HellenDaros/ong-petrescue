package com.senac.backend.backend.application.DTO;

public record UsuarioAdminRequest(String name,
                                  String email,
                                  String senha,
                                  String secretKey) {
}
