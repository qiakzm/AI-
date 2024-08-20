import React, { useState, useEffect } from 'react';
import '../css/LoginPopup.css';
import logo from '../../logo.png';
import naverIcon from '../../logo/naver_logo.png'; // 네이버
import kakaoIcon from '../../logo/kakao_logo.png'; // 카카오
import googleIcon from '../../logo/google_logo.png'; // 구글
import { useSelector } from 'react-redux';

function LoginPopup({ onClose, onLogin, loginError, openRegisterPopup, openFindIdPopup, openResetPasswordPopup }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      onClose();
    }
  }, [isLoggedIn, onClose]);

  const handleLoginClick = () => {
    onLogin(id, password);
  };

  const onNaverLogin = () => {

    window.location.href = "http://localhost:8080/oauth2/authorization/naver"
  }

  const onGoogleLogin = () => {

    window.location.href = "http://localhost:8080/oauth2/authorization/google"
  }

  const onKakaoLogin = () => {

    window.location.href = "http://localhost:8080/oauth2/authorization/kakao"
  }

  return (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <button className="close-button" onClick={onClose}>×</button>
        <img src={logo} alt="Logo" className="login-logo" />
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {loginError && <p className="login-error">{loginError}</p>}
        <button className="login-button" onClick={handleLoginClick}>로그인</button>
        <div className="login-popup-footer">
          <div className='find-id-password'>
            <a href="#!" onClick={openFindIdPopup}>아이디 찾기</a>
            <span>/</span>
            <a href="#!" onClick={openResetPasswordPopup}>비밀번호 찾기</a>
          </div>
          <a href="#!" onClick={openRegisterPopup} className='register-link'>회원가입</a>
        </div>
        <div className="or-container">
          <hr className="line" />
          <span className="or">or</span>
          <hr className="line" />
        </div>
        <div className="social-buttons">
          <button className="social-button" onClick={onGoogleLogin}>
            <img src={googleIcon} alt="Google" />
          </button>
          <button className="social-button" onClick={onNaverLogin}>
            <img src={naverIcon} alt="Naver" />
          </button>
          <button className="social-button" onClick={onKakaoLogin} >
            <img src={kakaoIcon} alt="Kakao" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPopup;
