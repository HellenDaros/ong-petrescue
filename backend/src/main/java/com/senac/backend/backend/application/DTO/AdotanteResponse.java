package com.senac.backend.backend.application.DTO;
import com.senac.backend.backend.domain.entities.Adotante;

public record AdotanteResponse(
        Long id,
        String name,
        String email,
        String cpf,
        String identidade,
        String cep,
        String endereco,
        String bairro,
        String cidade,
        String uf,
        String profissao,
        String telefoneFixo,
        String telefoneMovel
) {

    public AdotanteResponse(Adotante adotante) {
        this(
                adotante.getId(),
                adotante.getUsuario().getName(),
                adotante.getUsuario().getEmail(),
                adotante.getUsuario().getCpf() != null ? adotante.getUsuario().getCpf().toString() : null,
                adotante.getIdentidade(),
                adotante.getCep(),
                adotante.getEndereco(),
                adotante.getBairro(),
                adotante.getCidade(),
                adotante.getUf(),
                adotante.getProfissao(),
                adotante.getTelefoneFixo(),
                adotante.getTelefoneMovel()
        );
    }
}

