import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout ,fetchUsername} from '../../redux/actions/authActions';
import Speaker_Button from './Speaker';
import { Cookies } from 'react-cookie';
import { formatDate } from '../../redux/actions/postActions';
import { EventSourcePolyfill } from 'event-source-polyfill';
import axios from 'axios';
import '../css/Header.css';
import logo from '../../logo.png'; // 로고 이미지 경로
import soundIcon from '../../logo/sound_logo.png'; // 소리 아이콘 이미지 경로
import userIcon from '../../logo/user_logo.png'; // 유저 아이콘 이미지 경로
import mailIcon from '../../logo/mail_logo.png'; // 메일 아이콘 이미지 경로

function Header({ openLoginPopup }) {
  const dispatch = useDispatch();
  const { isLoggedIn, userId ,username} = useSelector((state) => state.auth);
  const [ isNotificationOpen, setIsNotificationOpen ] = useState(false);
  
  const [notifications,setnotifications] = useState([]);
  



  const cookies = new Cookies();
  const jwtToken = cookies.get('Authorization');

  const handleLogoClick = () => {
    window.location.href = '/'; // 원하는 URL로 대체하세요
  };


  const fetchNotification = async () => {
    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

    try {
      const response = await axios.get(`http://localhost:8080/api/mynotification`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });
      
      setnotifications(response.data)
      
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  useEffect(() => {
    if(jwtToken){
      fetchNotification();
      
    }
  }, []);

  useEffect(() => {
   
    if (jwtToken) {
      dispatch(fetchUsername(jwtToken));
    }
  }, [jwtToken, dispatch]);

  useEffect(() => {
    if (jwtToken) {
      const eventSource = new EventSourcePolyfill(`http://localhost:8080/api/v1/notifications/stream`, {
        headers: {
          'Authorization': jwtToken,
        },
        heartbeatTimeout: 1740000,
      });

      eventSource.onopen = () => {
        console.log('connected');
      };

      eventSource.addEventListener('notification', (e) => {
        const { data: receivedConnectData } = e;
        console.log('connect event data: ', receivedConnectData);
        fetchNotification();
      });

      eventSource.onerror = (e) => {
        console.error('SSE connection error:', e);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [jwtToken]);



  const handleLogout = () => {
    dispatch(logout());
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleNotificationItemClick = async (postId,notificationId) => {
    

    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

    try {
      const response = await axios.put(`http://localhost:8080/api/${notificationId}/read`,{},{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });
      
      console.log(response.data);
      
    } catch (error) {
      if (error.response) {
        alert(error.response.data);
        console.error("인증번호가 옳지 않습니다.")
      }else{
        console.error('원인 모를 에러 발생', error);
      }
    }

    window.location.href=`/post/${postId}`;
  };

  return (
    <header className="header">
      <div className="header-left">
        <Speaker_Button />
      </div>
      <div className="header-center">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Logo" />
          </div>
      </div>
      <div className="header-right">
        {isLoggedIn ? (
          <>
            <span>{username}님</span>
            <button className="logout-button" onClick={handleLogout}>로그아웃</button>
            <Link to="/mypage" className="icon-button">
              <img src={userIcon} alt="User Icon" className="user-icon" />
            </Link>
            <button className="icon-button" onClick={handleNotificationClick}>
              <img src={mailIcon} alt="Mail Icon" className="user-icon" />
            </button>
            {isNotificationOpen && (
              <div className="notification-popup">
                {notifications.length === 0 ? (
                  <li>알림이 없습니다</li>
                ) : (
                 <ul>
                  {notifications.map((notification) => (
                    <li key={notification.id} onClick={() => handleNotificationItemClick(notification.boardId,notification.id)}>
                      {notification.message} <span>{formatDate(notification.createdDate)}</span>
                    </li>
                  ))}
                </ul>)}
              </div>
            )}
          </>
        ) : (
          <>
            <button className="login-register" onClick={openLoginPopup}>로그인/회원가입</button>
            <button className="icon-button">
              <img src={userIcon} alt="User Icon" className="user-icon" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
