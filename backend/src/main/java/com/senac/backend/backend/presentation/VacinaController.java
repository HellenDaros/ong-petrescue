package com.senac.backend.backend.presentation;

import com.senac.backend.backend.application.DTO.VacinaRequest;
import com.senac.backend.backend.application.DTO.VacinaResponse;
import com.senac.backend.backend.application.services.VacinaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vacinas")
@Tag(name = "Vacinas", description = "Vacinas cadastradas pela ONG para uso no cadastro dos animais")
public class VacinaController {

    @Autowired
    private VacinaService vacinaService;

    @GetMapping
    @Operation(summary = "Listar vacinas da ONG", description = "Retorna as vacinas cadastradas pela ONG do usuário autenticado")
    public ResponseEntity<List<VacinaResponse>> listar() {
        return ResponseEntity.ok(vacinaService.listar());
    }

    @PostMapping
    @Operation(summary = "Cadastrar vacina", description = "Cadastra uma nova vacina para a ONG")
    public ResponseEntity<VacinaResponse> salvar(@RequestBody VacinaRequest request) {
        return ResponseEntity.ok(vacinaService.salvar(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar vacina", description = "Altera o nome da vacina")
    public ResponseEntity<VacinaResponse> alterar(@PathVariable Long id, @RequestBody VacinaRequest request) {
        return ResponseEntity.ok(vacinaService.alterar(id, request));
    }
}
