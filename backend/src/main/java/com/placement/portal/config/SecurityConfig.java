package com.placement.portal.config;

import com.placement.portal.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public Endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/files/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Officer Admin Endpoints
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_OFFICER")
                        .requestMatchers(HttpMethod.POST, "/api/companies/**").hasAuthority("ROLE_OFFICER")
                        .requestMatchers(HttpMethod.PUT, "/api/companies/**").hasAuthority("ROLE_OFFICER")
                        .requestMatchers(HttpMethod.DELETE, "/api/companies/**").hasAuthority("ROLE_OFFICER")
                        .requestMatchers(HttpMethod.POST, "/api/drives").hasAuthority("ROLE_OFFICER")
                        .requestMatchers(HttpMethod.PUT, "/api/drives/*").hasAuthority("ROLE_OFFICER")
                        .requestMatchers(HttpMethod.DELETE, "/api/drives/*").hasAuthority("ROLE_OFFICER")
                        .requestMatchers(HttpMethod.PUT, "/api/applications/*/status").hasAuthority("ROLE_OFFICER")
                        .requestMatchers("/api/drives/*/applications").hasAuthority("ROLE_OFFICER")

                        // Student Endpoints
                        .requestMatchers("/api/students/resume").hasAuthority("ROLE_STUDENT")
                        .requestMatchers(HttpMethod.POST, "/api/drives/*/apply").hasAuthority("ROLE_STUDENT")
                        .requestMatchers("/api/students/applications").hasAuthority("ROLE_STUDENT")

                        // Shared / Authenticated Endpoints
                        .requestMatchers("/api/students/profile").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/companies/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/drives/**").authenticated()

                        // Any other
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*")); // Allow frontend dev servers
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
