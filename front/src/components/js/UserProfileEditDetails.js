import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData, selectUserData } from '../../redux/reducers/userReducer';
import { useNavigate } from 'react-router-dom';
import '../css/UserProfileEditDetails.css';

const UserProfileEditDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [school, setSchool] = useState(user.school);
  const [userpassword, setUserpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userpassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const updatedUserData = {
      ...user,
      email,
      username,
      school,
      password: userpassword || user.password, // 비밀번호가 비어있지 않으면 업데이트
    };

    dispatch(updateUserData(updatedUserData));
    alert('프로필이 성공적으로 업데이트되었습니다!');
    navigate('/mypage');
  };

  return (
    <div className="edit-details-container">
      <h1>내 정보 수정</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>학교</label>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
          />
        </div>
        <div>
          <label>e-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>새 비밀번호</label>
          <input
            type="password"
            value={userpassword}
            onChange={(e) => setUserpassword(e.target.value)}
          />
        </div>
        <div>
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className='submit-button' type="submit">프로필 업데이트</button>
      </form>
    </div>
  );
};

export default UserProfileEditDetails;
