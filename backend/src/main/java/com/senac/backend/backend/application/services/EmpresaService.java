package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.EmpresaRequest;
import com.senac.backend.backend.application.DTO.EmpresaResponse;
import com.senac.backend.backend.domain.entities.Empresa;
import com.senac.backend.backend.domain.entities.Usuario;
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
                throw new RuntimeException("Já possui uma ONG vinculada.");
            }

            Empresa novaEmpresa = new Empresa(empresa);
            var empresaSalva = empresaRepository.save(novaEmpresa);


            Usuario adminOng =
                    new Usuario(
                            empresa.usuarioAdmin(),
                            empresaSalva
                    );

            adminOng = usuarioRepository.save(adminOng);

            empresaSalva.setAdministrador(adminOng);

            empresaRepository.save(empresaSalva);


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

            Usuario administrador = usuarioRepository
                    .findByEmpresa_IdAndRole(
                            empresa.getId(),
                            "ROLE_ADMIN_ONG"
                    )
                    .orElse(null);

            return new EmpresaResponse(empresa, administrador);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

  /*  public EmpresaResponse BuscarEmpresaPorId(Long id) {
        try {
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if (usuarioLogado.getEmpresa() != null && usuarioLogado.getEmpresa().getId().equals(id)) {
                var empresa = empresaRepository.findById(id).orElse(null);

                if (empresa != null) {
                    return new EmpresaResponse(empresa);
                }
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }*/


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

        Usuario administrador = empresa.getAdministrador();

        administrador.setName(request.usuarioAdmin().name());
        administrador.setEmail(request.usuarioAdmin().email());

        if (request.usuarioAdmin().senha() != null &&
                !request.usuarioAdmin().senha().isBlank()) {

            administrador.setSenha(request.usuarioAdmin().senha());
        }

        usuarioRepository.save(administrador);
        empresaRepository.save(empresa);

        return true;
    }

}
