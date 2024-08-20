package com.example.demo.Repository;

import com.example.demo.entity.Board1;
import com.example.demo.entity.Member;
import com.example.demo.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByMember(Member member);
}
