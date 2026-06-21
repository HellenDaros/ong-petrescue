package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.application.DTO.AdotanteRequest;
import com.senac.backend.backend.application.DTO.UsuarioAdmRequest;
import com.senac.backend.backend.application.DTO.UsuarioRequest;
import com.senac.backend.backend.domain.enuns.EnumStatusUsuario;
import com.senac.backend.backend.domain.valueobjects.CPF;
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

    @Embedded
    private CPF cpf;

    private String email;

    private String senha;

    private String role;

    private EnumStatusUsuario status = EnumStatusUsuario.ATIVO;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empresa_id", referencedColumnName = "id")
    private Empresa empresa;

    @OneToOne(mappedBy = "usuario", fetch = FetchType.LAZY)
    private Adotante adotante;

   /* public Usuario getUsuarioLogado(){
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }*/

    public Usuario(UsuarioRequest usuario, Empresa empresa, String role) {
        this.email = usuario.email();
        this.name = usuario.name();
        this.cpf = new CPF(usuario.cpf());
        this.senha = usuario.senha();
        this.role = role;
        this.empresa = empresa;
    }

    public Usuario(UsuarioAdmRequest usuario) {
        this.email =usuario.email();
        this.name = usuario.name();
        if (usuario.cpf() != null && !usuario.cpf().isBlank()) {
            this.cpf = new CPF(usuario.cpf());
        } else {
            this.cpf = null;
        }
        this.senha = usuario.senha();
        this.role = "ROLE_ADMIN";
        this.empresa = null;
    }

    public Usuario(AdotanteRequest usuario) {
        this.email = usuario.email();
        this.name = usuario.name();
        this.cpf = new CPF(usuario.cpf());
        this.senha = usuario.senha();
        this.role = "ROLE_ADOTANTE";
        this.empresa = null;
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

