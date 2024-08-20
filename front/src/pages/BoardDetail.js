import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/BoardDetail.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import Spinner from 'react-bootstrap/Spinner';
import { Cookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';
import Comment from './Comment';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLike } from 'react-icons/ai';

function BoardDetail() {
  const { id } = useParams();
  const [post, setPost] = useState('');
  const [comments, setComments] = useState([]);
  const [writecomment, setwritecomment] = useState([]);
  const [isExist, setisExist] = useState(null);

  //유저 확인용
  const [checkuser, setcheckuser] = useState(false);
  const [checklike, setchecklike] = useState(false); //좋아요 확인용
  const cookies = new Cookies();
  const jwtToken = cookies.get('jwtToken');

  //모달 보여주기
  const [show, setShow] = useState(false);
  const [Loginshow, setLoginshow] = useState(false);
  const [likeLoginshow, setlikeLoginshow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const LoginhandleClose = () => setLoginshow(false);
  const likehandleClose = () => setlikeLoginshow(false);
  const LoginhandleShow = () => {
    window.location.replace('/Login');
  };

  //제목,시간
  const [title, settitle] = useState('');
  const [time, settime] = useState('');
  const slicdTime = time.substr(0, 10);
  // const str = post.createdTime;
  // const result = str.substr(0, 5); // "Hello"

  //페이지 이동
  const movepage = useNavigate();

  const handleComment = (e) => {
    setwritecomment(e.target.value);
  };

  function onshow(e) {
    // console.log(post.title);
    // console.log(post.writer);
    // console.log(post.boardId);
    // console.log(jwtToken);
    console.log(checkuser);
    console.log(time);
    console.log(typeof time);
  }

  useEffect(() => {
    // 게시글 상세 정보 조회 API 호출
    axios
      .get(`http://localhost:8080/api/board/${id}`)
      .then((response) => {
        setPost(response.data);
        setisExist(true);
        settitle(response.data.title);
        settime(response.data.createdDate);
        console.log(post);
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
        setisExist(false);
      });
  }, [id, isExist]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/comments/board/${id}`)
      .then((response) => {
        console.log('Comments retrieved:', response.data);
        setComments(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving comments:', error);
      });
  }, [id]);

  useEffect(() => {
    if (jwtToken) {
      axios
        .get(`http://localhost:8080/api/board/${id}/check`, {
          headers: {
            Authorization: jwtToken,
          },
        })
        .then((response) => {
          setcheckuser(response.data);
        })
        .catch((error) => {
          console.error(error);
          setcheckuser(false);
        });
    } else {
      setcheckuser(false);
    }
  }, [id]);

  useEffect(() => {
    if (jwtToken) {
      axios
        .get(`http://localhost:8080/like/check/${id}`, {
          headers: {
            Authorization: jwtToken,
          },
        })
        .then((response) => {
          setchecklike(response.data);
        })
        .catch((error) => {
          console.error(error);
          setchecklike(false);
        });
    } else {
      setchecklike(false);
    }
  }, [id]);

  function HandleSubmit(e) {
    e.preventDefault();
    const data = {
      commentContents: writecomment,
    };
    if (jwtToken) {
      if (writecomment != '') {
        axios
          .post(`http://localhost:8080/api/comments/save/${id}`, data, {
            headers: {
              Authorization: jwtToken,
            },
          })
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
            cookies.remove('jwtToken');
            window.location.replace('/Login');
          });
      } else {
        alert('댓글을 채워주세요');
      }
    } else {
      setLoginshow(true);
    }
  }

  const handleClick = () => {
    movepage(`/Board/Update/${id}`);
  };

  function deleteBoard(e) {
    e.preventDefault();
    axios
      .delete(`http://localhost:8080/api/board/delete/${id}`, {
        headers: {
          Authorization: jwtToken,
        },
      })
      .then(() => {
        window.location.replace('/Board?page=1');
      })
      .catch((error) => {
        console.log(error);
        cookies.remove('jwtToken');
        window.location.replace('/Login');
      });
  }

  if (!post && isExist == true) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  } else if (!post && isExist == false) {
    return <div>게시글이 존재하지 않습니다.</div>;
  }

  //좋아요 색 바꾸기

  function likesubmit(e) {
    e.preventDefault();
    if (jwtToken) {
      if (checklike == false) {
        axios
          .post(
            `http://localhost:8080/like/save/${id}`,
            {},
            {
              headers: {
                Authorization: jwtToken,
              },
            }
          )
          .then(() => {
            setchecklike(!checklike);
          })
          .catch((error) => {
            console.log(error);
            cookies.remove('jwtToken');
            alert('로그인 시간 만료');
            window.location.replace('/Login');
          });
      } else {
        axios
          .delete(`http://localhost:8080/like/delete/${id}`, {
            headers: {
              Authorization: jwtToken,
            },
          })
          .then(() => {
            setchecklike(!checklike);
          })
          .catch((error) => {
            console.log(error);
            cookies.remove('jwtToken');
            window.location.replace('/Login');
          });
      }
    } else {
      setlikeLoginshow(true);
    }
  }

  return (
    <div className="BoardMainDetail">
      <div className="postdetail">
        <h1 className="posttitle">{post.title}</h1>
        <p className="postdetail2">
          <span className="postwriter">{post.writer}</span>
          <span>{slicdTime}</span>
          <span>추천수</span>
          <span>댓글</span>
        </p>
      </div>
      {checkuser ? (
        <div className="reformdelete">
          <Button variant="outline-primary" onClick={handleClick}>
            수정
          </Button>{' '}
          <Button variant="outline-primary" onClick={handleShow}>
            삭제
          </Button>{' '}
        </div>
      ) : (
        <div></div>
      )}
      <div className="postcontent">
        <p>{post.content}</p>
      </div>
      <div className="likebutton">
        {/* <Button as="input" type="button" value="추천" onClick={onshow} /> */}
        <div
          className={checklike ? 'likecircle-red' : 'likecircle'}
          onClick={likesubmit}
        >
          <span className="spanlikecircle">
            <AiOutlineLike size={40} />
            <span className="likespan">추천</span>
          </span>
        </div>
      </div>

      <div className="comment">
        <h4>댓글</h4>
        <hr />
        {comments.map((comment) => (
          // <Toast className="commentbox">
          //   <Toast.Header closeButton={false}>
          //     {/* <img
          //       src="holder.js/20x20?text=%20"
          //       className="rounded me-2"
          //       alt=""
          //     /> */}
          //     <strong className="me-auto">{comment.commentWriter}</strong>
          //     <small>{comment.createdTime}</small>
          //   </Toast.Header>
          //   <Toast.Body>{comment.commentContents}</Toast.Body>
          // </Toast>
          <Comment
            id={comment.id}
            commentWriter={comment.commentWriter}
            commentContents={comment.commentContents}
            createdTime={comment.createdTime}
          />
        ))}
      </div>

      <Form className="commentinput">
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <h4>댓글달기</h4>

          <Form.Control
            className="textinput"
            as="textarea"
            rows={3}
            maxLength="200"
            value={writecomment}
            onChange={(e) => handleComment(e)}
          />
          <div className="commentinputbutton">
            <Button
              as="input"
              type="button"
              value="등록"
              onClick={HandleSubmit}
            />
          </div>
        </Form.Group>
      </Form>

      <Modal show={Loginshow} onHide={LoginhandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>로그인</Modal.Title>
        </Modal.Header>
        <Modal.Body>댓글 작성 하시려면 로그인 해주세요</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={LoginhandleClose}>
            아니요
          </Button>
          <Button variant="primary" onClick={LoginhandleShow}>
            예
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={likeLoginshow} onHide={likehandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>로그인</Modal.Title>
        </Modal.Header>
        <Modal.Body>좋아요를 누르시려면 로그인 해주세요</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={likehandleClose}>
            아니요
          </Button>
          <Button variant="primary" onClick={LoginhandleShow}>
            예
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>게시글 삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>게시글을 정말 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            아니요
          </Button>
          <Button variant="primary" onClick={deleteBoard}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BoardDetail;
