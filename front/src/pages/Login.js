import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Cookies } from 'react-cookie';
import Form from 'react-bootstrap/Form';
import '../css/login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const { email, password } = inputs;

  const onChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value, // name 키를 가진 값을 value 로 설정
    });
  };

  function HandleSubmit(e) {
    e.preventDefault();
    const data = {
      username: email,
      password: password,
    };

    if (email && password) {
      axios
        .post('http://localhost:8080/login', data, {
          headers: {
            'Content-Type': 'application/json', // 데이터 형식 지정
          },
          withCredentials: true,
        })
        .then((response) => {
          // const cookies = new Cookies();

          // const jwtToken = response.data;
          // console.log(response);
          // cookies.set('jwtToken', jwtToken); // 쿠키에 토큰 저장

          // console.log(jwtToken);

          // const jwtToken = response.headers.get('Authorization');
          const cookies = new Cookies();
          cookies.set('jwtToken', response.headers.get('Authorization'), {
            path: '/',
          });

          // navigate('/home');
          // window.location.reload();
          window.location.replace('/home');
        })
        .catch((error) => {
          console.error(error);
          alert('로그인 정보가 정확하지 않습니다.');
        });
    } else {
      alert('정보를 입력해주세요');
    }
  }

  return (
    <Form className="loginform" onSubmit={HandleSubmit}>
      <h1>DiscoLP</h1>
      <h6>로그인</h6>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="emaildetail">이메일 주소</Form.Label>
        <Form.Control
          name="email"
          type="email"
          placeholder="Enter email"
          onChange={onChange}
          value={email}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label className="pwddetail">비밀번호</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          onChange={onChange}
          value={password}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check className="checkdetail" type="checkbox" />
        <text className="logindetail">로그인 상태 유지</text>
      </Form.Group>
      <Button className="loginbutton" variant="primary" type="submit">
        로그인
      </Button>
    </Form>
  );
}

export default Login;
