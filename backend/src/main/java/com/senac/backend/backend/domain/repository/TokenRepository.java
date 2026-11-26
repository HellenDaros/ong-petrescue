package com.senac.backend.backend.domain.repository;

import com.senac.backend.backend.domain.entities.Token;
import com.senac.backend.backend.domain.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long>  {
    Optional<Token> findTokenByToken(String token);

    void deleteByUsuario(Usuario usuario);
}





