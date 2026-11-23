package com.senac.backend.backend.domain.repository;

import com.senac.backend.backend.domain.entities.Empresa;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.enuns.EnumStatusUsuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long>, JpaSpecificationExecutor<Usuario> {

    Optional<Usuario> findByIdAndEmpresa_Id(Long id, Long empresaId);

    List<Usuario> getUsuariosByEmpresa_Id(Long empresa);

    Page<Usuario> findByEmpresa_Id(Long empresaId, Pageable pageable);

    Optional<Usuario> findByEmpresaAndRole(Empresa empresa, String role);

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByCpf_Cpf(String cpf);

    boolean existsByCpf_CpfAndIdNot(String cpf, Long id);


}
