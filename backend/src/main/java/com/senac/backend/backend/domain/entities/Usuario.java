package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.application.DTO.UsuarioRequest;
import com.senac.backend.backend.domain.enuns.EnumStatusUsuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table (name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String senha;

    private String role;

    private EnumStatusUsuario status = EnumStatusUsuario.ATIVO;

    public Usuario(UsuarioRequest usuario) {
        this.email =usuario.email();
        this.name = usuario.name();
        this.senha = usuario.senha();
        this.role = "ROLE_USER";
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.role));
    }

    @Override
    public @Nullable String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}

