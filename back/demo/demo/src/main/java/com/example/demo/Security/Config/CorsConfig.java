package com.example.demo.Security.Config;

import com.example.demo.Security.jwt.JwtProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Collections;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("http://localhost:3000"); // http://localhost:3000 도메인만 요청을 허용
        config.addAllowedOriginPattern("*"); //모든 ip 에 응답을 허용
        config.addAllowedHeader("*"); // 모든 header 에 응답을 허용
        config.addAllowedMethod("*"); // 모든 post,get,put,delete,patch 요청을 허용하겠다
        config.addExposedHeader(JwtProperties.HEADER_STRING);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

}