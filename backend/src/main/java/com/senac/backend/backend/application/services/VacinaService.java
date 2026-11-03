package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.VacinaRequest;
import com.senac.backend.backend.application.DTO.VacinaResponse;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.entities.Vacina;
import com.senac.backend.backend.domain.exceptions.BusinessException;
import com.senac.backend.backend.domain.repository.VacinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VacinaService {

    @Autowired
    private VacinaRepository vacinaRepository;

    private Usuario usuarioDaOng() {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (usuarioLogado.getEmpresa() == null) {
            throw new BusinessException("Usuário não possui uma ONG associada.");
        }
        return usuarioLogado;
    }

    private String nomeValido(VacinaRequest request) {
        if (request.nome() == null || request.nome().isBlank()) {
            throw new BusinessException("Informe o nome da vacina.");
        }
        return request.nome().trim();
    }

    @Transactional(readOnly = true)
    public List<VacinaResponse> listar() {
        return vacinaRepository.findByEmpresa_IdOrderByNomeAsc(usuarioDaOng().getEmpresa().getId()).stream()
                .map(VacinaResponse::new)
                .toList();
    }

    @Transactional
    public VacinaResponse salvar(VacinaRequest request) {
        String nome = nomeValido(request);
        Usuario usuario = usuarioDaOng();
        if (vacinaRepository.existsByEmpresa_IdAndNomeIgnoreCase(usuario.getEmpresa().getId(), nome)) {
            throw new BusinessException("Já existe uma vacina com esse nome.");
        }

        Vacina vacina = new Vacina();
        vacina.setNome(nome);
        vacina.setEmpresa(usuario.getEmpresa());
        return new VacinaResponse(vacinaRepository.save(vacina));
    }

    @Transactional
    public VacinaResponse alterar(Long id, VacinaRequest request) {
        String nome = nomeValido(request);
        Long empresaId = usuarioDaOng().getEmpresa().getId();
        Vacina vacina = vacinaRepository.findByIdAndEmpresa_Id(id, empresaId)
                .orElseThrow(() -> new BusinessException("Vacina não encontrada."));
        if (vacinaRepository.existsByEmpresa_IdAndNomeIgnoreCaseAndIdNot(empresaId, nome, id)) {
            throw new BusinessException("Já existe uma vacina com esse nome.");
        }

        vacina.setNome(nome);
        return new VacinaResponse(vacinaRepository.save(vacina));
    }
}
