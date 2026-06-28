package com.senac.backend.backend.infra.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private JWTFilter jwtFilter;

    @Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        return http.cors(Customizer.withDefaults())
                        .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(
                                        "/auth/login",
                                        "/usuarios/adm",
                                        "/animais/publicos",
                                        "/api/enderecos/**",
                                        "/swagger-ui/**",
                                "/webjars/**",
                                "/swagger-resources/**",
                                "/v3/api-docs/**",
                                        "/v3/api-docs"
                                ).permitAll()
                                .requestMatchers(HttpMethod.POST, "/adotantes").permitAll()
                                .requestMatchers("/adotantes/**").hasAnyRole("ADOTANTE")
                                .requestMatchers("/empresa**").hasAnyRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/usuarios").hasAnyRole("ADMIN_ONG", "FUNCIONARIO_ONG")
                                .requestMatchers(HttpMethod.POST, "/adocoes").hasAnyRole("ADOTANTE")
                                .requestMatchers("/adocoes/minhas").hasAnyRole("ADOTANTE")
                                .requestMatchers("/adocoes/ong", "/adocoes/*/status").hasAnyRole("ADMIN_ONG", "FUNCIONARIO_ONG")
                                .requestMatchers(HttpMethod.GET, "/animais/*").hasAnyRole("ADMIN_ONG", "FUNCIONARIO_ONG", "ADOTANTE")
                                .requestMatchers("/pets/**", "/animais/**").hasAnyRole("ADMIN_ONG", "FUNCIONARIO_ONG")
                                .anyRequest().authenticated()
                        )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
