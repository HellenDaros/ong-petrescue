package com.senac.backend.backend.domain.entities;

import com.senac.backend.backend.domain.enuns.EnumStatusEvento;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "evento")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private LocalDate data;

    private LocalTime horarioInicio;

    private LocalTime horarioTermino;

    private String nomeLocal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "endereco_id", referencedColumnName = "id")
    private Endereco endereco;

    private String complemento;

    private String urlCapa;

    @Enumerated(EnumType.STRING)
    private EnumStatusEvento status = EnumStatusEvento.AGENDADO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", referencedColumnName = "id")
    private Empresa empresa;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "evento_animal",
            joinColumns = @JoinColumn(name = "evento_id"),
            inverseJoinColumns = @JoinColumn(name = "animal_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"evento_id", "animal_id"})
    )
    private List<Animal> animais = new ArrayList<>();
}
