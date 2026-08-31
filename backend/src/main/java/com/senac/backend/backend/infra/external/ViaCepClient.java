package com.senac.backend.backend.infra.external;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.senac.backend.backend.application.DTO.ViaCepResponse;
import com.senac.backend.backend.domain.exceptions.BusinessException;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Component
public class ViaCepClient {

    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ViaCepResponse consultarCep(String cep) {
        String cepLimpo = cep == null ? "" : cep.replaceAll("[^0-9]", "");

        if (cepLimpo.length() != 8) {
            throw new BusinessException("CEP inválido. Informe um CEP com 8 dígitos.");
        }

        String url = "https://viacep.com.br/ws/" + cepLimpo + "/json/";

        HttpResponse<String> response;
        try {
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
            response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            throw new BusinessException("Falha na comunicação com o ViaCEP. Tente novamente.");
        }

        if (response.statusCode() != 200) {
            throw new BusinessException("Erro ao consultar a API do ViaCEP.");
        }

        ViaCepResponse viaCepResponse;
        try {
            viaCepResponse = objectMapper.readValue(response.body(), ViaCepResponse.class);
        } catch (Exception e) {
            throw new BusinessException("Erro ao interpretar a resposta do ViaCEP.");
        }

        if (viaCepResponse.getErro() != null && viaCepResponse.getErro()) {
            throw new BusinessException("CEP não encontrado. Verifique o número informado.");
        }

        return viaCepResponse;
    }
}
