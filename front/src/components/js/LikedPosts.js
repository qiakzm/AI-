import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import '../css/UserPosts.css';

const LikedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [likedPostCount, setLikedCount] = useState(0);

  const cookies = new Cookies();
  const jwtToken = cookies.get('Authorization');

  const fetchPosts = async () => {
    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

    try {
      const response = await axios.get(`http://localhost:8080/BoardLike/MyPage`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });

      const fetchedPosts = Array.isArray(response.data) ? response.data : [];
      setPosts(fetchedPosts);
      setLikedCount(fetchedPosts.length);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    if (jwtToken) {
      fetchPosts();
    }
  }, [jwtToken]);

  return (
    <div className='List-container'>
      <div className='title'>
        <h2> 좋아요❤️ 게시물 </h2>
        <h2>{likedPostCount}개</h2>
      </div>
      <div className='list'>
        <ul>
          {Array.isArray(posts) && posts.map(post => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`}>
                <div className="commentTitle">{post.title}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LikedPosts;
