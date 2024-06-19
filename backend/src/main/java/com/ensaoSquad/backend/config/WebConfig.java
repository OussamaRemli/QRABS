package com.ensaoSquad.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Autoriser tous les chemins
                .allowedOrigins("http://192.168.0.120:3000")  // Autoriser l'origine de votre front-end React
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Autoriser les méthodes HTTP nécessaires
                .allowedHeaders("*");  // Autoriser tous les en-têtes dans la requête
    }
}
