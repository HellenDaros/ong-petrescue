package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.domain.enuns.EnumStatusAdocao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacao_adocao")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolicitacaoAdocao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "adotante_id", nullable = false)
    private Adotante adotante;

    @ManyToOne
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    private String enderecoAnimal;

    @Enumerated(EnumType.STRING)
    private EnumStatusAdocao statusAdocao = EnumStatusAdocao.PENDENTE;

    @Column(columnDefinition = "TEXT")
    private String assinaturaBase64;

    private LocalDateTime dataSolicitacao = LocalDateTime.now();
}
