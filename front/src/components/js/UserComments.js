import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../redux/reducers/userReducer';
import { commentDate } from '../../redux/actions/postActions';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import '../css/UserPosts.css';

const UserComments = () => {
  const userData = useSelector(selectUserData);
  

  const [posts,setposts] = useState([]);
  const [commentCount,setcommentCount] = useState(0);

  const cookies = new Cookies();
  const jwtToken = cookies.get('Authorization');

  const fetchPosts = async () => {
    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

    try {
      const response = await axios.get(`http://localhost:8080/comment/MyPage/MyComments`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });
      
      setposts(response.data)
      setcommentCount(response.data.length);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  useEffect(() => {
    if(jwtToken){
      fetchPosts();
    }
  }, []);



  return (
    <div className="commentList-container">
      <div className="title">
        <h2>내가 쓴 댓글 </h2>
        <h2>{commentCount}개</h2>
      </div>
      <div className="list">
        <ul>
          {posts.map(comment => (
            <li key={comment.id}>
              <Link to={`/post/${comment.boardid}`}>
                <div className='commentItem'>
                  <div className="commentTitle">{comment.boardtitle}</div>
                  <p>- {comment.content}</p>
                </div>
              </Link>
              <span className='writed_comment_time'>{commentDate(comment.createdDate)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserComments;
