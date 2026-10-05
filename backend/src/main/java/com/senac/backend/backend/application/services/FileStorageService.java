package com.senac.backend.backend.application.services;

import com.senac.backend.backend.domain.exceptions.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> EXTENSOES_PERMITIDAS = Set.of("jpg", "jpeg", "png", "webp");

    @Value("${app.upload.dir}")
    private String uploadDir;

    public String salvar(MultipartFile file, String subpasta) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Nenhum arquivo enviado.");
        }

        String extensao = StringUtils.getFilenameExtension(file.getOriginalFilename());
        if (extensao == null || !EXTENSOES_PERMITIDAS.contains(extensao.toLowerCase())) {
            throw new BusinessException("Formato de imagem inválido. Use JPG, PNG ou WEBP.");
        }

        try {
            Path diretorio = Paths.get(uploadDir, subpasta);
            Files.createDirectories(diretorio);

            String nomeArquivo = UUID.randomUUID() + "." + extensao.toLowerCase();
            file.transferTo(diretorio.resolve(nomeArquivo));

            return "/uploads/" + subpasta + "/" + nomeArquivo;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar a imagem.", e);
        }
    }
}
