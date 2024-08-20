import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isLoggedIn = true;
  const navigate = useNavigate();
  
  const cookies = new Cookies();
  const jwtToken = cookies.get('Authorization');


  useEffect(() => {
    if (!jwtToken) {
      alert('로그인을 해야 이용가능합니다.');
      window.location.replace('/');
      return;
    }

    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;  

    try {
      

      const response = axios.get(`http://localhost:8080/member/check/jwt`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });
      console.log(response.data)

    } catch (error) {
      console.error('Invalid token:', error);
      alert('유효하지 않은 토큰입니다. 다시 로그인해주세요.');
      cookies.remove('Authorization');
      window.location.replace('/');
    }
  }, [jwtToken]);

  // JWT가 유효하지 않은 경우 null 반환
  if (!jwtToken) {
    return null;
  }



  return <Element {...rest} />;
};

export default PrivateRoute;
