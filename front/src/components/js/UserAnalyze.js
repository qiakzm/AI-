import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../redux/reducers/userReducer';
import { commentDate } from '../../redux/actions/postActions';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import '../css/UserPosts.css';
import '../css/UserAnalyze.css';

const UserAnalyze = () => {
  const userData = useSelector(selectUserData);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [summary, setSummary] = useState("");

  const cookies = new Cookies();
  const jwtToken = cookies.get('Authorization');

  const fetchPosts = async () => {
    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

    try {
      const response = await axios.get(`http://localhost:8080/analyze/MyPage`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });

      const fetchedPosts = Array.isArray(response.data) ? response.data : [];
      setPosts(fetchedPosts);
      setPostCount(fetchedPosts.length);
      if (fetchedPosts.length > 0) {
        generateSummary(fetchedPosts.map(post => post.analysisText));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]); // Ensure posts is an array even on error
    }
  };

  const generateSummary = async (analyses) => {
    try {
      const response = await axios.post('http://localhost:5000/generate_summary', {
        analyses
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  useEffect(() => {
    if (jwtToken) {
      fetchPosts();
    }
  }, [jwtToken]);

  return (
    <div className='postList-container'>
      <div className='title'>
        <h2> 나의 분석</h2>
        <h2>{postCount}개</h2>
      </div>
      <div className='oneline_summary'>
        <h3>한 줄 요약</h3>
      </div>
      <div className='summary'>
        <p>{summary}</p>
      </div>
      <div className='analyze-list'>
        <ul>
          {Array.isArray(posts) && posts.map(post => (
            <li key={post.id}>
              <span>{commentDate(post.createdDate)}</span>
              <span>{post.year}년도 {post.month}월
              과목 : {post.subject}
              선택 과목 : {post.type}</span>
              {post.analysisText}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserAnalyze;
