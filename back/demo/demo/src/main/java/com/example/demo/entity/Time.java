package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass //다른 DB에 해당 Entity를 연결 시켜준다
@EntityListeners(AuditingEntityListener.class) //JPA에서 엔티티의 변경을 감지하고 이에 대한 자동 감사(Auditing) 기능을 제공하기 위해 사용됩니다.
public class Time {
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime modifiedDate;
}