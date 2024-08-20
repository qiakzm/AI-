import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findId } from '../../redux/actions/authActions';
import '../css/FindIdPopup.css';
import logo from '../../logo.png';
import { resetFindId } from '../../redux/actions/authActions';

function FindIdPopup({ onClose }) {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const foundId = useSelector(state => state.auth.foundId);

  const handleFindId = () => {
    if(email==''){
      alert('이메일을 입력해주세요.');
      return;
    }

    dispatch(findId(email));
  };

  useEffect(() => {
    // 컴포넌트가 언마운트될 때 초기화 액션 디스패치
    return () => {
      dispatch(resetFindId());
    };
  }, [dispatch]);

  return (
    <div className="find-id-popup-overlay">
      <div className="find-id-popup">
        <button className="close-button" onClick={onClose}>×</button>
        <img src={logo} alt="Logo" className="popup-logo" />
        <div className="find-id-section">
          <h2>아이디 찾기</h2>
          <input 
            type="email" 
            placeholder="이메일" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="short-input" 
          />
          <button className="find-id-button" onClick={handleFindId}>확인</button>
          {foundId && <p className='find-id-message'>{foundId}</p>}
        </div>
      </div>
    </div>
  );
}

export default FindIdPopup;
