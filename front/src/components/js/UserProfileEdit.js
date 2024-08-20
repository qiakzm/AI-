import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../css/UserProfileEdit.css';
import UserProfileEditDetails from './UserProfileEditDetails';
import EditPermit from '../../logo/edit_logo.png';
import axios from 'axios';
import { Cookies } from 'react-cookie';

const UserProfileEdit = () => {
  const passwordFromState = "123";
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const cookies = new Cookies();
  const jwtToken = cookies.get('Authorization');

  const handleSubmit = async(e) => {
    e.preventDefault();

    const userpw = {  
      'currentpw': password
    };
    
    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

    try{
      const response = await axios.post(`http://localhost:8080/member/check/curretpw`,userpw, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });
      setIsPasswordCorrect(true);
    }catch(error){
      if (error.response) {
        alert(error.response.data);
        console.error("비밀번호가 틀렸습니다.")
      }else{
        console.error('원인 모를 에러 발생', error);
      }
    }
  };

  if (isPasswordCorrect) {
    return <UserProfileEditDetails />;
  }

  return (
    <div className="edit-container">
      <div className="edit-content">
        <h2>내 정보 수정</h2>
        <img src={EditPermit} alt="Edit Permit" />
        <p>내 정보 수정을 위해서는 비밀번호 확인이 필요합니다.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            required
          />
          <button type="submit">확인</button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileEdit;
