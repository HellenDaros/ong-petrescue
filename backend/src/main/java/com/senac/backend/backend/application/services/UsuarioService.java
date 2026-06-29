package com.senac.backend.backend.application.services;
import com.senac.backend.backend.application.DTO.*;
import com.senac.backend.backend.domain.entities.Empresa;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.enuns.EnumStatusUsuario;
import com.senac.backend.backend.domain.exceptions.BusinessException;
import com.senac.backend.backend.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Value("${spring.secretkey}")
    private String secret;

    public boolean ValidaUsuarioSenha(LoginRequest loginRequest){
        try {
            boolean existe = usuarioRepository.existsUsuarioByEmailContainingAndSenha(loginRequest.email(), loginRequest.senha());
            if (!existe) {
                throw new BusinessException("Usuário ou senha inválidos.");
            }

            var usuario = usuarioRepository.findAll()
                    .stream()
                    .filter(u -> u.getEmail().equals(loginRequest.email()))
                    .findFirst()
                    .orElse(null);

            if (usuario != null && usuario.getStatus() != EnumStatusUsuario.ATIVO) {
                throw new BusinessException("Acesso não permitido. Seu usuário está inativo.");
            }

            return true;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e){
            throw new RuntimeException(e);
        }

    }

    public List<UsuarioResponse> ListarTodos() {
        try{
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            var empresa = usuarioLogado.getEmpresa();
            return usuarioRepository.getUsuariosByEmpresa_Id(empresa.getId())
                    .stream()
                    .map(UsuarioResponse::new)
                    .collect(Collectors.toList());
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
            usuarioBanco.setEmail(usuario.email());
            usuarioBanco.setName(usuario.name());
            usuarioBanco.setSenha(usuario.senha());

            usuarioRepository.save(usuarioBanco);
            return true;
        }
        return false;
    }
    public Long SalvarUsuario(UsuarioRequest usuario) {
        try {
            Usuario adminLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            Empresa empresaDaOng = adminLogado.getEmpresa();

            Usuario novoFuncionario = new Usuario(
                    usuario,
                    empresaDaOng,
                    "ROLE_FUNCIONARIO_ONG"
            );
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
                return usuarioRepository.save(new Usuario(usuario)).getId();
            }else
            {
                return 0L;
            }
        }catch (Exception e){
            throw new RuntimeException(e);
        }

    }

    public boolean AlterarStatus(Long id, AlterarStatusRequest statusRequest) {

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var usuarioBanco = usuarioRepository
                .findByIdAndEmpresa_Id(id, usuarioLogado.getEmpresa().getId())
                .orElse(null);

        if (usuarioBanco != null){
            usuarioBanco.setStatus(statusRequest.status());
            usuarioRepository.save(usuarioBanco);
            return true;
        }
        return false;
    }
}

