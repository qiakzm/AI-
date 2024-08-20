package com.example.demo.Controller;

import com.example.demo.DTO.NotificationDTO.MyNotificationDTO;
import com.example.demo.Security.auth.CustomUserDetails;
import com.example.demo.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(path = "/api/v1/notifications/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamNotifications(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        System.out.println(customUserDetails.getUsername());
        return notificationService.createEmitter(customUserDetails);
    }

    @PostMapping("/api/v1/notifications/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/mynotification")
    public ResponseEntity<List<MyNotificationDTO>> getMyNotification(@AuthenticationPrincipal CustomUserDetails customUserDetails){

        List<MyNotificationDTO> notification = notificationService.getMyNotification(customUserDetails);

        return ResponseEntity.ok(notification);
    }

    @PutMapping("api/{notificationId}/read")
    public ResponseEntity<String> readMyNotification(@PathVariable Long notificationId,@AuthenticationPrincipal CustomUserDetails customUserDetails){

        return notificationService.readMyNotification(notificationId,customUserDetails);


    }
}
