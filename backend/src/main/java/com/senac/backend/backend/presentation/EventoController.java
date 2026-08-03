package com.senac.backend.backend.presentation;

import com.senac.backend.backend.application.DTO.AlterarStatusEventoRequest;
import com.senac.backend.backend.application.DTO.EventoRequest;
import com.senac.backend.backend.application.DTO.EventoResponse;
import com.senac.backend.backend.application.services.EventoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos")
@Tag(name = "Gestão de Eventos", description = "Serviços para gerenciamento de eventos de adoção da ONG")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @GetMapping("/publicos")
    @Operation(summary = "Listar eventos públicos", description = "Retorna a lista de eventos em rota pública")
    public ResponseEntity<List<EventoResponse>> listarPublicos() {
        return ResponseEntity.ok(eventoService.listarPublicos());
    }

    @GetMapping("/publicos/{id}")
    @Operation(summary = "Buscar evento público por ID", description = "Retorna detalhes públicos de um evento específico para visitantes")
    public ResponseEntity<EventoResponse> buscarPublicoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.buscarPublicoPorId(id));
    }

    @GetMapping
    @Operation(summary = "Listar eventos da ONG", description = "Retorna os eventos da ONG do usuário autenticado")
    public ResponseEntity<List<EventoResponse>> listarTodosPorOng() {
        return ResponseEntity.ok(eventoService.listarTodosPorOng());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar evento por ID", description = "Retorna os detalhes de um evento da ONG")
    public ResponseEntity<EventoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Cadastrar evento", description = "Adiciona um novo evento para a ONG")
    public ResponseEntity<Long> salvar(@RequestBody EventoRequest request) {
        return ResponseEntity.ok(eventoService.salvarEvento(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar evento", description = "Altera informações e animais participantes de um evento")
    public ResponseEntity<?> alterarEvento(@PathVariable Long id, @RequestBody EventoRequest request) {
        boolean result = eventoService.alterarEvento(id, request);
        return result ? ResponseEntity.ok("Evento atualizado com sucesso!") : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Alterar status do evento", description = "Atualiza o estado do evento (AGENDADO ou ENCERRADO)")
    public ResponseEntity<?> alterarStatus(@PathVariable Long id, @RequestBody AlterarStatusEventoRequest request) {
        boolean result = eventoService.alterarStatus(id, request);
        return result ? ResponseEntity.ok("Status do evento atualizado com sucesso!") : ResponseEntity.notFound().build();
    }
}
