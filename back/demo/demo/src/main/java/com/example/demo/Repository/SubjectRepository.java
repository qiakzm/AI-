package com.example.demo.Repository;

import com.example.demo.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, String> {

    @Query(value = "SELECT * FROM subject ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Subject findRandomSubject();

    // JPQL query to find Subject by q_sub
    @Query("SELECT s FROM Subject s WHERE s.q_sub = ?1")
    Subject findByQSub(String q_sub);

    @Query(value = "SELECT * FROM subject WHERE subject_name = ?1 ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Subject findRandomSubjectBySubjectName(String subjectName);
}
