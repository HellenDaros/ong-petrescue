package com.senac.backend.backend.presentation;

import com.senac.backend.backend.application.DTO.EmpresaRequest;
import com.senac.backend.backend.application.DTO.EmpresaResponse;
import com.senac.backend.backend.application.services.EmpresaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping ("/empresa")
@Tag(name = "Gestão de ONG/Empresa", description = "Serviços para controle da empresa")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @GetMapping("/empresalogada")
    @Operation(summary = "Consulta empresa logada", description = "busca empresa da sessão")
    public ResponseEntity<EmpresaResponse> buscarEmpresaLogada(Authentication authentication){

        return ResponseEntity.ok(empresaService.BuscarEmpresaLogada(authentication));
    }

    @PostMapping
    @Operation(summary = "Criar nova empresa", description = "Cadastra uma nova empresa no sistema")
    public ResponseEntity<Long> salvar(@RequestBody EmpresaRequest empresa){
        return ResponseEntity.ok(empresaService.SalvarEmpresa(empresa));
    }

    @PutMapping
    @Operation(summary = "Atualizar empresa", description = "Altera os dados de uma empresa existente")
    public ResponseEntity<?> alterarEmpresa(@RequestBody EmpresaRequest empresa){

        boolean result = empresaService.AlterarEmpresa(empresa);

        return result
                ? ResponseEntity.ok("Atualizado com sucesso!")
                : ResponseEntity.notFound().build();
        }
}