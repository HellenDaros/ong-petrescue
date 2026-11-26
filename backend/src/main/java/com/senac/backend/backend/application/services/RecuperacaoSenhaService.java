package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.EsqueciSenhaRequest;
import com.senac.backend.backend.application.DTO.RedefinirSenhaRequest;
import com.senac.backend.backend.domain.entities.RecuperacaoSenha;
import com.senac.backend.backend.domain.enuns.EnumStatusUsuario;
import com.senac.backend.backend.domain.exceptions.BusinessException;
import com.senac.backend.backend.domain.repository.RecuperacaoSenhaRepository;
import com.senac.backend.backend.domain.repository.TokenRepository;
import com.senac.backend.backend.domain.repository.UsuarioRepository;
import com.senac.backend.backend.infra.external.EmailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class RecuperacaoSenhaService {

    private static final long SEGUNDOS_ENTRE_PEDIDOS = 60;

    private final SecureRandom secureRandom = new SecureRandom();

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RecuperacaoSenhaRepository recuperacaoSenhaRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private EmailRepository emailRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.recuperacao-senha.minutos-validade}")
    private long minutosValidade;

    @Transactional
    public void solicitarRecuperacao(EsqueciSenhaRequest request) {
        if (request == null || request.email() == null || request.email().isBlank()) {
            throw new BusinessException("Informe o e-mail.");
        }

        var usuario = usuarioRepository.findByEmail(request.email().trim()).orElse(null);

        if (usuario == null || usuario.getStatus() != EnumStatusUsuario.ATIVO) {
            return;
        }

        var ultimoPedido = recuperacaoSenhaRepository.findFirstByUsuarioOrderByCriadoEmDesc(usuario).orElse(null);
        if (ultimoPedido != null
                && ultimoPedido.getCriadoEm().isAfter(LocalDateTime.now().minusSeconds(SEGUNDOS_ENTRE_PEDIDOS))) {
            return;
        }

        recuperacaoSenhaRepository.deleteByUsuario(usuario);

        String token = gerarToken();
        recuperacaoSenhaRepository.save(new RecuperacaoSenha(
                hash(token),
                usuario,
                LocalDateTime.now().plusMinutes(minutosValidade)
        ));

        String link = frontendUrl + "/redefinir-senha?token=" + token;
        emailRepository.enviarRecuperacaoSenha(usuario.getEmail(), usuario.getName(), link, minutosValidade);
    }

    @Transactional
    public void redefinirSenha(RedefinirSenhaRequest request) {
        if (request == null || request.token() == null || request.token().isBlank()) {
            throw new BusinessException("Link de recuperação inválido.");
        }

        if (request.novaSenha() == null || request.novaSenha().isBlank()) {
            throw new BusinessException("Informe a nova senha.");
        }

        var recuperacao = recuperacaoSenhaRepository.findByTokenHash(hash(request.token()))
                .filter(RecuperacaoSenha::isValido)
                .orElseThrow(() -> new BusinessException("Link de recuperação inválido ou expirado. Solicite um novo."));

        var usuario = recuperacao.getUsuario();

        if (usuario.getStatus() != EnumStatusUsuario.ATIVO) {
            throw new BusinessException("Acesso não permitido. Seu usuário está inativo.");
        }

        usuario.setSenha(passwordEncoder.encode(request.novaSenha()));
        usuarioRepository.save(usuario);

        recuperacao.setUsado(true);
        recuperacaoSenhaRepository.save(recuperacao);

        tokenRepository.deleteByUsuario(usuario);
    }

    private String gerarToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
