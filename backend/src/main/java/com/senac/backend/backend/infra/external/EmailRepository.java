package com.senac.backend.backend.infra.external;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
public class EmailRepository {

    private static final Logger log = LoggerFactory.getLogger(EmailRepository.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remetente;

    @Value("${app.email.brevo-api-key}")
    private String brevoApiKey;

    private static final String NOME_REMETENTE = "I🧡PET";
    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Async
    public void enviarRecuperacaoSenha(String destinatario, String nome, String link, long minutosValidade) {
        String assunto = "Recuperação de senha - I🧡PET";
        String texto = textoSimples(nome, link, minutosValidade);
        String html = html(nome, link, minutosValidade);

        try {
            // Com a chave do Brevo (produção), envia pela API HTTPS; sem ela (local), usa o SMTP do Gmail.
            if (brevoApiKey != null && !brevoApiKey.isBlank()) {
                enviarPeloBrevo(destinatario, nome, assunto, texto, html);
            } else {
                enviarPorSmtp(destinatario, assunto, texto, html);
            }
        } catch (Exception e) {
            log.error("Falha ao enviar e-mail de recuperação de senha para {}", destinatario, e);
        }
    }

    private void enviarPorSmtp(String destinatario, String assunto, String texto, String html) throws Exception {
        MimeMessage mensagem = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, StandardCharsets.UTF_8.name());

        helper.setFrom(remetente, NOME_REMETENTE);
        helper.setTo(destinatario);
        helper.setSubject(assunto);
        helper.setText(texto, html);

        mailSender.send(mensagem);
    }

    private void enviarPeloBrevo(String destinatario, String nome, String assunto, String texto, String html) throws Exception {
        Map<String, Object> corpo = Map.of(
                "sender", Map.of("name", NOME_REMETENTE, "email", remetente),
                "to", List.of(Map.of("email", destinatario, "name", nome == null ? destinatario : nome)),
                "subject", assunto,
                "textContent", texto,
                "htmlContent", html
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BREVO_URL))
                .timeout(Duration.ofSeconds(15))
                .header("api-key", brevoApiKey)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(corpo), StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 300) {
            throw new IllegalStateException("Brevo respondeu " + response.statusCode() + ": " + response.body());
        }
    }

    private String textoSimples(String nome, String link, long minutos) {
        return "Olá, " + nome + "!\n\n"
                + "Recebemos um pedido para redefinir a sua senha no I🧡PET.\n"
                + "Acesse o link abaixo para criar uma nova senha (válido por " + minutos + " minutos):\n\n"
                + link + "\n\n"
                + "Se você não pediu a troca de senha, ignore este e-mail. Sua senha continua a mesma.";
    }

    private String html(String nome, String link, long minutos) {
        String nomeSeguro = HtmlUtils.htmlEscape(nome == null ? "" : nome);
        String linkSeguro = HtmlUtils.htmlEscape(link);

        return """
                <div style="font-family: Arial, sans-serif; background:#fafaf9; padding:32px;">
                  <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:16px; padding:32px; border:1px solid #e7e5e4;">
                    <p style="text-align:center; font-weight:900; color:#0d9488; font-size:20px; margin:0 0 24px;">I&#129505;PET</p>
                    <h1 style="font-size:20px; color:#1e293b; margin:0 0 16px;">Olá, %s!</h1>
                    <p style="color:#475569; font-size:14px; line-height:1.6;">
                      Recebemos um pedido para redefinir a sua senha. Clique no botão abaixo para criar uma nova senha.
                    </p>
                    <p style="text-align:center; margin:28px 0;">
                      <a href="%s" style="background:#0f172a; color:#ffffff; text-decoration:none; padding:12px 28px; border-radius:12px; font-weight:bold; font-size:14px; display:inline-block;">
                        Redefinir minha senha
                      </a>
                    </p>
                    <p style="color:#64748b; font-size:12px; line-height:1.6;">
                      O link vale por %d minutos e só pode ser usado uma vez.<br>
                      Se você não pediu a troca de senha, ignore este e-mail. Sua senha continua a mesma.
                    </p>
                    <p style="color:#94a3b8; font-size:11px; word-break:break-all; margin-top:24px;">
                      Se o botão não funcionar, copie e cole este endereço no navegador:<br>%s
                    </p>
                  </div>
                </div>
                """.formatted(nomeSeguro, linkSeguro, minutos, linkSeguro);
    }
}
