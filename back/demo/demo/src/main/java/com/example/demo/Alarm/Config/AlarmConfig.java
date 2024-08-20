//package com.example.demo.Alarm.Config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.messaging.simp.config.MessageBrokerRegistry;
//import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
//import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
//import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
//
//@Configuration
//@EnableWebSocketMessageBroker
//public class AlarmConfig implements WebSocketMessageBrokerConfigurer {
//
//    @Override
//    public void registerStompEndpoints(StompEndpointRegistry registry){
//
//        // stomp 접속 주소 url = ws://localhost:8080/ws
//        registry.addEndpoint("/ws").setAllowedOrigins("*");
//
//    }
//
//    @Override
//    public void configureMessageBroker(MessageBrokerRegistry registry){
//        //메시지를 수신하는 엔드포인트
//        registry.enableSimpleBroker("/sub");
//
//        //메시지를 송신하는 엔드포인트
//        registry.setApplicationDestinationPrefixes("/pub");
//    }
//}
