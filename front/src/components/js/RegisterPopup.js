import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/RegisterPopup.css';
import logo from '../../logo.png';
import {checkEmailExists} from '../../redux/actions/authActions'


function RegisterPopup({ onClose, onRegister, registerError }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [timer, setTimer] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isVerified,setIsVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      setIsCodeSent(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const handleRegisterClick = () => {
    const form = {
      id,
      password,
      confirmPassword,
      name,
      grade,
      email,
      verificationCode,
      isVerified,
    };
    onRegister(form);
  };

  const handleSendVerificationCode = async () => {
    const requestData = {
      email: email
    };
    const emailExists = await checkEmailExists(email);
    if(emailExists){
      console.log(email);
      alert("이미 존재하는 이메일입니다.");
      return;
    }

    console.log("Sending email verification to:", email);
  
    try {
      const response = axios.post('http://localhost:8080/Mail/mailSend', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log("Email sent successfully:", response);
  
      setIsTimerActive(true);
      setIsCodeSent(true);
      setTimer(180);
    } catch (error) {
      console.error("이메일 인증번호 전송 실패", error);
      alert("이메일 인증번호 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleVerifyCode = async () => {
    const requestData = {
      email : email,
      authNum : verificationCode
    };

    try{
      const response = await axios.post(`http://localhost:8080/Mail/mailauthCheck`,requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      setIsVerified(true);
      alert("성공적으로 인증하였습니다.")
      setIsTimerActive(false);

    }catch(error){
      if (error.response) {
        alert(error.response.data);
        console.error("인증번호가 옳지 않습니다.")
      }else{
        console.error('원인 모를 에러 발생', error);
      }
    }
  };

  return (
    <div className="register-popup-overlay">
      <div className="register-popup">
        <button className="close-button" onClick={onClose}>×</button>
        <img src={logo} alt="Logo" className="register-logo" />
        <input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} />
        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <div className="name-grade">
          <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
          <select value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="">학년 선택</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </select>
        </div>
        <div className="email-container">
          <input type="email" placeholder="이메일 주소" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isVerified}/>
          <button className="send-button" onClick={handleSendVerificationCode} disabled={isTimerActive}>전송</button>
        </div>
        <div className="verification-container">
          <input type="text" placeholder="인증 번호" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} disabled={isVerified}/>
          <button className="verify-button" onClick={handleVerifyCode} disabled={!isCodeSent}>확인</button>
          {isCodeSent && <span>{`${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`}</span>}
        </div>
        {registerError && <p className="register-error">{registerError}</p>}
        <button className="register-button" onClick={handleRegisterClick}>회원가입</button>
      </div>
    </div>
  );
}

export default RegisterPopup;
