package com.example.demo.Service;

import com.example.demo.DTO.NotificationDTO.MyNotificationDTO;
import com.example.demo.Repository.Board1Repository;
import com.example.demo.Repository.MemberRepository;
import com.example.demo.Repository.NotificationRepository;
import com.example.demo.Security.auth.CustomUserDetails;
import com.example.demo.entity.Board1;
import com.example.demo.entity.Member;
import com.example.demo.entity.Notification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final Map<Long, SseEmitter> userEmitters = new ConcurrentHashMap<>();
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;
    private final Board1Repository board1Repository;


    public SseEmitter createEmitter(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        userEmitters.put(member.getId(), emitter);

        emitter.onCompletion(() -> userEmitters.remove(member.getId()));
        emitter.onTimeout(() -> userEmitters.remove(member.getId()));
        emitter.onError(e -> userEmitters.remove(member.getId()));

        sendInitialData(emitter);

        return emitter;
    }

    private void sendInitialData(SseEmitter emitter) {
        try {
            emitter.send(SseEmitter.event().name("init").data("Connected!"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public void sendNotification(Long receiverId,String message,Long board1Id) {
        Member receiver = memberRepository.findById(receiverId).get();
        Board1 board1 = board1Repository.findById(board1Id).get();

        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setMember(receiver);
        notification.setBoard1(board1);
        notification.setRead(false);
        Notification savedNotification = notificationRepository.save(notification);
        sendRealTimeNotification(savedNotification);
    }

    private void sendRealTimeNotification(Notification notification) {
        SseEmitter emitter = userEmitters.get(notification.getMember().getId());
        if (emitter != null) {
            executor.execute(() -> {
                try {
                    emitter.send(SseEmitter.event().name("notification").data(notification.getMessage()));
                } catch (Exception e) {
                    // 예외 처리
                }
            });
        }
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new IllegalArgumentException("Invalid notification Id:" + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public List<MyNotificationDTO> getMyNotification(CustomUserDetails customUserDetails) {
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        List<Notification> notifications = notificationRepository.findByMember(member);

        // notifications 리스트를 createdDate 기준으로 정렬 (최신순)
        Collections.sort(notifications, new Comparator<Notification>() {
            @Override
            public int compare(Notification n1, Notification n2) {
                return n2.getCreatedDate().compareTo(n1.getCreatedDate());
            }
        });

        return notifications.stream()
                .map(notification -> {
                    MyNotificationDTO myNotificationDTO = new MyNotificationDTO();
                    myNotificationDTO.setId(notification.getId());
                    myNotificationDTO.setBoardId(notification.getBoard1().getId());
                    myNotificationDTO.setMessage(notification.getMessage());
                    myNotificationDTO.setRead(notification.isRead());
                    myNotificationDTO.setCreatedDate(notification.getCreatedDate());
                    return myNotificationDTO;
                }).collect(Collectors.toList());

    }

    public ResponseEntity<String> readMyNotification(Long notificationId, CustomUserDetails customUserDetails) {
        Notification notification = notificationRepository.findById(notificationId).get();
        Member member = memberRepository.findByUsername(customUserDetails.getUsername());

        Long notificationmember = notification.getMember().getId();

        if(notificationmember==member.getId()){

            if(!notification.isRead()) {
                notification.setRead(true);
                notificationRepository.save(notification);
                return ResponseEntity.ok("알림을 읽었습니다.");
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 읽은 알림");
            }

        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("해당 알림과 멤버는 일치하지 않습니다.");
        }

    }
}
