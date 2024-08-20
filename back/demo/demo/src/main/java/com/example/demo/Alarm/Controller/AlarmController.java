//package com.example.demo.Alarm.Controller;
//
//import com.example.demo.Alarm.DTO.AlarmDTO;
//import com.example.demo.Alarm.Entity.Alarm;
//import com.example.demo.Alarm.Service.AlarmService;
//import com.example.demo.Security.auth.CustomUserDetails;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessageSendingOperations;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping(value = "/alarm", produces = MediaType.APPLICATION_JSON_VALUE)
//public class AlarmController {
//
//    private final SimpMessageSendingOperations messagingTemplate;
//    private final AlarmService alarmService;
//
//
//    @GetMapping("/MyAlarm")
//    public ResponseEntity<List<AlarmDTO>> getChatMessage(@AuthenticationPrincipal CustomUserDetails customUserDetails){
//
//        List<AlarmDTO> alarmlist = alarmService.myAlarmList(customUserDetails);
//
//        return ResponseEntity.ok().body(alarmlist);
//    }
//
//    @MessageMapping("/message")
//    public ResponseEntity<Void> receiveMessage(@RequestBody AlarmDTO alarmDTO,@AuthenticationPrincipal CustomUserDetails customUserDetails){
//        messagingTemplate.convertAndSendToUser(customUserDetails.getUsername(), "/sub/MyAlarm",alarmDTO);
//
//        return ResponseEntity.ok().build();
//    }
//}
