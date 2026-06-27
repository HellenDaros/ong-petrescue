package com.senac.backend.backend.presentation;


import com.senac.backend.backend.application.DTO.EnderecoResponse;
import com.senac.backend.backend.application.services.EnderecoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {

    private final EnderecoService enderecoService;

    public EnderecoController(EnderecoService enderecoService) {
        this.enderecoService = enderecoService;
    }

    @GetMapping("/{cep}")
    public ResponseEntity<EnderecoResponse> buscarEndereco(@PathVariable String cep) {
        return ResponseEntity.ok(enderecoService.buscarEnderecoFormatado(cep));
    }
}
