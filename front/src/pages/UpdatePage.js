import '../css/WritePage.css';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function UpdatePage() {
  const { id } = useParams();
  const [post, setPost] = useState('');

  const movePage = useNavigate();

  useEffect(() => {
    // 게시글 상세 정보 조회 API 호출
    axios
      .get(`http://localhost:8080/api/board/${id}`)
      .then((response) => {
        setPost(response.data);
        console.log(post);
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
      });
  }, [id]);

  const [Title, setTitle] = useState('');
  const [textValue, setTextValue] = useState('');

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleSetValue = (e) => {
    setTextValue(e.target.value);
  };

  const cookies = new Cookies();
  const jwtToken = cookies.get('jwtToken');

  useEffect(() => {}, [jwtToken]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setTextValue(post.content);
    }
  }, [post]);

  const handleSetTab = (e) => {
    if (e.keyCode === 9) {
      e.preventDefault();
      let val = e.target.value;
      let start = e.target.selectionStart;
      let end = e.target.selectionEnd;
      e.target.value = val.substring(0, start) + '\t' + val.substring(end);
      e.target.selectionStart = e.target.selectionEnd = start + 1;
      handleSetValue(e);
      return false; //  prevent focus
    }
  };

  function HandleSubmit(e) {
    e.preventDefault();
    const data = {
      title: Title,
      content: textValue,
    };

    if (textValue && Title) {
      axios
        .put(`http://localhost:8080/api/board/update/${id}`, data, {
          headers: {
            Authorization: jwtToken,
          },
        })
        .then(() => {
          window.location.replace(`/Board/${id}`);
        })
        .catch((error) => {
          console.log(error);
          cookies.remove('jwtToken');
          window.location.replace('/Login');
        });
    } else {
      alert('제목 또는 내용을 채워주세요');
    }
  }

  const handleClick = () => {
    console.log(post);
    console.log(post.title);
    console.log(post.content);
  };

  return (
    <div>
      <div className="Writecontainer">
        <h3>자유게시판</h3>
        <h5>수정</h5>
        <hr />{' '}
      </div>
      <div>
        <Form className="writeinputform">
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control
              type="text"
              placeholder="제목"
              value={Title}
              onChange={(e) => handleTitle(e)}
            />
            <Form.Control
              className="writeinput"
              as="textarea"
              rows={3}
              defaultValue={post.content}
              value={textValue}
              onChange={(e) => handleSetValue(e)}
              onKeyDown={(e) => handleSetTab(e)}
            />
          </Form.Group>
        </Form>
        {/* <hr />
        <p class="paragraph">{textValue}</p> */}
      </div>
      <div className="mb-2">
        <Button
          variant="primary"
          size="lg"
          className="deletebutton"
          onClick={handleClick}
        >
          삭제하기
        </Button>{' '}
        <Button
          variant="secondary"
          size="lg"
          className="savebutton"
          onClick={HandleSubmit}
        >
          저장하기
        </Button>
      </div>
    </div>
  );
}

export default UpdatePage;
