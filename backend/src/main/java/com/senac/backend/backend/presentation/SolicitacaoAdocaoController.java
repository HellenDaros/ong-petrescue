package com.senac.backend.backend.presentation;

import com.senac.backend.backend.application.DTO.SolicitacaoAdocaoRequest;
import com.senac.backend.backend.application.DTO.SolicitacaoAdocaoResponse;
import com.senac.backend.backend.application.services.SolicitacaoAdocaoService;
import com.senac.backend.backend.domain.enuns.EnumStatusAdocao;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adocoes")
@Tag(name = "Gestão de Adoções", description = "Serviços para controle e solicitações de adoção de pets")
public class SolicitacaoAdocaoController {

    @Autowired
    private SolicitacaoAdocaoService solicitacaoAdocaoService;

    @PostMapping
    @Operation(summary = "Criar solicitação de adoção", description = "Cria uma nova solicitação de adoção para o adotante logado")
    public ResponseEntity<Long> criar(@RequestBody SolicitacaoAdocaoRequest request) {
        return ResponseEntity.ok(solicitacaoAdocaoService.criarSolicitacao(request));
    }

    @GetMapping("/minhas")
    @Operation(summary = "Listar minhas solicitações", description = "Retorna a lista de solicitações de adoção feitas pelo adotante logado")
    public ResponseEntity<List<SolicitacaoAdocaoResponse>> listarMinhas() {
        return ResponseEntity.ok(solicitacaoAdocaoService.listarMinhasSolicitacoes());
    }

    @GetMapping("/ong")
    @Operation(summary = "Listar solicitações recebidas pela ONG", description = "Retorna a lista de solicitações de adoção direcionadas à ONG logada")
    public ResponseEntity<List<SolicitacaoAdocaoResponse>> listarOng() {
        return ResponseEntity.ok(solicitacaoAdocaoService.listarSolicitacoesOng());
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Responder solicitação de adoção", description = "Aprova ou rejeita uma solicitação de adoção pendente")
    public ResponseEntity<?> responder(@PathVariable Long id, @RequestParam EnumStatusAdocao status) {
        boolean result = solicitacaoAdocaoService.responderSolicitacao(id, status);
        return result ? ResponseEntity.ok("Solicitação respondida com sucesso!") : ResponseEntity.notFound().build();
    }
}
