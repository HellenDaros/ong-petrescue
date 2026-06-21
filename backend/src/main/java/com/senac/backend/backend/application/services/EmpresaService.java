package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.EmpresaRequest;
import com.senac.backend.backend.application.DTO.EmpresaResponse;
import com.senac.backend.backend.domain.entities.Empresa;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.exceptions.BusinessException;
import com.senac.backend.backend.domain.repository.EmpresaRepository;
import com.senac.backend.backend.domain.repository.UsuarioRepository;
import com.senac.backend.backend.domain.valueobjects.CNPJ;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Long SalvarEmpresa(EmpresaRequest empresa) {
        try {
            Usuario adminLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if (adminLogado.getEmpresa() != null) {
                throw new BusinessException("Já possui uma ONG vinculada.");
            }

            Empresa empresaSalva =
                    empresaRepository.save(
                            new Empresa(empresa)
                    );

            Usuario adminOng =
                    new Usuario(
                            empresa.usuarioAdmin(),
                            empresaSalva,
                            "ROLE_ADMIN_ONG"
                    );

            usuarioRepository.save(adminOng);

            adminLogado.setEmpresa(empresaSalva);
            usuarioRepository.save(adminLogado);

            return empresaSalva.getId();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public EmpresaResponse BuscarEmpresaLogada(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        try {

            Empresa empresa = usuario.getEmpresa();

            if (empresa == null) {
                return null;
            }

            Usuario administrador =
                    usuarioRepository
                            .findByEmpresaAndRole(empresa, "ROLE_ADMIN_ONG")
                            .orElse(null);

            return new EmpresaResponse(empresa, administrador);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }



    @Transactional
    public boolean AlterarEmpresa(EmpresaRequest request) {

        Usuario usuarioLogado =
                (Usuario) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        Empresa empresa = usuarioLogado.getEmpresa();

        if (empresa == null) {
            return false;
        }

        empresa.setNameFantasia(request.nameFantasia());
        empresa.setRazaoSocial(request.razaoSocial());
        empresa.setCnpj(new CNPJ(request.cnpj()));

        Usuario administrador =
                empresa.getUsuarios()
                        .stream()
                        .filter(u -> u.getRole().equals("ROLE_ADMIN_ONG"))
                        .findFirst()
                        .orElse(null);

        if (administrador != null) {

            administrador.setName(request.usuarioAdmin().name());
            administrador.setEmail(request.usuarioAdmin().email());

            if (request.usuarioAdmin().senha() != null
                    && !request.usuarioAdmin().senha().isBlank()) {

                administrador.setSenha(request.usuarioAdmin().senha());
            }
            usuarioRepository.save(administrador);
        }
        empresaRepository.save(empresa);

        return true;
    }
}