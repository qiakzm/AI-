package com.example.demo.Security.OAuth;

import com.example.demo.DTO.MemberDTO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {


    private final MemberDTO userDTO;

    public CustomOAuth2User(MemberDTO userDTO) {

        this.userDTO = userDTO;
    }

    @Override
    public Map<String, Object> getAttributes() {

        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {

            @Override
            public String getAuthority() {

                return userDTO.getRoles();
            }
        });

        return collection;
    }

    @Override
    public String getName() {

        return userDTO.getMemberName();
    }

    public String getUsername() {

        return userDTO.getMemberUsername();
    }

    public String getEmail(){
        return userDTO.getMemberEmail();
    }
}