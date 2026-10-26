package com.senac.backend.backend.presentation;

import com.senac.backend.backend.application.DTO.AlterarStatusTermoRequest;
import com.senac.backend.backend.application.DTO.TermoUsoRequest;
import com.senac.backend.backend.application.DTO.TermoUsoResponse;
import com.senac.backend.backend.application.services.TermoUsoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/termos")
@Tag(name = "Termos de Uso", description = "Termos e leis cadastrados pela ONG para aceite na solicitação de adoção")
public class TermoUsoController {

    @Autowired
    private TermoUsoService termoUsoService;

    @GetMapping
    @Operation(summary = "Listar termos da ONG", description = "Retorna os termos cadastrados pela ONG do usuário autenticado")
    public ResponseEntity<List<TermoUsoResponse>> listar() {
        return ResponseEntity.ok(termoUsoService.listar());
    }

    @GetMapping("/ativo")
    @Operation(summary = "Buscar termos vigentes do animal", description = "Retorna os termos ativos da ONG responsável pelo animal (lista vazia se não houver)")
    public ResponseEntity<List<TermoUsoResponse>> buscarAtivos(@RequestParam Long animalId) {
        return ResponseEntity.ok(termoUsoService.buscarAtivosDoAnimal(animalId));
    }

    @PostMapping
    @Operation(summary = "Cadastrar termo", description = "Cadastra um novo termo (já inicia ativo)")
    public ResponseEntity<Long> salvar(@RequestBody TermoUsoRequest request) {
        return ResponseEntity.ok(termoUsoService.salvar(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar termo", description = "Altera título e conteúdo do termo e registra a data da última edição")
    public ResponseEntity<String> alterar(@PathVariable Long id, @RequestBody TermoUsoRequest request) {
        termoUsoService.alterar(id, request);
        return ResponseEntity.ok("Termo atualizado com sucesso!");
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Alterar status do termo", description = "Ativa ou desativa o termo, sem afetar os demais termos da ONG")
    public ResponseEntity<String> alterarStatus(@PathVariable Long id, @RequestBody AlterarStatusTermoRequest request) {
        termoUsoService.alterarStatus(id, request);
        return ResponseEntity.ok("Status do termo atualizado com sucesso!");
    }
}
