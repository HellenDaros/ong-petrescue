package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.EmpresaRequest;
import com.senac.backend.backend.application.DTO.EmpresaResponse;
import com.senac.backend.backend.domain.entities.Empresa;
import com.senac.backend.backend.domain.entities.Endereco;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.exceptions.BusinessException;
import com.senac.backend.backend.domain.repository.EmpresaRepository;
import com.senac.backend.backend.domain.repository.UsuarioRepository;
import com.senac.backend.backend.domain.valueobjects.CNPJ;
import com.senac.backend.backend.domain.valueobjects.CPF;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EnderecoService enderecoService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Long SalvarEmpresa(EmpresaRequest empresa) {
        try {
            Usuario adminLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if (adminLogado.getEmpresa() != null) {
                throw new BusinessException("Já possui uma ONG vinculada.");
            }

            if (empresa.usuarioAdmin().senha() == null || empresa.usuarioAdmin().senha().isBlank()) {
                throw new BusinessException("Informe a senha do usuário.");
            }

            if (usuarioRepository.existsByEmail(empresa.usuarioAdmin().email())) {
                throw new BusinessException("E-mail já cadastrado.");
            }

            if (empresa.usuarioAdmin().cpf() != null
                    && usuarioRepository.existsByCpf_Cpf(empresa.usuarioAdmin().cpf())) {
                throw new BusinessException("CPF já cadastrado.");
            }

            Endereco endereco = enderecoService.buscarOuCriarEndereco(empresa.cep());

            Empresa empresaSalva =
                    empresaRepository.save(
                            new Empresa(empresa, endereco)
                    );

            Usuario adminOng =
                    new Usuario(
                            empresa.usuarioAdmin(),
                            empresaSalva,
                            "ROLE_ADMIN_ONG"
                    );
            adminOng.setSenha(passwordEncoder.encode(adminOng.getSenha()));

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

            if (usuario.getEmpresa() == null) {
                return null;
            }

            Empresa empresa = empresaRepository.findById(usuario.getEmpresa().getId())
                    .orElse(null);

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

        if (usuarioLogado.getEmpresa() == null) {
            return false;
        }

        Empresa empresa = empresaRepository.findById(usuarioLogado.getEmpresa().getId())
                .orElse(null);

        if (empresa == null) {
            return false;
        }

        empresa.setNameFantasia(request.nameFantasia());
        empresa.setRazaoSocial(request.razaoSocial());
        empresa.setCnpj(new CNPJ(request.cnpj()));

        Endereco endereco = enderecoService.buscarOuCriarEndereco(request.cep());

        empresa.setEndereco(endereco);
        empresa.setComplemento(request.complemento());

        Usuario administrador =
                empresa.getUsuarios()
                        .stream()
                        .filter(u -> u.getRole().equals("ROLE_ADMIN_ONG"))
                        .findFirst()
                        .orElse(null);

        if (administrador != null) {

            if (usuarioRepository.existsByEmailAndIdNot(request.usuarioAdmin().email(), administrador.getId())) {
                throw new BusinessException("E-mail já cadastrado.");
            }

            if (request.usuarioAdmin().cpf() != null
                    && usuarioRepository.existsByCpf_CpfAndIdNot(request.usuarioAdmin().cpf(), administrador.getId())) {
                throw new BusinessException("CPF já cadastrado.");
            }

            administrador.setName(request.usuarioAdmin().name());
            administrador.setEmail(request.usuarioAdmin().email());
            administrador.setCpf(new CPF(request.usuarioAdmin().cpf()));

            if (request.usuarioAdmin().senha() != null
                    && !request.usuarioAdmin().senha().isBlank()) {

                administrador.setSenha(passwordEncoder.encode(request.usuarioAdmin().senha()));
            }
            usuarioRepository.save(administrador);
        }
        empresaRepository.save(empresa);

        return true;
    }
}