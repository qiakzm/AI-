import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadPosts } from './redux/actions/postActions';
import { login, register, findId, fetchUsername, initializeLoginState } from '../src/redux/actions/authActions';
import { Cookies } from 'react-cookie';
import Home from './components/js/Home';
import Community from './components/js/Community';
import PostDetail from './components/js/PostDetail';
import QnA from './components/js/QnA';
import ScoreInput from './components/js/ScoreInput';
import ScoreQuery from './components/js/ScoreQuery';
import TodayProblem from './components/js/TodayProblem';
import MyPage from './components/js/MyPage';
import Communitybest from './components/js/Communitybest';
import CommunitySearch from './components/js/CommunitySearch';
import Header from './components/js/Header';
import Footer from './components/js/Footer'; // 추가된 Footer 컴포넌트
import Login from './components/js/LoginPopup';
import Register from './components/js/RegisterPopup';
import FindId from './components/js/FindIdPopup';
import LoginPopup from './components/js/LoginPopup';
import RegisterPopup from './components/js/RegisterPopup';
import FindIdPopup from './components/js/FindIdPopup';
import PrivateRoute from './components/js/PrivateRoute';
import ResetPassword from './components/js/ResetPasswordPopup';
import ResetPasswordPopup from './components/js/ResetPasswordPopup';
import SubjectSelectPopup from './components/js/SubjectSelectPopup';
import Communitypopular from './components/js/Communitypopular';


function App() {
  //팝업관리
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [isFindIdPopupOpen, setIsFindIdPopupOpen] = useState(false);
  const [isResetPasswordPopupOpen, setIsResetPasswordPopupOpen] = useState(false);
  const [showSubjectPopup, setShowSubjectPopup] = useState(false); // 과목 선택 팝업 상태

  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { loginError, registerError, foundId } = useSelector((state) => state.auth);

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  const openRegisterPopup = () => {
    setIsRegisterPopupOpen(true);
  };

  const closeRegisterPopup = () => {
    setIsRegisterPopupOpen(false);
  };

  const openFindIdPopup = () => {
    setIsFindIdPopupOpen(true);
  };

  const closeFindIdPopup = () => {
    setIsFindIdPopupOpen(false);
  };

  const openResetPasswordPopup = () => {
    setIsResetPasswordPopupOpen(true);
  };

  const closeResetPasswordPopup = () => {
    setIsResetPasswordPopupOpen(false);
  };

  const handleLogin = (id, password) => {
    dispatch(login(id, password));
  };

  const handleRegister = (form) => {
    dispatch(register(form));
  };

  const handleFindId = (name, email) => {
    dispatch(findId(name, email));
  };

  

  const logincookies = new Cookies();
  const jwtToken = logincookies.get('Authorization');

  
  

  // useEffect(() => {
  //   const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
  //   dispatch(loadPosts(storedPosts));
  // }, [dispatch]);

  // useEffect(() => {
   
  //   if (jwtToken) {
  //     dispatch(fetchUsername(jwtToken));
  //   }
  // }, [jwtToken, dispatch]);

  useEffect(() => {
    if (jwtToken) {
      dispatch(initializeLoginState())
    }
  }, [jwtToken]);


  return (
    <Router>
      <div className="App">
        <Header openLoginPopup={openLoginPopup}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/find-id" element={<FindId />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/community/popular" element={<PrivateRoute element={Communitypopular} />} />
          <Route path="/community/freeboard" element={<PrivateRoute element={Community} category="freeboard" />} />
          <Route path="/community/freeboard/best" element={<PrivateRoute element={Communitybest} category="freeboard" />} />
          <Route path="/community/freeboard/Search" element={<PrivateRoute element={CommunitySearch} category="freeboard" />} />
          <Route path="/community/study" element={<PrivateRoute element={Community} category="study" />} />
          <Route path="/community/study/best" element={<PrivateRoute element={Communitybest} category="study" />} />
          <Route path="/community/study/Search" element={<PrivateRoute element={CommunitySearch} category="study" />} />
          <Route path="/community/Challenge" element={<PrivateRoute element={Community} category="Challenge" />} />
          <Route path="/community/Challenge/best" element={<PrivateRoute element={Communitybest} category="Challenge" />} />
          <Route path="/community/Challenge/Search" element={<PrivateRoute element={CommunitySearch} category="Challenge" />} />
          <Route path="/post/:id" element={<PrivateRoute element={PostDetail} />} />
          <Route path="/qna" element={<QnA />} />
          <Route path='/score-input' element = {<PrivateRoute element={ScoreInput} />} />
          <Route path='/score-query' element = {<PrivateRoute element={ScoreQuery} />} />
          <Route path="/today-problem" element={<PrivateRoute element={TodayProblem} />} />
          <Route path="/mypage/*" element={<PrivateRoute element={MyPage} />} />
        </Routes>
        {isLoginPopupOpen &&
        (<LoginPopup
          onClose={closeLoginPopup}
          onLogin={handleLogin}
          loginError={loginError}
          openRegisterPopup={openRegisterPopup}
          openFindIdPopup={openFindIdPopup}
          openResetPasswordPopup={openResetPasswordPopup}
        />)}
      {isRegisterPopupOpen &&
        (<RegisterPopup
          onClose={closeRegisterPopup}
          onRegister={handleRegister}
          registerError={registerError}
        />)}
      {isFindIdPopupOpen &&
        (<FindIdPopup
          onClose={closeFindIdPopup}
          onFindId={handleFindId}
          foundId={foundId}
        />)}
      {isResetPasswordPopupOpen &&
        (<ResetPasswordPopup
          onClose={closeResetPasswordPopup}
        />)}
      
      </div>
    </Router>
  );
}

export default App;
