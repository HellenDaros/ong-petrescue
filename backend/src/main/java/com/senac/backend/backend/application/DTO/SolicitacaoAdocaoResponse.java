package com.senac.backend.backend.application.DTO;

import com.senac.backend.backend.domain.entities.SolicitacaoAdocao;
import com.senac.backend.backend.domain.entities.TermoUso;
import java.time.LocalDateTime;
import java.util.List;

public record SolicitacaoAdocaoResponse(
        Long id,
        AdotanteResponse adotante,
        AnimalResponse animal,
        String ongNome,
        String cep,
        String endereco,
        String bairro,
        String cidade,
        String uf,
        String complemento,
        String statusAdocao,
        String assinaturaBase64,
        List<String> termosTitulos,
        String textoPadraoTitulo,
        String textoPadraoConteudo,
        LocalDateTime dataSolicitacao
) {
    public SolicitacaoAdocaoResponse(SolicitacaoAdocao solicitacao) {
        this(
                solicitacao.getId(),
                new AdotanteResponse(solicitacao.getAdotante()),
                new AnimalResponse(solicitacao.getAnimal()),
                solicitacao.getAnimal().getEmpresa() != null ? solicitacao.getAnimal().getEmpresa().getNameFantasia() : null,
                solicitacao.getEndereco() != null ? solicitacao.getEndereco().getCep() : null,
                solicitacao.getEndereco() != null ? solicitacao.getEndereco().getLogradouro() : null,
                solicitacao.getEndereco() != null ? solicitacao.getEndereco().getBairro() : null,
                solicitacao.getEndereco() != null ? solicitacao.getEndereco().getCidade() : null,
                solicitacao.getEndereco() != null ? solicitacao.getEndereco().getUf() : null,
                solicitacao.getComplemento(),
                solicitacao.getStatusAdocao().toString(),
                solicitacao.getAssinaturaBase64(),
                titulosAceitos(solicitacao),
                solicitacao.getTextoPadraoTitulo(),
                solicitacao.getTextoPadraoConteudo(),
                solicitacao.getDataSolicitacao()
        );
    }

    private static List<String> titulosAceitos(SolicitacaoAdocao solicitacao) {
        if (!solicitacao.getTermosTitulos().isEmpty()) {
            return List.copyOf(solicitacao.getTermosTitulos());
        }
        return solicitacao.getTermos().stream().map(TermoUso::getTitulo).toList();
    }

    public SolicitacaoAdocaoResponse semAssinatura() {
        return new SolicitacaoAdocaoResponse(id, adotante, animal, ongNome, cep, endereco, bairro, cidade, uf,
                complemento, statusAdocao, null, termosTitulos, textoPadraoTitulo, textoPadraoConteudo, dataSolicitacao);
    }
}
