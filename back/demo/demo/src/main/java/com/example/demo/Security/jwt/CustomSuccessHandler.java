package com.example.demo.Security.jwt;

import com.example.demo.Repository.MemberRepository;
import com.example.demo.Security.OAuth.CustomOAuth2User;
import com.example.demo.entity.Member;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Collection;
import java.util.Iterator;

@Component
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JWTUtil jwtUtil;
    private final MemberRepository memberRepository;
//    public CustomSuccessHandler(JWTUtil jwtUtil) {
//
//        this.jwtUtil = jwtUtil;
//    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        //OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String username = customUserDetails.getUsername();
        String email = customUserDetails.getEmail();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

//        Member existMember = memberRepository.findByUsername(username);
//
//        System.out.println(username);
//        System.out.println(email);

//        if(existMember!=null) {

            String token = jwtUtil.createJwt(username, role, JwtProperties.EXPIRATION_TIME);

            response.addCookie(createCookie("Authorization", token));
            response.sendRedirect("http://localhost:3000/");
//        }else {
//            // 리다이렉트 URL 생성
//            String redirectUrl = String.format("http://localhost:3000/register/?username=%s&email=%s", URLEncoder.encode(username, "UTF-8"), URLEncoder.encode(email, "UTF-8"));
//
//            // 리다이렉트
//            response.sendRedirect(redirectUrl);
//        }
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge((int)JwtProperties.EXPIRATION_TIME);
        cookie.setSecure(true);
        cookie.setPath("/");
//        cookie.setHttpOnly(true);

        return cookie;
    }
}
