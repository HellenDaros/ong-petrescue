package com.senac.backend.backend.presentation;

import com.senac.backend.backend.application.DTO.AlterarStatusAnimalRequest;
import com.senac.backend.backend.application.DTO.AnimalRequest;
import com.senac.backend.backend.application.DTO.AnimalResponse;
import com.senac.backend.backend.application.services.AnimalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/animais")
@Tag(name = "Gestão de Animais", description = "Serviços para controle do catálogo de pets")
public class AnimalController {


    @Autowired
    private AnimalService animalService;

    @GetMapping
    @Operation(summary = "Listar os pets por ONG", description = "Retorna a lista de animais cadastrados por ONG")
    public ResponseEntity<List<AnimalResponse>> listarTodos(){

        var animais = animalService.ListarTodos();
        return ResponseEntity.ok(animais);
    }

    @GetMapping("/publicos")
    @Operation(summary = "Listar os pets disoníveis público", description = "Retorna a lista de animais disponiveis em rota pública")
    public ResponseEntity<List<AnimalResponse>> listarPublicos() {
        return ResponseEntity.ok(animalService.listarPublicos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar pet por ID", description = "Retorna os detalhes de um animal específico")
    public ResponseEntity<AnimalResponse> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(animalService.BuscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Cadastrar novo pet", description = "Adiciona um novo animal ao sistema")
    public  ResponseEntity<Long> salvar(@RequestBody AnimalRequest animal){
        return  ResponseEntity.ok(animalService.SalvarAnimal(animal));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar dados do pet", description = "Altera informações de um animal já cadastrado")
    public ResponseEntity<?> alterarAnimal(@PathVariable Long id, @RequestBody AnimalRequest animal){

        var alterarAnimalResult = animalService.AlterarAnimal(id,animal);
        return alterarAnimalResult ? ResponseEntity.ok("Atualizado com sucesso!") : ResponseEntity.notFound().build();

    }

    @PutMapping("/{id}/AlterarStatusAnimal")
    @Operation(summary = "Alterar Status de Adoção", description = "Atualiza o estado do animal (ex: Disponível, Inativo, Adotado)")
    public  ResponseEntity<?> AlterarStatusAnimal(@PathVariable Long id, @RequestBody AlterarStatusAnimalRequest statusAnimalRequest) {
        boolean alterarStatusAnimalResult = animalService.AlterarStatus(id,statusAnimalRequest);
        return alterarStatusAnimalResult ? ResponseEntity.ok("Status atualizado com sucesso!") : ResponseEntity.notFound().build();
    }
}