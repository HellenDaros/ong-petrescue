package com.senac.backend.backend.presentation;

import com.senac.backend.backend.application.DTO.LoginResponse;
import com.senac.backend.backend.application.DTO.LoginRequest;
import com.senac.backend.backend.application.services.TokenService;
import com.senac.backend.backend.application.services.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(description = "Serviço responsável por controlar a autenticação de usuários e sessão", name = "Serviço de autenticação")
public class AuthController {

    @Autowired private TokenService tokenService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    @Operation(description = "Valida senha(regra de negócio)", summary = "Login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){

        if(usuarioService.ValidaUsuarioSenha(loginRequest)){

            var token = tokenService.gerarToken(loginRequest.email());

            return ResponseEntity.ok(new LoginResponse(token));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    }

}