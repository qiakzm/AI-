package com.example.demo.Security.auth;

import com.example.demo.Repository.MemberRepository;
import com.example.demo.entity.Member;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    public CustomUserDetailsService(MemberRepository memberRepository){

        this.memberRepository = memberRepository;

    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member memberData = memberRepository.findByUsername(username);
        System.out.println("going");

        if(memberData != null){
            System.out.println("memberdata");
            return new CustomUserDetails(memberData);

        }


        return null;
    }
}
