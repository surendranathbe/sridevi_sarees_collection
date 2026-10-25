package com.sridevisarees.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsFilter corsFilter;

    public SecurityConfig(JwtAuthenticationEntryPoint unauthorizedHandler,
                          JwtAuthenticationFilter jwtAuthenticationFilter,
                          CorsFilter corsFilter) {
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.corsFilter = corsFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Stateless REST APIs do not require CSRF
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Public authentication & basic health check endpoints
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/health").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        // Protected API endpoints
                        .requestMatchers("/api/auth/me", "/api/auth/verify").authenticated()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // Default rule: all other requests require authentication
                        .anyRequest().authenticated()
                );

        // Add CORS filter before Spring Security filters
        http.addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class);
        // Add JWT authentication filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
