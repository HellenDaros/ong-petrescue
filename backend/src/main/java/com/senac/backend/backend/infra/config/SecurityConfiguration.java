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

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        return http.cors(Customizer.withDefaults())
                        .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(
                                        "/auth/login",
                                        "/usuarios/adm",
                                        "/animais/publicos",
                                        "/swagger-ui/**",
                                "/webjars/**",
                                "/swagger-resources/**",
                                "/v3/api-docs/**"
                                ).permitAll()
                                .requestMatchers(HttpMethod.POST, "/adotantes").permitAll()
                                .requestMatchers(  "/adotantes**").hasAnyRole("ADMIN_ADOTANTE")
                                .requestMatchers(  "/empresa**").hasAnyRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/usuarios").hasAnyRole( "ADMIN_ONG")
                                .requestMatchers("/pets/**", "/animais/**").hasAnyRole("ADMIN_ONG", "FUNCIONARIO_ONG")
                                .anyRequest().authenticated()
                        )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
