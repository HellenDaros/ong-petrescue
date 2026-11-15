package com.senac.backend.backend.presentation;

import com.senac.backend.backend.application.DTO.DashboardResponse;
import com.senac.backend.backend.application.services.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@Tag(name = "Dashboard", description = "Indicadores da ONG")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Buscar indicadores da ONG", description = "Retorna a quantidade de animais por status e de solicitações de adoção pendentes da ONG logada")
    public ResponseEntity<DashboardResponse> buscarIndicadores() {
        return ResponseEntity.ok(dashboardService.buscarIndicadores());
    }
}
