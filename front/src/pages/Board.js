import { useState, useEffect } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import '../css/Board.css';
import Button from 'react-bootstrap/Button';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function Board() {
  //게시물 데이터
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const page = query.get('page');
  const [currentPage, setCurrentPage] = useState(page); // 현재 페이지
  const [postsPerPage] = useState(5); // 1페이지당 보여줄 게시물 수

  //시간
  const [time, settime] = useState('');
  // const slicdTime = time.substr(0, 10);

  //쿠키
  const cookies = new Cookies();
  const jwtToken = cookies.get('jwtToken');

  //페이지 이동(새로고침x)
  const movePage = useNavigate();

  useEffect(() => {
    // 게시판 목록 조회 API 호출
    axios
      .get('http://localhost:8080/api/board')
      .then((response) => {
        setPosts(response.data);

        console.log(posts);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  posts.sort((a, b) => b.id - a.id);

  //페이징 관련 변수
  const totalPages = Math.ceil(posts.length / postsPerPage); // 총 페이지 수 계산
  const indexOfLastPost = currentPage * postsPerPage; // 마지막 게시물 인덱스
  const indexOfFirstPost = indexOfLastPost - postsPerPage; // 첫번째 게시물 인덱스
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지에 보여줄 게시물
  const pageNumbers = []; // 페이지 번호 목록
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // 페이지 이동 함수
  const navigateToPage = (pageNumber) => {
    window.location.replace(`/Board?page=${pageNumber}`);
  };
  const onClickDetail = (id) => {
    movePage(`/Board/${id}`);
  };

  const onWritepage = () => {
    if (jwtToken) {
      movePage('/Board/Write');
    } else {
      movePage('/Login');
    }
  };

  return (
    <div className="freeboard">
      <h3>자유게시판</h3>
      <table className="common-table">
        <thead>
          <tr className="common-table-header-column">
            <th>글번호</th>
            <th>제목</th>
            <th>등록일</th>
            <th>작성자</th>
          </tr>
        </thead>
        {currentPosts.map((post) => (
          <tbody key={post.id} onClick={() => onClickDetail(post.id)}>
            <tr className="board-table">
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.createdDate.substring(0, 10)}</td>
              <td>{post.writer}</td>
            </tr>
          </tbody>
        ))}
        <Button variant="primary" className="writebutton" onClick={onWritepage}>
          글쓰기
        </Button>{' '}
      </table>
      {/* <div className="paging">
        {pageNumbers.map((pageNumber) => (
          <button
            className="pageButton"
            key={pageNumber}
            onClick={() => navigateToPage(pageNumber)}
            disabled={pageNumber == currentPage}
          >
            {pageNumber}
          </button>
        ))}
      </div> */}
      <div className="paging">
        {currentPage > 1 && (
          <button
            className="pageButton"
            onClick={() => navigateToPage(parseInt(currentPage) - 1)}
          >
            이전
          </button>
        )}

        {currentPage > 3 && (
          <div>
            <button className="pageButton" onClick={() => navigateToPage(1)}>
              1
            </button>
            <span className="pageDots">...</span>
          </div>
        )}

        {pageNumbers
          .filter((pageNumber) => {
            if (currentPage == 1 || currentPage == 2 || currentPage == 3) {
              return pageNumber >= 1 && pageNumber <= 5;
            } else if (currentPage >= totalPages - 2) {
              return pageNumber >= totalPages - 4 && pageNumber <= totalPages;
            } else {
              return (
                pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2
              );
            }
          })
          .map((pageNumber) => (
            <button
              className="pageButton"
              key={pageNumber}
              onClick={() => navigateToPage(pageNumber)}
              disabled={pageNumber == currentPage}
            >
              {pageNumber}
            </button>
          ))}

        {currentPage < totalPages - 2 && (
          <div>
            <span className="pageDots">... </span>
            <button
              className="pageButton"
              onClick={() => navigateToPage(totalPages)}
            >
              {totalPages}
            </button>
          </div>
        )}

        {currentPage < totalPages && (
          <button
            className="pageButton"
            onClick={() => navigateToPage(parseInt(currentPage) + 1)}
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}

export default Board;
