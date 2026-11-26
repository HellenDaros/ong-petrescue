package com.senac.backend.backend.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "recuperacao_senha")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecuperacaoSenha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Guardamos apenas o hash (SHA-256) do token; o token puro só existe no link do e-mail.
    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false)
    private Usuario usuario;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "expira_em", nullable = false)
    private LocalDateTime expiraEm;

    @Column(nullable = false)
    private boolean usado = false;

    public RecuperacaoSenha(String tokenHash, Usuario usuario, LocalDateTime expiraEm) {
        this.tokenHash = tokenHash;
        this.usuario = usuario;
        this.criadoEm = LocalDateTime.now();
        this.expiraEm = expiraEm;
    }

    public boolean isValido() {
        return !usado && LocalDateTime.now().isBefore(expiraEm);
    }
}
