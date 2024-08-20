import '../css/MyPageBoard.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function MyPageBoard() {
  const [posts, setPosts] = useState([]);
  const cookies = new Cookies();
  const jwtToken = cookies.get('jwtToken');

  useEffect(() => {
    if (jwtToken) {
      axios
        .get(`http://localhost:8080/api/board/Get/MyPage/Board`, {
          headers: {
            Authorization: jwtToken,
          },
        })
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => {
          console.error(error);
          setPosts([]);
        });
    } else {
      setPosts([]);
    }
  }, []); //내 게시글 가져오기

  //날짜별로 데이터 분리하기
  const postsByDate = {};
  posts.forEach((post) => {
    const date = post.createdDate.substring(0, 10); // 날짜 문자열에서 연월일 부분만 추출
    if (!postsByDate[date]) {
      postsByDate[date] = []; // 해당 날짜에 배열이 없으면 새로 생성
    }
    postsByDate[date].push(post); // 해당 날짜의 배열에 게시글 추가
  });

  return (
    <div className="MyPageBoard">
      <div className="MyPageBoardDetail">
        <div>내 DiscoLP 게시글</div>
      </div>
      {Object.entries(postsByDate)
        .sort(([date1], [date2]) => new Date(date2) - new Date(date1)) // 최신 날짜순으로 정렬
        .map(([date, posts]) => (
          <div key={date}>
            <div className="MyPageBoardDate">
              <h2>{date}</h2>
            </div>
            {posts.map((post) => (
              <MypageboardDetails id={post.id} title={post.title} />
            ))}
          </div>
        ))}
    </div>
  );
}

function MypageboardDetails({ id, title }) {
  const [likecount, setlikecount] = useState(0);
  const [commentcount, setcommentcount] = useState(0);

  //페이지 이동(새로고침x)
  const movePage = useNavigate();

  const onClickDetail = (id) => {
    movePage(`/Board/${id}`);
  };

  useEffect(() => {
    // 게시판 목록 조회 API 호출
    axios
      .get(`http://localhost:8080/like/Get/Count/${id}`)
      .then((response) => {
        setlikecount(response.data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setlikecount(0);
      });
  }, []);

  useEffect(() => {
    // 게시판 목록 조회 API 호출
    axios
      .get(`http://localhost:8080/api/comments/Get/Count/${id}`)
      .then((response) => {
        setcommentcount(response.data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setcommentcount(0);
      });
  }, []);

  return (
    <div
      className="MyPageBoardinform"
      key={id}
      onClick={() => onClickDetail(id)}
    >
      <h4>{title}</h4>
      <span>추천수: {likecount}</span>
      <span>댓글수: {commentcount} </span>
    </div>
  );
}

export default MyPageBoard;
