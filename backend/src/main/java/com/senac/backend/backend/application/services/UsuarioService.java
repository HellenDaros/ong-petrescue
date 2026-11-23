package com.senac.backend.backend.application.services;
import com.senac.backend.backend.application.DTO.*;
import com.senac.backend.backend.domain.entities.Empresa;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.enuns.EnumStatusUsuario;
import com.senac.backend.backend.domain.exceptions.BusinessException;
import com.senac.backend.backend.domain.repository.UsuarioRepository;
import com.senac.backend.backend.domain.valueobjects.CPF;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${spring.secretkey}")
    private String secret;

    public boolean ValidaUsuarioSenha(LoginRequest loginRequest){
        try {
            var usuario = usuarioRepository.findByEmail(loginRequest.email()).orElse(null);

            if (usuario == null || !senhaConfere(usuario, loginRequest.senha())) {
                throw new BusinessException("Usuário ou senha inválidos.");
            }

            if (usuario.getStatus() != EnumStatusUsuario.ATIVO) {
                throw new BusinessException("Acesso não permitido. Seu usuário está inativo.");
            }

            return true;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e){
            throw new RuntimeException(e);
        }

    }

    private boolean senhaConfere(Usuario usuario, String senhaDigitada) {
        if (senhaDigitada == null || usuario.getSenha() == null) {
            return false;
        }

        return passwordEncoder.matches(senhaDigitada, usuario.getSenha());
    }

    public Page<UsuarioResponse> ListarTodos(int pagina, int tamanho, Long codigo, String nome, String email,
                                             String status, String ordenarPor, String direcao) {
        try{
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            var empresa = usuarioLogado.getEmpresa();

            Specification<Usuario> filtros = (root, query, cb) -> {
                List<Predicate> predicados = new ArrayList<>();
                predicados.add(cb.equal(root.get("empresa").get("id"), empresa.getId()));

                if (codigo != null) {
                    predicados.add(cb.equal(root.get("id"), codigo));
                }
                if (nome != null && !nome.isBlank()) {
                    predicados.add(cb.like(cb.lower(root.get("name")), "%" + nome.trim().toLowerCase() + "%"));
                }
                if (email != null && !email.isBlank()) {
                    predicados.add(cb.like(cb.lower(root.get("email")), "%" + email.trim().toLowerCase() + "%"));
                }
                if (status != null && !status.isBlank()) {
                    try {
                        predicados.add(cb.equal(root.get("status"), EnumStatusUsuario.valueOf(status.trim().toUpperCase())));
                    } catch (IllegalArgumentException e) {
                    }
                }
                return cb.and(predicados.toArray(new Predicate[0]));
            };

            String campoOrdenacao = "nome".equalsIgnoreCase(ordenarPor) ? "name" : "id";
            Sort ordenacao = "asc".equalsIgnoreCase(direcao)
                    ? Sort.by(campoOrdenacao).ascending()
                    : Sort.by(campoOrdenacao).descending();

            return usuarioRepository.findAll(filtros, PageRequest.of(pagina, tamanho, ordenacao))
                    .map(UsuarioResponse::new);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public UsuarioResponse BuscarUsuarioLogado(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        try{
            return  usuarioRepository.findById(usuario.getId())
                    .stream().map(UsuarioResponse::new).findFirst().orElse(null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public UsuarioResponse BuscarUsuarioPorId(Long id) {
        try{
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            var usuario = usuarioRepository.findByIdAndEmpresa_Id(id,usuarioLogado.getEmpresa().getId()).orElse(null);
            return new UsuarioResponse(usuario);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean AterarUsuario(Long id, UsuarioRequest usuario) {

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var usuarioBanco = usuarioRepository
                .findByIdAndEmpresa_Id(id, usuarioLogado.getEmpresa().getId())
                .orElse(null);

        if (usuarioBanco != null){
            if (usuarioRepository.existsByEmailAndIdNot(usuario.email(), id)) {
                throw new BusinessException("E-mail já cadastrado.");
            }

            if (usuario.cpf() != null && usuarioRepository.existsByCpf_CpfAndIdNot(usuario.cpf(), id)) {
                throw new BusinessException("CPF já cadastrado.");
            }

            usuarioBanco.setEmail(usuario.email());
            usuarioBanco.setName(usuario.name());
            usuarioBanco.setCpf(new CPF(usuario.cpf()));

            if (usuario.senha() != null && !usuario.senha().isBlank()) {
                usuarioBanco.setSenha(passwordEncoder.encode(usuario.senha()));
            }

            usuarioRepository.save(usuarioBanco);
            return true;
        }
        return false;
    }
    public Long SalvarUsuario(UsuarioRequest usuario) {
        try {
            Usuario adminLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            Empresa empresaDaOng = adminLogado.getEmpresa();

            if (usuario.senha() == null || usuario.senha().isBlank()) {
                throw new BusinessException("Informe a senha do usuário.");
            }

            if (usuarioRepository.existsByEmail(usuario.email())) {
                throw new BusinessException("E-mail já cadastrado.");
            }

            if (usuario.cpf() != null && usuarioRepository.existsByCpf_Cpf(usuario.cpf())) {
                throw new BusinessException("CPF já cadastrado.");
            }

            Usuario novoFuncionario = new Usuario(
                    usuario,
                    empresaDaOng,
                    "ROLE_FUNCIONARIO_ONG"
            );
            novoFuncionario.setSenha(passwordEncoder.encode(novoFuncionario.getSenha()));
            return usuarioRepository.save(novoFuncionario).getId();
        } catch (Exception e) {
            if (e instanceof BusinessException businessException) {
                throw businessException;
            }
            throw new BusinessException("Ocorreu um erro interno ao tentar processar este usuário.");
        }
    }

    public Long SalvarUsuarioAdmin(UsuarioAdmRequest usuario) {

        try {

            if(usuario.secretKey().equals( secret)) {
                if (usuario.senha() == null || usuario.senha().isBlank()) {
                    throw new BusinessException("Informe a senha do usuário.");
                }

                if (usuarioRepository.existsByEmail(usuario.email())) {
                    throw new BusinessException("E-mail já cadastrado.");
                }

                if (usuario.cpf() != null && !usuario.cpf().isBlank()
                        && usuarioRepository.existsByCpf_Cpf(usuario.cpf())) {
                    throw new BusinessException("CPF já cadastrado.");
                }

                Usuario novoAdmin = new Usuario(usuario);
                novoAdmin.setSenha(passwordEncoder.encode(novoAdmin.getSenha()));
                return usuarioRepository.save(novoAdmin).getId();
            }else
            {
                return 0L;
            }
        }catch (Exception e){
            if (e instanceof BusinessException businessException) {
                throw businessException;
            }
            throw new RuntimeException(e);
        }

    }

    public boolean AlterarStatus(Long id, AlterarStatusRequest statusRequest) {

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var usuarioBanco = usuarioRepository
                .findByIdAndEmpresa_Id(id, usuarioLogado.getEmpresa().getId())
                .orElse(null);

        if (usuarioBanco != null){
            if ("ROLE_ADMIN".equals(usuarioBanco.getRole())) {
                throw new BusinessException("O usuário administrador não pode ser inativado.");
            }

            usuarioBanco.setStatus(statusRequest.status());
            usuarioRepository.save(usuarioBanco);
            return true;
        }
        return false;
    }
}

