import { useState, useEffect } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function MyPageComment() {
  const [comments, setComments] = useState([]);
  const cookies = new Cookies();
  const jwtToken = cookies.get('jwtToken');

  //페이지 이동(새로고침x)
  const movePage = useNavigate();

  useEffect(() => {
    if (jwtToken) {
      axios
        .get(`http://localhost:8080/api/comments/Get/MyPage/Comment`, {
          headers: {
            Authorization: jwtToken,
          },
        })
        .then((response) => {
          setComments(response.data);
        })
        .catch((error) => {
          console.error(error);
          setComments([]);
        });
    } else {
      setComments([]);
    }
  }, []);

  //날짜별로 데이터 분리하기
  const commentsByDate = {};
  comments.forEach((comment) => {
    const date = comment.createdTime.substring(0, 10); // 날짜 문자열에서 연월일 부분만 추출
    if (!commentsByDate[date]) {
      commentsByDate[date] = []; // 해당 날짜에 배열이 없으면 새로 생성
    }
    commentsByDate[date].push(comment); // 해당 날짜의 배열에 게시글 추가
  });
  return (
    <div className="MyPageBoard">
      <div className="MyPageBoardDetail">
        <div>내 DiscoLP 댓글</div>
      </div>

      {Object.entries(commentsByDate)
        .sort(([date1], [date2]) => new Date(date2) - new Date(date1)) // 최신 날짜순으로 정렬
        .map(([date, comments]) => (
          <div key={date}>
            <div className="MyPageBoardDate">
              <h2>{date}</h2>
            </div>
            {comments.map((comment) => (
              <MypageCommentDetails
                id={comment.id}
                title={comment.commentContents}
                boardId={comment.boardId}
              />
            ))}
          </div>
        ))}
    </div>
  );
}

function MypageCommentDetails({ id, title }) {
  const [postId, setPostId] = useState(0);
  const [boardTitle, setboardTitle] = useState('');

  //페이지 이동(새로고침x)
  const movePage = useNavigate();
  const onClickDetail = (postId) => {
    movePage(`/Board/${postId}`);
  };
  useEffect(() => {
    // 게시판 목록 조회 API 호출
    axios
      .get(`http://localhost:8080/api/comments/Get/MyPage/Comment/Board/${id}`)
      .then((response) => {
        setPostId(response.data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, [id]);

  useEffect(() => {
    // 게시판 목록 조회 API 호출
    if (postId !== 0) {
      axios
        .get(`http://localhost:8080/api/board/Get/BoardTitle/${postId}`)
        .then((response) => {
          setboardTitle(response.data);
        })
        .catch((error) => {
          console.error('Error fetching posts:', error);
          setboardTitle('');
        });
    }
  }, [postId]);

  return (
    <div
      className="MyPageCommentinform"
      key={id}
      onClick={() => onClickDetail(postId)}
    >
      <h4>제목: {boardTitle}</h4>
      <h6>댓글 :{title}</h6>
    </div>
  );
}

export default MyPageComment;
