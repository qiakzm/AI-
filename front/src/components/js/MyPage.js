// src/components/js/MyPage.js
import React, { useEffect } from 'react';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import UserPosts from './UserPosts';
import UserComments from './UserComments';
import LikedPosts from './LikedPosts';
import UserProfileEdit from './UserProfileEdit';
import UserProfileEditDetails from './UserProfileEditDetails';
import PostDetail from './PostDetail'; // 이미 존재하는 PostDetail 컴포넌트 임포트
import Header from './Header';
import { fetchPosts } from '../../redux/actions/postActions';
import '../css/MyPage.css';
import UserAnalyze from './UserAnalyze';

const MyPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="myPageContainer">
      {/* <Header /> */}
      <div className="contentContainer">
        <nav className="sidebar">
          <ul>
            <li><Link to="edit-profile">내 정보 수정</Link></li>
            <li><Link to="posts">내가 쓴 게시글</Link></li>
            <li><Link to="comments">내가 쓴 댓글</Link></li>
            <li><Link to="liked-posts">내가 좋아요한 게시글</Link></li>
            <li><Link to="analysis">나의 분석</Link></li>
          </ul>
        </nav>
        <div className="mainContent">
          <Routes>
            <Route path="edit-profile" element={<UserProfileEdit />} />
            <Route path="edit-profile/details" element={<UserProfileEditDetails />} />
            <Route path="posts" element={<UserPosts />} />
            <Route path="comments" element={<UserComments />} />
            <Route path="liked-posts" element={<LikedPosts />} />
            <Route path="analysis" element={<UserAnalyze/>} />
            <Route path="post/:id" element={<PostDetail />} /> {/* 기존 PostDetail 컴포넌트를 위한 라우트 추가 */}
            <Route path="*" element={<Navigate to="posts" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
