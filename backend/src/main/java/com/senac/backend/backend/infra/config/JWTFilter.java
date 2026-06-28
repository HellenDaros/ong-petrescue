package com.senac.backend.backend.infra.config;

import com.senac.backend.backend.application.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {


        String path = request.getRequestURI();
        String method = request.getMethod();

        //liberação de metodos para não travar o token jwt
        if (path.equals("/auth/login") || path.startsWith("/swagger-ui")
                || path.startsWith("/animais/publicos")
                || (path.equals("/adotantes") && method.equalsIgnoreCase("POST"))
                || path.startsWith("/webjars")
                || path.startsWith("/api/enderecos")
                || path.startsWith("/usuarios/adm")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/v3/api-docs")
                || request.getMethod().startsWith("OPTIONS"))
        {
            filterChain.doFilter(request,response);
            return;
        }
        //fazendo testes

        String header = request.getHeader("Authorization");

        if(header != null && header.startsWith("Bearer ")){
            String token = header.replace("Bearer ", "");

            try {

                var usuarioLogado = tokenService.validarToken(token);

                UsernamePasswordAuthenticationToken usuario =
                        new UsernamePasswordAuthenticationToken(
                                usuarioLogado,
                                null,
                                usuarioLogado.getAuthorities()
                        );

                SecurityContextHolder.getContext().setAuthentication(usuario);

            } catch (Exception ex) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token expirado ou inválido");
                return;
            }

        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token não informado ou inválido");
            return;
        }

        filterChain.doFilter(request, response);
    }
}

