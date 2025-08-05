package com.Swasthya.Swasthya.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


import com.Swasthya.Swasthya.Filter.JwtFilter;
import com.Swasthya.Swasthya.Services.Appauth;

@Configuration
@EnableWebSecurity
public class SpringSecurityconfig {

    @Autowired
    private Appauth appauth;

    @Autowired
    private JwtFilter jwtFilter;


    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)  // Disable CSRF for JWT APIs

            // Authorize requests
            .authorizeHttpRequests(auth -> auth
                // Allow unauthenticated access to public REST endpoints
                .requestMatchers("/public/**").permitAll()
                // Allow websocket handshake and SockJS endpoints without authentication
                .requestMatchers("/signal/**").permitAll()
                // TODO: You might want to secure /signal/** later depending on your websocket auth requirements

                // All other endpoints require authentication
                .anyRequest().authenticated()
            )

            // Add your JWT filter before UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

            // Register authentication provider
            .authenticationProvider(vendorAuthProvider())
            .build();
    }

    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    
    @Bean
    public DaoAuthenticationProvider vendorAuthProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(appauth);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }
    
  
}
