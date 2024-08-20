import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import user from '../../logo/user_logo2.png';
import { commentDate } from '../../redux/actions/postActions';

const CommentDetail = ({ id,author,content,date }) =>{
  const [isMyComment, setIsMyComment] = useState(false);

  const cookies = new Cookies();
  const jwtToken = cookies.get('Authorization');

  const fetchisMyComment = async () => {
    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

    try {
      const response = await axios.get(`http://localhost:8080/comment/${id}/isMyComment`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });
  
      const isMyComment = response.data; // 서버에서 true 또는 false 값을 받아옴
  
      if (isMyComment === true) {
       
        setIsMyComment(true);
      } else {
        setIsMyComment(false);
      }
    } catch (error) {
     
      setIsMyComment(false); // 오류가 발생한 경우 기본적으로 false로 설정
    }
  }
  
  useEffect(() => {
      if(jwtToken){
          fetchisMyComment();
      }
    }, [jwtToken]);

  const handleDeleteComment = async() => {
    if(window.confirm("정말 댓글을 삭제하시겠습니까?")){
      const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

      await axios.delete(`http://localhost:8080/comment/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwtToken,
        },
      });
      window.location.reload();
    
    }
    
  };



  return (
    <li className="comment">
      <div className="comment-left">
        <div className="comment-author-container">
          <img src={user} alt="comment-user-icon" className="comment-user-icon" />
          <span className="comment-author">{author}</span>
        </div>
        <span className="comment-date">{commentDate(date)}</span>
        <p className='comment-content'>{content}</p>
      </div>
      {isMyComment ? (
        <button onClick={handleDeleteComment} className="delete-comment-button">삭제</button>
      ) : null}
    </li>
  );
};

export default CommentDetail;
