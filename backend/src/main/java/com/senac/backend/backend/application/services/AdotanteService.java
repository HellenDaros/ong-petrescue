package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.AdotanteRequest;
import com.senac.backend.backend.application.DTO.AdotanteResponse;
import com.senac.backend.backend.application.DTO.EnderecoResponse;
import com.senac.backend.backend.domain.entities.Adotante;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.exceptions.BusinessException;
import com.senac.backend.backend.domain.repository.AdotanteRepository;
import com.senac.backend.backend.domain.repository.UsuarioRepository;
import com.senac.backend.backend.domain.valueobjects.CPF;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdotanteService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AdotanteRepository adotanteRepository;

    @Autowired
    private EnderecoService enderecoService;

    @Transactional
    public Long SalvarAdotante(AdotanteRequest adotante) {
        try {
            Usuario usuarioSalvo = usuarioRepository.save(new Usuario(adotante));
            EnderecoResponse endereco =
                    enderecoService.buscarEnderecoFormatado(adotante.cep());

            return adotanteRepository.save(
                    new Adotante(adotante, usuarioSalvo, endereco)
            ).getId();

        } catch (Exception e) {
            if (e instanceof BusinessException businessException) {
                throw businessException;
            }
            throw new BusinessException("Ocorreu um erro interno ao tentar processar este usuário.");
        }
    }

    public AdotanteResponse BuscarAdotantePorId(Long id) {
        try {
            var adotante = adotanteRepository.findById(id).orElse(null);
                return new AdotanteResponse(adotante);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public AdotanteResponse BuscarAdotanteLogado(Authentication authentication) {

        Usuario usuario = (Usuario) authentication.getPrincipal();

        var adotante = adotanteRepository
                .findByUsuario_Id(usuario.getId())
                .orElse(null);

        if (adotante == null) {
            return null;
        }

        return new AdotanteResponse(adotante);
    }

    @Transactional
    public boolean AlterarAdotante(Long id, AdotanteRequest adotante) {
        var adotanteBanco = adotanteRepository.findById(id).orElse(null);

        if (adotanteBanco != null) {

            adotanteBanco.setIdentidade(adotante.identidade());
            EnderecoResponse endereco =
                    enderecoService.buscarEnderecoFormatado(adotante.cep());
            adotanteBanco.setEndereco(endereco.logradouro());
            adotanteBanco.setBairro(endereco.bairro());
            adotanteBanco.setCidade(endereco.cidade());
            adotanteBanco.setUf(endereco.uf());
            adotanteBanco.setComplemento(adotante.complemento());
            adotanteBanco.setProfissao(adotante.profissao());
            adotanteBanco.setTelefoneFixo(adotante.telefoneFixo());
            adotanteBanco.setTelefoneMovel(adotante.telefoneMovel());

            adotanteRepository.save(adotanteBanco);

            var usuarioBanco = adotanteBanco.getUsuario();
            usuarioBanco.setName(adotante.name());
            usuarioBanco.setEmail(adotante.email());
            usuarioBanco.setSenha(adotante.senha());

            usuarioRepository.save(usuarioBanco);

            return true;
        }

        return false;
    }
}
