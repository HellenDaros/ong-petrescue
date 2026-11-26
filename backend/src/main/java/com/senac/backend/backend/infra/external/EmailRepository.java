package com.senac.backend.backend.infra.external;

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

import java.nio.charset.StandardCharsets;

@Component
public class EmailRepository {

    private static final Logger log = LoggerFactory.getLogger(EmailRepository.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remetente;

    @Async
    public void enviarRecuperacaoSenha(String destinatario, String nome, String link, long minutosValidade) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, StandardCharsets.UTF_8.name());

            helper.setFrom(remetente, "I🧡PET");
            helper.setTo(destinatario);
            helper.setSubject("Recuperação de senha - I🧡PET");
            helper.setText(textoSimples(nome, link, minutosValidade), html(nome, link, minutosValidade));

            mailSender.send(mensagem);
        } catch (Exception e) {
            log.error("Falha ao enviar e-mail de recuperação de senha para {}", destinatario, e);
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
