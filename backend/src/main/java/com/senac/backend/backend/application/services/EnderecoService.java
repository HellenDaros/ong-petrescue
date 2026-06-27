package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.EnderecoResponse;
import com.senac.backend.backend.application.DTO.ViaCepResponse;
import com.senac.backend.backend.infra.external.ViaCepClient;
import org.springframework.stereotype.Service;

@Service
public class EnderecoService {

    private final ViaCepClient viaCepClient;

    public EnderecoService(ViaCepClient viaCepClient) {
        this.viaCepClient = viaCepClient;
    }

    public EnderecoResponse buscarEnderecoFormatado(String cep) {
        // 1. Orquestra a chamada para a Infra
        ViaCepResponse response = viaCepClient.consultarCep(cep);

        // 2. Converte o DTO externo para o Modelo interno
        EnderecoResponse endereco = new EnderecoResponse(
                response.getCep(),
                response.getLogradouro(),
                response.getBairro(),
                response.getLocalidade(),
                response.getUf() );

        return endereco;
    }
}
