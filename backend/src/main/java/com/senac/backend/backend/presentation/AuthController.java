package com.senac.backend.backend.presentation;

import com.senac.backend.backend.application.DTO.LoginResponse;
import com.senac.backend.backend.application.DTO.LoginRequest;
import com.senac.backend.backend.application.DTO.EsqueciSenhaRequest;
import com.senac.backend.backend.application.DTO.RedefinirSenhaRequest;
import com.senac.backend.backend.application.services.RecuperacaoSenhaService;
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

    @Autowired
    private RecuperacaoSenhaService recuperacaoSenhaService;

    @PostMapping("/login")
    @Operation(description = "Valida senha(regra de negócio)", summary = "Login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){

        if(usuarioService.ValidaUsuarioSenha(loginRequest)){

            var token = tokenService.gerarToken(loginRequest.email());

            return ResponseEntity.ok(new LoginResponse(token));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    }

    @PostMapping("/esqueci-senha")
    @Operation(description = "Envia um e-mail com o link para redefinir a senha. Responde igual exista ou não o e-mail.", summary = "Esqueci minha senha")
    public ResponseEntity<String> esqueciSenha(@RequestBody EsqueciSenhaRequest request) {
        recuperacaoSenhaService.solicitarRecuperacao(request);
        return ResponseEntity.ok("Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.");
    }

    @PostMapping("/redefinir-senha")
    @Operation(description = "Troca a senha usando o token recebido por e-mail", summary = "Redefinir senha")
    public ResponseEntity<String> redefinirSenha(@RequestBody RedefinirSenhaRequest request) {
        recuperacaoSenhaService.redefinirSenha(request);
        return ResponseEntity.ok("Senha redefinida com sucesso.");
    }

}