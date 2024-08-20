import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ResetPasswordPopup.css';
import logo from '../../logo.png';
import { checkEmailExists } from '../../redux/actions/authActions';

function ResetPasswordPopup({ onClose }) {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [isVerified,setIsVerified] = useState(false);
  const [timer, setTimer] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');

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

  const handleSendVerificationCode = async() => {
    const requestData = {
      email: email
    };

    if(email==''){
      alert('이메일을 입력해주세요.');
      return;
    }

    const emailExists = await checkEmailExists(email);
    if(!emailExists){
      
      alert("회원정보가 존재하지 않는 이메일입니다");
      return;
    }
    
    console.log("Sending email verification to:", email);
  
    try {
      const response = axios.post('http://localhost:8080/Mail/mailSend/findPassword', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log("Email sent successfully:", response);
  
      setIsTimerActive(true);
      setIsCodeSent(true);
      setTimer(180);
      alert('인증 코드가 전송되었습니다.');
    } catch (error) {
      if (error.response) {
        alert(error.response.data);
        console.error("인증번호가 옳지 않습니다.")
      }else{
        alert("이메일 인증번호 전송에 실패했습니다. 다시 시도해주세요.");
        console.error('원인 모를 에러 발생', error);
      }
      
    }
  };

  const handleVerifyCode = async() => {
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

  const handleResetPassword = async() => {
    if (newPassword !== confirmPassword) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.');
    } else {
      const requestData = {
        username : id,
        email : email,
        authNum : verificationCode,
        changepw: newPassword
      };
  
      try{
        const response = await axios.put(`http://localhost:8080/member/find/changepw`,requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        
        alert('비밀번호가 변경되었습니다.');
        onClose();

       
  
      }catch(error){
        if (error.response) {
          alert(error.response.data);
          console.error("비밀번호 변경에 실패하였습니다.")
        }else{
          console.error('원인 모를 에러 발생', error);
        }
      }
    }
  };



  return (
    <div className="reset-password-popup-overlay">
      <div className="reset-password-popup">
        <button className="close-button" onClick={onClose}>×</button>
        <img src={logo} alt="Logo" className="popup-logo" />
        <div className="reset-password-section">
          <h2>비밀번호 찾기</h2>
          <input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="email" placeholder="이메일 주소" value={email} onChange={(e) => setEmail(e.target.value)} className="short-input" disabled={isVerified}/>
            <button className="send-button" onClick={handleSendVerificationCode} disabled={isTimerActive}>전송</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="text" placeholder="인증 번호" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="short-input" disabled={isVerified}/>
            <button className="verify-button" onClick={handleVerifyCode} disabled={!isCodeSent}>확인</button>
            {isCodeSent && <span>{`${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`}</span>}
          </div>
          <input type="password" placeholder="새로운 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <input type="password" placeholder="새로운 비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {passwordMatchError && <p className="error-message">{passwordMatchError}</p>}
          <button className="reset-password-button" onClick={handleResetPassword}>비밀번호 변경</button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPopup;
