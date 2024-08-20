import { useState, useEffect } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function MyPageLike() {
  const [boardIds, setboardIds] = useState([]);
  const cookies = new Cookies();
  const jwtToken = cookies.get('jwtToken');

  useEffect(() => {
    if (jwtToken) {
      axios
        .get(`http://localhost:8080/like/Get/MyPage/like`, {
          headers: {
            Authorization: jwtToken,
          },
        })
        .then((response) => {
          setboardIds(response.data);
        })
        .catch((error) => {
          console.error(error);
          setboardIds('');
        });
    } else {
      setboardIds('');
    }
  }, []);

  return (
    <div className="MyPageBoard">
      <div className="MyPageBoardDetail">
        <div>좋아요 한 게시글</div>
      </div>
      <div className="MyPageBoardDate">
        <h2>게시글 목록</h2>
      </div>
      {boardIds.map((boardId) => (
        <MypageLikeDetails id={boardId} />
      ))}
    </div>
  );
}

function MypageLikeDetails({ id }) {
  const [boardTitle, setboardTitle] = useState('');
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
      .get(`http://localhost:8080/api/board/Get/BoardTitle/${id}`)
      .then((response) => {
        setboardTitle(response.data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setboardTitle('');
      });
  }, []);

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
    <div className="MyPageBoardinform" onClick={() => onClickDetail(id)}>
      <h4>{boardTitle}</h4>
      <span>추천수: {likecount}</span>
      <span>댓글수: {commentcount} </span>
    </div>
  );
}

export default MyPageLike;
