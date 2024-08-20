import axios from "axios";
import { Cookies } from 'react-cookie';

export const login = (id, password) => {
    return async (dispatch) => {
      if (!id || !password) {
        alert('정보를 입력해주세요');
        return;
      }

      const data = new URLSearchParams();
      data.append('username', id);
      data.append('password', password);

      try {
        const response = await axios.post('http://localhost:8080/login', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          withCredentials: true,
        });

        const authorizationHeader = response.headers['authorization'];
      
        if (!authorizationHeader) {
          alert('아이디나 비밀번호가 정확하지 않습니다.');
        
          return;
        }
  
        const cookies = new Cookies();
        cookies.set('Authorization', response.headers.get('Authorization'), {
          path: '/',
        });
        const userId = response.data.userId;

        dispatch({ type: 'LOGIN_SUCCESS', payload: { id: userId } });
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert('로그인 정보가 정확하지 않습니다.');
        dispatch({ type: 'LOGIN_FAILURE', payload: '로그인 정보가 정확하지 않습니다.' });
      }
    };
  };
  
  export const register = (form) => {
    return async (dispatch) => {
      const requestData = {
        memberEmail: form.email || '',
        memberUsername: form.id || '',
        memberName: form.name || '',
        memberPassword: form.password || '',
        memberGrade: form.grade || '',
        authNum:form.verificationCode || '',
      };

      //한곳이 비어있으면 다 입력해야함
      const allFieldsFilled = Object.values(requestData).every(value => value.trim() !== '');
      

      if (!allFieldsFilled) {
        alert('모든 곳을 입력해주세요');
        return;
      }

      // Check if email and username exist
      const emailExists = await checkEmailExists(form.email);
      const usernameExists = await checkUsernameExists(form.id);

      if (usernameExists) {
        alert('이미 존재하는 아이디입니다.');
        return;
      }
      
      // Check if password and confirmPassword match
      if (form.password !== form.confirmPassword) {
        alert('확인 비밀번호와 일치하지 않습니다');
        return;
      }
  
      
  
      if (emailExists) {
        alert('이미 존재하는 이메일입니다.');
        return;
      }
  
      if(!form.isVerified){
        alert("이메일 인증을 하시길 바랍니다.");
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/member/register', requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
  
        console.log('Response:', response.data);
        dispatch({ type: 'REGISTER_SUCCESS' });
        alert("성공적으로 회원가입 하였습니다.")
        window.location.replace('/');
        
      } catch (error) {
        if (error.response) {
          console.alert(error.response.data);
          dispatch({ type: 'REGISTER_FAILURE', payload: '회원가입 중 오류가 발생했습니다.' });
          
        }else{
          console.error('원인 모를 에러 발생', error);
          
        }
      }

    };
  };
  
  export const findId = (email) => {
    const requestData = {
      "email": email
    };

    

    return async (dispatch) => {
      try {
        const response = await axios.post('http://localhost:8080/Mail/mailSend/findUsername', requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        dispatch({ type: 'FIND_ID_SUCCESS', payload: '작성해주신 이메일로 아이디를 전송했습니다.'});
      } catch (error) {
        if (error.response) {
          alert(error.response.data);
          console.error("존재하지 않는 회원입니다.")
        }else{
          console.error('원인 모를 에러 발생', error);
        }
      }
    };
  };

  export const resetFindId = () => {
    return { type: 'FIND_ID_FAILURE'};
  };
  
  export const logout = () => {
    return async(dispatch) => {
      const cookies = new Cookies();
      const jwtToken = cookies.get('Authorization');
      cookies.remove('Authorization');
      
      const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;
  
      const requestData = {
        jwt : bearerToken
      };
  
      try {
        const response = await axios.post(`http://localhost:8080/member/logout`,requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(jwtToken);
        cookies.remove('Authorization', { path: '/' });
        dispatch({ type: 'LOGOUT' });
        window.location.reload();
      } catch (error) {
        
        cookies.remove('Authorization', { path: '/' });
        dispatch({ type: 'LOGOUT' });
        window.location.reload();
        console.log("logout failed")
        console.error(error);
      }
      
      
     
    };
  };
  
  // 예시용 fake API 함수
  const fakeLoginApi = async (id, password) => {
    console.log(`Attempting login with ID: ${id}, Password: ${password}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (id === 'testuser' && password === 'password123') {
          resolve({ success: true, user: { email: 'test@test.com', username: 'testuser', school: 'test highschool' } });
        } else {
          resolve({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }
      }, 1000);
    });
  };
  
  const fakeRegisterApi = async (form) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };
  



  const fakeFindIdApi = async (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: '작성해주신 이메일로 아이디를 전송했습니다.' });
      }, 1000);
    });
  };


  export const fetchUsername = (jwtToken) => {
    return async (dispatch) => {
      try {
        const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;
  
        const response = await axios.get(`http://localhost:8080/member/username`, {
          headers: {
            Authorization: bearerToken,
          },
        });
        console.log("bearerToken"+bearerToken)
        dispatch({ type: 'SET_USERNAME', payload: response.data });
      } catch (error) {
        console.error(error);
        const cookies = new Cookies();
        const Token = cookies.get('Authorization');
        cookies.remove('Authorization');
        
        dispatch({ type: 'LOGOUT' });
        dispatch({ type: 'SET_USERNAME', payload: null });
        window.location.reload();
      }
    };
  };
  
  export const initializeLoginState = () => {
    return async (dispatch) => {
      const cookies = new Cookies();
      const jwtToken = cookies.get('Authorization');
      if (jwtToken) {
        // 토큰 유효성 검사를 여기서 하세요
        dispatch({ type: 'LOGIN_SUCCESS'});
      }
    }
  };

//이메일 존재 확인
export const checkEmailExists = async (email) => {
  try {
    const response = await axios.get(`http://localhost:8080/member/check-email/${email}`);
    return response.data; // true or false
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
};

//유저이름 존재 확인
const checkUsernameExists = async (username) => {
  try {
    const response = await axios.get(`http://localhost:8080/member/check-username/${username}`);
    return response.data; // true or false
  } catch (error) {
    console.error('Error checking username existence:', error);
    return false;
  }
};