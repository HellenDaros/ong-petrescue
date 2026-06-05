package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.AdotanteRequest;
import com.senac.backend.backend.application.DTO.AdotanteResponse;
import com.senac.backend.backend.domain.entities.Adotante;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.repository.AdotanteRepository;
import com.senac.backend.backend.domain.repository.UsuarioRepository;
import com.senac.backend.backend.domain.valueobjects.CPF;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdotanteService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AdotanteRepository adotanteRepository;

    public Long SalvarAdotante(AdotanteRequest adotante) {
        try {
            Usuario usuarioSalvo = usuarioRepository.save(new Usuario(adotante));
            return adotanteRepository.save(new Adotante(adotante, usuarioSalvo)).getId();
        } catch (Exception e) {
            throw new RuntimeException(e);
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

    public boolean AlterarAdotante(Long id, AdotanteRequest adotante) {
        var adotanteBanco = adotanteRepository.findById(id).orElse(null);

        if (adotanteBanco != null) {

            adotanteBanco.setIdentidade(adotante.identidade());
            adotanteBanco.setEndereco(adotante.endereco());
            adotanteBanco.setBairro(adotante.bairro());
            adotanteBanco.setCidade(adotante.cidade());
            adotanteBanco.setUf(adotante.uf());
            adotanteBanco.setProfissao(adotante.profissao());
            adotanteBanco.setTelefoneFixo(adotante.telefoneFixo());
            adotanteBanco.setTelefoneMovel(adotante.telefoneMovel());

            adotanteRepository.save(adotanteBanco);

            var usuarioBanco = adotanteBanco.getUsuario();
            usuarioBanco.setName(adotante.name());
            usuarioBanco.setEmail(adotante.email());
            usuarioBanco.setSenha(adotante.senha());
            usuarioBanco.setCpf(new CPF(adotante.cpf()));

            usuarioRepository.save(usuarioBanco);

            return true;
        }

        return false;
    }
}
