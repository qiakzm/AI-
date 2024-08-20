import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import '../css/Register.css';
import EmailCheckAuth from '../check/checkAuth';
import { useNavigate } from 'react-router-dom';

function Register() {
  //유효성 검사
  const [isId, setisID] = useState('');
  const [isnickname, setisnickname] = useState('');
  const [ispassword, setispassword] = useState('');
  const [isConfirmpassword, setisConfirmpassword] = useState('');
  //유효성 검사실패 메세지
  const [Emailmessage, setEmailmessage] = useState('');
  const [nicknamemessage, setnicknamemessage] = useState('');
  const [passwordmessage, setpasswordmessage] = useState('');
  const [confirmpasswordmessage, setconfirmpasswordmessage] = useState('');
  //페이지 이동
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    confirmpassword: '',
    nickname: '',
  });

  const { email, password, confirmpassword, nickname } = inputs;

  //이메일 중복검사
  const checkingemail = EmailCheckAuth(
    'http://localhost:8080/member/check-email/' + email
  );

  const onChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value, // name 키를 가진 값을 value 로 설정
    });
  };

  const checkemail = async () => {
    const emailRegExp =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
    if (email == '') {
      setisID(false);
      setEmailmessage('');
    } else {
      if (!emailRegExp.test(email)) {
        setisID(false);
        setEmailmessage('올바른 이메일 형식을 입력해주세요');
      } else {
        setisID(true);
        setEmailmessage('');
      }
    }
  };

  const checkpassword = async () => {
    const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,10}$/;
    if (password == '') {
      setispassword(false);
      setpasswordmessage('');
    } else {
      if (!passwordRegExp.test(password)) {
        setispassword(false);
        setpasswordmessage(' 8 ~ 10자 영문, 숫자 조합을 입력해주세요');
      } else {
        setispassword(true);
        setpasswordmessage('');
      }
    }
  };

  //비밀번호 재확인
  const confirmingpassword = async () => {
    if (confirmpassword == '') {
      setisConfirmpassword(false);
      setconfirmpasswordmessage('');
    } else {
      if (password == confirmpassword) {
        setisConfirmpassword(true);
        setconfirmpasswordmessage('');
      } else {
        setisConfirmpassword(false);
        setconfirmpasswordmessage('비밀번호가 일치하지 않습니다.');
      }
    }
  };

  const checknickname = async () => {
    const nicknameRegExp = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,10}$/;
    if (nickname == '') {
      setisnickname(false);
      setnicknamemessage('');
    } else {
      if (!nicknameRegExp.test(nickname)) {
        setisnickname(false);
        setnicknamemessage('한글,영문,숫자만 2~10자리로 입력해주세요 ');
      } else {
        setisnickname(true);
        setnicknamemessage('');
      }
    }
  };

  function HandleSubmit(e) {
    e.preventDefault();

    if (isId && ispassword && isConfirmpassword && isnickname) {
      // 모든 필수 정보가  입력되었을 때 회원가입 처리
      const test = true;
      // console.log(checkingemail);
      if (test == true) {
        axios.post('http://localhost:8080/test/auth/register', {
          username: email,
          password: password,
          name: nickname,
        });

        alert('회원가입되었습니다.');
        navigate('/');
      } else {
        alert('이미존재하는 회원입니다.');
      }
    } else {
      alert('모든 필수 정보를 입력해주세요.');
    }
  }

  return (
    <Form className="registerform" onSubmit={HandleSubmit}>
      <h1>DiscoLP</h1>
      <h6>회원가입</h6>
      <Form.Group className="emailinput" controlId="formBasicEmail">
        <Form.Label className="emaildetail">이메일 주소</Form.Label>
        <Form.Control
          name="email"
          type="email"
          placeholder="Enter email"
          onChange={onChange}
          onBlur={checkemail}
          value={email}
        />
        <p>{Emailmessage}</p>
      </Form.Group>

      <Form.Group className="passwordinput" controlId="formBasicPassword1">
        <Form.Label className="pwddetail">비밀번호</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          onChange={onChange}
          onBlur={checkpassword}
          value={password}
        />
        <p>{passwordmessage}</p>
      </Form.Group>
      <Form.Group className="passwordinput" controlId="formBasicPassword2">
        <Form.Label className="pwddetail">비밀번호 재입력</Form.Label>
        <Form.Control
          name="confirmpassword"
          type="password"
          placeholder="Password"
          onChange={onChange}
          onBlur={confirmingpassword}
        />
        <p>{confirmpasswordmessage}</p>
      </Form.Group>
      <Form.Group className="nicknameinput" controlId="formBasicNickname">
        <Form.Label className="nickdetail">닉네임</Form.Label>
        <Form.Control
          type="text"
          name="nickname"
          placeholder="Nickname"
          onChange={onChange}
          value={nickname}
          onBlur={checknickname}
        />
        <p>{nicknamemessage}</p>
      </Form.Group>

      <Button className="registerbutton" variant="primary" type="submit">
        회원가입
      </Button>
    </Form>
  );
}

export default Register;
