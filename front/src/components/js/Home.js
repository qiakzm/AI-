import React, { useState,useEffect } from 'react';
import '../css/Home.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, findId } from '../../redux/actions/authActions';
import { Link } from 'react-router-dom';
import logo from '../../logo.png'; // 로고 이미지 경로
import penIcon from '../../logo/pen_logo.png'; // 문제 풀기 아이콘 이미지 경로
import graphIcon from '../../logo/graph_logo.png'; // 나의 학습 아이콘 이미지 경로
import commuIcon from '../../logo/community_logo.png'; // 커뮤니티 아이콘
import qnaIcon from '../../logo/qna_logo.png'; // Q n A 아이콘 이미지 경로
import searchIcon from '../../logo/search_logo.png'; // 검색 아이콘 이미지 경로
import starIcon from '../../logo/star_logo.png'; // 별 아이콘
import LoginPopup from './LoginPopup';
import RegisterPopup from './RegisterPopup';
import FindIdPopup from './FindIdPopup';
import ResetPasswordPopup from './ResetPasswordPopup';
import Header from './Header';
import Footer from './Footer';
import SubjectSelectPopup from './SubjectSelectPopup';
import { useNavigate } from 'react-router-dom'; // useNavigate import 추가

function Home() {
  
  const [showSubjectPopup, setShowSubjectPopup] = useState(false); // 과목 선택 팝업 상태

  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate 훅 사용
 

  

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/board/random-popular-boards`);
      
      setPopularPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  const fetchstudyPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/board/random-popular-boards`);
      
      setStudyPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchstudyPosts();
  }, []);


  const [studyPosts, setStudyPosts] = useState([]);

  const [trendingSearches, setTrendingSearches] = useState([
    '#2024 6모 등급컷',
    '#해설 강의 추천',
  ]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    console.log(`Searching for: ${searchQuery}`);
    setSearchResults([
      { id: 1, title: `${searchQuery} 관련 결과 1` },
      { id: 2, title: `${searchQuery} 관련 결과 2` },
    ]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const openSubjectPopup = (event) => {
    event.preventDefault();
    setShowSubjectPopup(true);
  };

  const closeSubjectPopup = () => {
    setShowSubjectPopup(false);
  };

  const handleSelectSubject = (subject) => {
    if (subject === '닫기'){
      setShowSubjectPopup(false);
    }
    else {
      setShowSubjectPopup(false);
      navigate(`/today-problem?subject=${subject}`); // 선택된 과목으로 페이지 이동
    }
  };

  const handlePostClick = (postId) => {
    window.location.replace(`/post/${postId}`);
  };

  return (
    <div className="Home">
      {/* <Header openLoginPopup={openLoginPopup} /> */}
      <main className="main-content">
        <div className="menu-container">
          <div className="menu-item">
            <h2>
              <img src={penIcon} alt="문제 풀기 아이콘" className="menu-icon" />
              문제 풀기
            </h2>
            <ul>
              <li><a href="Today" onClick={openSubjectPopup}>오늘의 문제</a></li>
            </ul>
          </div>
          <div className="menu-item">
            <h2>
              <img src={graphIcon} alt="나의 학습 아이콘" className="menu-icon" />
              나의 학습
            </h2>
            <ul>
              <li><Link to="score-query">성적 조회</Link></li>
              <li><Link to="score-input">성적 입력</Link></li>
            </ul>
          </div>
          <div className="menu-item">
            <h2>
              <img src={commuIcon} alt="커뮤니티 아이콘" className="menu-icon" />
              커뮤니티
            </h2>
            <ul>
              <li><Link to="/community/freeboard">자유게시판</Link></li>
              <li><Link to="/community/study">스터디모집</Link></li>
            </ul>
          </div>
          <div className="menu-item">
            <h2>
              <img src={qnaIcon} alt="Q n A 아이콘" className="menu-icon" />
              Q n A
            </h2>
            <ul>
              <li><Link to="/qna">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="search-and-community">
          <div className="search-container">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="검색"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
              <button className="icon-button search-button" onClick={handleSearch}>
                <img src={searchIcon} alt="Search Icon" className="search-icon" />
              </button>
            </div>
            <div className="trending-searches">
              {trendingSearches.map((search, index) => (
                <span key={index} className="trending-search">{search}</span>
              ))}
            </div>
            <div className="search-results">
              <ul>
                {searchResults.map((result) => (
                  <li key={result.id}>{result.title}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="community-container">
            <h2>
              <img src={starIcon} alt="커뮤니티 아이콘" className="community-icon" />
              커뮤니티
            </h2>
            <div className="community-item">
              <h3>인기글</h3>
              <ul>
                {popularPosts.map((post) => (
                  <li key={post.id} onClick={() => handlePostClick(post.id)}>{post.title}</li>
                ))}
              </ul>
            </div>
            <div className="community-item">
              <h3>스터디 모집</h3>
              <ul>
                {studyPosts.map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {showSubjectPopup &&
      (<SubjectSelectPopup onSelect={handleSelectSubject} />)} 
    </div>
  );
}

export default Home;
