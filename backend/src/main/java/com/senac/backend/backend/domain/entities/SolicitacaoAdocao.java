package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.domain.enuns.EnumStatusAdocao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "endereco_id", referencedColumnName = "id")
    private Endereco endereco;

    private String complemento;

    @Enumerated(EnumType.STRING)
    private EnumStatusAdocao statusAdocao = EnumStatusAdocao.PENDENTE;

    @Column(columnDefinition = "TEXT")
    private String assinaturaBase64;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "solicitacao_termo",
            joinColumns = @JoinColumn(name = "solicitacao_id"),
            inverseJoinColumns = @JoinColumn(name = "termo_id")
    )
    private List<TermoUso> termos = new ArrayList<>();

   @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "solicitacao_termo_titulo", joinColumns = @JoinColumn(name = "solicitacao_id"))
    @Column(name = "titulo")
    private List<String> termosTitulos = new ArrayList<>();

    private String textoPadraoTitulo;

    @Column(columnDefinition = "TEXT")
    private String motivoRecusa;

    @Column(columnDefinition = "TEXT")
    private String textoPadraoConteudo;

    private LocalDateTime dataSolicitacao = LocalDateTime.now();
}
