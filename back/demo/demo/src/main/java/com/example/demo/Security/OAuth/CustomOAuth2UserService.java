package com.example.demo.Security.OAuth;

import com.example.demo.DTO.*;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.entity.Member;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {



    private final MemberRepository memberRepository;

    public CustomOAuth2UserService(MemberRepository memberRepository) {

        this.memberRepository = memberRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println(oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        System.out.println(registrationId);
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("google")) {

            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        }
        else if (registrationId.equals("naver")){

            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        }else if(registrationId.equals("kakao")){
            oAuth2Response = new KaKaoResponse(oAuth2User.getAttributes());
        }else{
            return null;
        }
        String username = oAuth2Response.getProvider()+" "+oAuth2Response.getProviderId();
        Member existData = memberRepository.findByUsername(username);

        System.out.println("username:"+username);

//        MemberDTO memberDTO = new MemberDTO();
//        memberDTO.setMemberUsername(username);
//        memberDTO.setMemberEmail(oAuth2Response.getEmail());
//        memberDTO.setMemberName(oAuth2Response.getName());
//        memberDTO.setRoles("ROLE_USER");
//
//        return new CustomOAuth2User(memberDTO);


        if (existData == null) {

            Member memberEntity = new Member();
            memberEntity.setUsername(username);
            memberEntity.setEmail("OAuth "+registrationId+" "+oAuth2Response.getEmail());
            memberEntity.setName(oAuth2Response.getName());
            memberEntity.setGrade("미정");
            memberEntity.setPassword("temppass");
            memberEntity.setRole("ROLE_USER");

            memberRepository.save(memberEntity);

            MemberDTO memberDTO = new MemberDTO();
            memberDTO.setMemberUsername(username);
            memberDTO.setMemberName(oAuth2Response.getName());
            memberDTO.setRoles("ROLE_USER");

            return new CustomOAuth2User(memberDTO);
        }
        else {

//            existData.setEmail(oAuth2Response.getEmail());
//            existData.setName(oAuth2Response.getName());
//
//            memberRepository.save(existData);

            MemberDTO memberDTO = new MemberDTO();
            memberDTO.setMemberUsername(username);
            memberDTO.setMemberName(oAuth2Response.getName());
            memberDTO.setRoles("ROLE_USER");

            return new CustomOAuth2User(memberDTO);
        }
    }
}
