package com.example.demo.Security.jwt;

public interface JwtProperties {
    String SECRET = "4e92c60f877cf071ac3a93c049b67c42b9c3b481c77d8490ef7534142af9cb90";
    long EXPIRATION_TIME = 60000*60L;
    String TOKEN_PREFIX = "Bearer ";
    String HEADER_STRING = "Authorization";

}
