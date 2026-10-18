package com.senac.backend.backend.application.services;

import com.senac.backend.backend.application.DTO.SolicitacaoAdocaoRequest;
import com.senac.backend.backend.application.DTO.SolicitacaoAdocaoResponse;
import com.senac.backend.backend.domain.entities.Adotante;
import com.senac.backend.backend.domain.entities.Animal;
import com.senac.backend.backend.domain.entities.Endereco;
import com.senac.backend.backend.domain.entities.SolicitacaoAdocao;
import com.senac.backend.backend.domain.entities.Usuario;
import com.senac.backend.backend.domain.enuns.EnumEspecieAnimal;
import com.senac.backend.backend.domain.enuns.EnumStatusAdocao;
import com.senac.backend.backend.domain.enuns.EnumStatusAnimal;
import com.senac.backend.backend.domain.repository.AdotanteRepository;
import com.senac.backend.backend.domain.repository.AnimalRepository;
import com.senac.backend.backend.domain.repository.SolicitacaoAdocaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitacaoAdocaoService {

    @Autowired
    private SolicitacaoAdocaoRepository solicitacaoAdocaoRepository;

    @Autowired
    private AdotanteRepository adotanteRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private EnderecoService enderecoService;

    @Transactional
    public Long criarSolicitacao(SolicitacaoAdocaoRequest request) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Adotante adotante = adotanteRepository.findByUsuario_Id(usuarioLogado.getId())
                .orElseThrow(() -> new RuntimeException("Perfil de adotante não encontrado para o usuário logado."));

        Animal animal = animalRepository.findById(request.animalId())
                .orElseThrow(() -> new RuntimeException("Animal não encontrado."));

        if (animal.getStatusAnimal() != EnumStatusAnimal.DISPONIVEL) {
            throw new RuntimeException("Animal não está disponível para adoção.");
        }

        if (request.assinaturaBase64() == null || request.assinaturaBase64().isBlank()) {
            throw new RuntimeException("É necessário assinar o termo de adoção antes de enviar a solicitação.");
        }

        if (request.cep() == null || request.cep().isBlank()) {
            throw new RuntimeException("Informe o CEP do endereço onde o animal ficará.");
        }

        SolicitacaoAdocao solicitacao = new SolicitacaoAdocao();
        solicitacao.setAdotante(adotante);
        solicitacao.setAnimal(animal);
        Endereco endereco = enderecoService.buscarOuCriarEndereco(request.cep());
        solicitacao.setEndereco(endereco);
        solicitacao.setComplemento(request.complemento());
        solicitacao.setStatusAdocao(EnumStatusAdocao.PENDENTE);
        solicitacao.setAssinaturaBase64(request.assinaturaBase64());
        solicitacao.setDataSolicitacao(LocalDateTime.now());

        return solicitacaoAdocaoRepository.save(solicitacao).getId();
    }

    public List<SolicitacaoAdocaoResponse> listarMinhasSolicitacoes() {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return solicitacaoAdocaoRepository.findByAdotanteUsuarioId(usuarioLogado.getId())
                .stream()
                .map(SolicitacaoAdocaoResponse::new)
                .collect(Collectors.toList());
    }

    public Page<SolicitacaoAdocaoResponse> listarSolicitacoesOng(int pagina, int tamanho, Long codigo, String pet,
                                                                 String especie,
                                                                 String adotante, String cidade, String bairro,
                                                                 String status, LocalDate dataInicio, LocalDate dataFim,
                                                                 String ordenarPor, String direcao,
                                                                 boolean paginado) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (usuarioLogado.getEmpresa() == null) {
            throw new RuntimeException("Usuário não está associado a nenhuma ONG.");
        }
        Long empresaId = usuarioLogado.getEmpresa().getId();

        Specification<SolicitacaoAdocao> filtros = (root, query, cb) -> {
            List<Predicate> predicados = new ArrayList<>();
            predicados.add(cb.equal(root.get("animal").get("empresa").get("id"), empresaId));

            if (codigo != null) {
                predicados.add(cb.equal(root.get("id"), codigo));
            }
            if (pet != null && !pet.isBlank()) {
                predicados.add(cb.like(cb.lower(root.get("animal").get("nameAnimal")), "%" + pet.trim().toLowerCase() + "%"));
            }
            if (especie != null && !especie.isBlank()) {
                try {
                    predicados.add(cb.equal(root.get("animal").get("especie"), EnumEspecieAnimal.valueOf(especie.trim().toUpperCase())));
                } catch (IllegalArgumentException e) {
                }
            }
            if (adotante != null && !adotante.isBlank()) {
                predicados.add(cb.like(cb.lower(root.get("adotante").get("usuario").get("name")), "%" + adotante.trim().toLowerCase() + "%"));
            }
            if (cidade != null && !cidade.isBlank()) {
                predicados.add(cb.equal(root.get("endereco").get("cidade"), cidade));
            }
            if (bairro != null && !bairro.isBlank()) {
                predicados.add(cb.equal(root.get("endereco").get("bairro"), bairro));
            }
            if (status != null && !status.isBlank()) {
                try {
                    predicados.add(cb.equal(root.get("statusAdocao"), EnumStatusAdocao.valueOf(status.trim().toUpperCase())));
                } catch (IllegalArgumentException e) {
                }
            }
            if (dataInicio != null) {
                predicados.add(cb.greaterThanOrEqualTo(root.get("dataSolicitacao"), dataInicio.atStartOfDay()));
            }
            if (dataFim != null) {
                predicados.add(cb.lessThan(root.get("dataSolicitacao"), dataFim.plusDays(1).atStartOfDay()));
            }
            return cb.and(predicados.toArray(new Predicate[0]));
        };

        String campoOrdenacao = switch (ordenarPor == null ? "" : ordenarPor.toLowerCase()) {
            case "pet" -> "animal.nameAnimal";
            case "adotante" -> "adotante.usuario.name";
            default -> "id";
        };
        Sort ordenacao = "desc".equalsIgnoreCase(direcao)
                ? Sort.by(campoOrdenacao).descending()
                : Sort.by(campoOrdenacao).ascending();

        Pageable paginacao = paginado ? PageRequest.of(pagina, tamanho, ordenacao) : Pageable.unpaged(ordenacao);

        return solicitacaoAdocaoRepository.findAll(filtros, paginacao)
                .map(solicitacao -> {
                    var response = new SolicitacaoAdocaoResponse(solicitacao);
                    // sem paginação a lista serve de apoio (ex.: filtros), então não leva a assinatura
                    return paginado ? response : response.semAssinatura();
                });
    }

    @Transactional
    public boolean responderSolicitacao(Long id, EnumStatusAdocao novoStatus) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (usuarioLogado.getEmpresa() == null) {
            throw new RuntimeException("Usuário não autorizado.");
        }

        SolicitacaoAdocao solicitacao = solicitacaoAdocaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação de adoção não encontrada."));

        if (!solicitacao.getAnimal().getEmpresa().getId().equals(usuarioLogado.getEmpresa().getId())) {
            throw new RuntimeException("Acesso negado: esta solicitação pertence a outra ONG.");
        }

        solicitacao.setStatusAdocao(novoStatus);
        solicitacaoAdocaoRepository.save(solicitacao);

        if (novoStatus == EnumStatusAdocao.APROVADO) {
            Animal animal = solicitacao.getAnimal();
            animal.setStatusAnimal(EnumStatusAnimal.INATIVO);
            animalRepository.save(animal);
        }

        return true;
    }
}
