package com.example.demo.Repository;

import com.example.demo.entity.Board1;
import com.example.demo.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Board1Repository extends JpaRepository<Board1,Long> {

    Page<Board1> findByCategory(String category, Pageable pageable);

    List<Board1> findByCategory(String category);

    List<Board1> findByMember(Member member);

    @Query("SELECT b FROM Board1 b LEFT JOIN b.boardlike bl WHERE FUNCTION('DATE', b.createdDate) = CURRENT_DATE GROUP BY b ORDER BY COUNT(bl) DESC LIMIT 3")
    List<Board1> findTop3ByOrderByBoardlikeCountDesc(@Param("limit") int limit);

    Page<Board1> findByIsPopular(boolean isPopular, Pageable pageable);

    // 카테고리와 관련된 게시판 리스트를 boardlike 크기에 따라 내림차순으로 정렬하여 페이징 처리
    @Query("SELECT b FROM Board1 b LEFT JOIN b.boardlike bl WHERE b.category = :category GROUP BY b ORDER BY COUNT(bl) DESC, b.createdDate DESC")
    Page<Board1> findByCategoryOrderByBoardlikeCountDesc(String category, Pageable pageable);

    @Query("SELECT b FROM Board1 b LEFT JOIN FETCH b.boardlike bl WHERE b.category = :category AND (b.title LIKE CONCAT('%', :keyword, '%') OR b.content LIKE CONCAT('%', :keyword, '%')) GROUP BY b.id ORDER BY COUNT(bl) DESC, b.createdDate DESC")
    Page<Board1> findByCategoryAndKeyword(String category, String keyword, Pageable pageable);

    // 좋아요 개수가 3개 이상인 게시물들을 날짜 순으로 정렬하여 페이징 처리
    @Query("SELECT b FROM Board1 b LEFT JOIN b.boardlike bl GROUP BY b HAVING COUNT(bl) >= 3 ORDER BY b.createdDate DESC")
    Page<Board1> findByBoardlikeCountGreaterThanEqualThreeOrderByCreatedDateDesc(Pageable pageable);

    @Query("SELECT b FROM Board1 b LEFT JOIN b.boardlike bl GROUP BY b HAVING COUNT(bl) >= 3")
    List<Board1> findPopularBoards();

//    @Query("SELECT b FROM Board1 b LEFT JOIN b.boardlike bl WHERE b.created_date = CURRENT_DATE GROUP BY b ORDER BY COUNT(bl) DESC")
//    List<Board1> findTop3ByCreatedDateTodayOrderByLikesDesc(Pageable pageable);
}
