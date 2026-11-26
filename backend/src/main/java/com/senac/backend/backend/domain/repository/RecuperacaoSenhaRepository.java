package com.senac.backend.backend.domain.repository;

import com.senac.backend.backend.domain.entities.RecuperacaoSenha;
import com.senac.backend.backend.domain.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecuperacaoSenhaRepository extends JpaRepository<RecuperacaoSenha, Long> {

    Optional<RecuperacaoSenha> findByTokenHash(String tokenHash);

    Optional<RecuperacaoSenha> findFirstByUsuarioOrderByCriadoEmDesc(Usuario usuario);

    void deleteByUsuario(Usuario usuario);
}
