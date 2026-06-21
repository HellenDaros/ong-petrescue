package com.senac.backend.backend.presentation;

import com.senac.backend.backend.application.DTO.AdotanteRequest;
import com.senac.backend.backend.application.DTO.AdotanteResponse;
import com.senac.backend.backend.application.services.AdotanteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/adotantes")
@Tag(name = "Gestão de Adotantes", description = "Serviços para controle dos perfis de adotantes")
public class AdotanteController {

    @Autowired
    private AdotanteService adotanteService;

    @GetMapping("/{id}")
    @Operation(summary = "Buscar por ID", description = "Busca os detalhes de um perfil de adotante específico através do código identificador")
    public ResponseEntity<AdotanteResponse> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok( adotanteService.BuscarAdotantePorId(id));
    }

    @GetMapping("/adotantelogado")
    public ResponseEntity<AdotanteResponse> buscarAdotanteLogado(
            Authentication authentication) {

        return ResponseEntity.ok(
                adotanteService.BuscarAdotanteLogado(authentication)
        );
    }

    @PostMapping
    @Operation(summary = "Criar novo adotante", description = "Cadastra um novo perfil de adotante e seu usuário de acesso")
    public ResponseEntity<Long> salvar(@RequestBody AdotanteRequest adotante){
        return ResponseEntity.ok(adotanteService.SalvarAdotante(adotante));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar adotante", description = "Altera os dados de um perfil de adotante existente e seu usuário vinculado")
    public ResponseEntity<?> alterarAdotante(@PathVariable Long id, @RequestBody AdotanteRequest adotante){

        var alterarResult = adotanteService.AlterarAdotante(id, adotante);
        return alterarResult ? ResponseEntity.ok("Perfil atualizado com sucesso!") : ResponseEntity.notFound().build();
    }
}


