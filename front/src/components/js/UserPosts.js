import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../redux/reducers/userReducer';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import '../css/UserPosts.css';
import { formatDate } from '../../redux/actions/postActions';

const UserPosts = () => {
  const userData = useSelector(selectUserData);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);

  const cookies = new Cookies();
  const jwtToken = cookies.get('Authorization');

  const fetchPosts = async () => {
    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

    try {
      const response = await axios.get(`http://localhost:8080/board/MyPage`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });

      const postsData = Array.isArray(response.data) ? response.data : [];
      setPosts(postsData);
      setPostCount(postsData.length);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    if (jwtToken) {
      fetchPosts();
    }
  }, []);

  return (
    <div className='postList-container'>
      <div className='title'>
        <h2> 내가 작성한 게시물 </h2>
        <h2>{postCount} 개</h2>
      </div>
      <div className='list'>
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`}>
                {post.title}
              </Link>
              <span className='post_writed_time'>{formatDate(post.createdDate)} </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserPosts;
