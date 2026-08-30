package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.EnderecoResponse;
import com.senac.backend.backend.application.DTO.ViaCepResponse;
import com.senac.backend.backend.domain.entities.Endereco;
import com.senac.backend.backend.domain.repository.EnderecoRepository;
import com.senac.backend.backend.infra.external.ViaCepClient;
import org.springframework.stereotype.Service;

@Service
public class EnderecoService {

    private final ViaCepClient viaCepClient;
    private final EnderecoRepository enderecoRepository;

    public EnderecoService(ViaCepClient viaCepClient, EnderecoRepository enderecoRepository) {
        this.viaCepClient = viaCepClient;
        this.enderecoRepository = enderecoRepository;
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

    public Endereco buscarOuCriarEndereco(String cep) {
        EnderecoResponse enderecoFormatado = buscarEnderecoFormatado(cep);

        return enderecoRepository.findByCep(enderecoFormatado.cep())
                .orElseGet(() -> enderecoRepository.save(new Endereco(enderecoFormatado)));
    }
}
