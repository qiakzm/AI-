import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updatePost, deletePost, commentDate } from '../../redux/actions/postActions';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import BeforeLikeIcon from '../../logo/beforelike_logo.png';
import LikedIcon from '../../logo/liked_logo.png';
import Header from './Header';
import '../css/PostDetail.css';
import { formatDate } from '../../redux/actions/postActions';
import CommentDetail from './CommentDetail';

const PostDetail = () => {
  const { id } = useParams();
  const postId = parseInt(id, 10);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const post = posts.find((post) => post.id === postId);

  const [isEditing, setIsEditing] = useState(false);
  const [isMyBoard, setIsMyBoard] = useState(false);
  const [category, setCategory] = useState('');
  const [name , setName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [Date, setDate] = useState('');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const cookies = new Cookies();
  const jwtToken = cookies.get('Authorization');

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/board/${id}`);
      const data = response.data;
      
      setName(data.name);
      setTitle(data.title);
      setContent(data.content);
      setComments(data.comments);
      setDate(data.createdDate);
      setLikes(data.likes);
      setCategory(data.category);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchisMyBoard = async () => {
      const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;  

      try{
        const response = await axios.get(`http://localhost:8080/board/${id}/isMyBoard`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': bearerToken,
          },
        });
        console.log("본인 게시글임")
        setIsMyBoard(true);
      }catch(error){
        
        setIsMyBoard(false);
      }
  }
  
  const fetchisMyLike = async () => {
    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;  

    try{
      const response = await axios.get(`http://localhost:8080/BoardLike/${id}/isMyLike`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });
      const isMyLike = response.data; // 서버에서 true 또는 false 값을 받아옴
    
      if (isMyLike === true) {
       
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }catch(error){
      
      setIsLiked(false);
    }
  }



  useEffect(() => {
    fetchPost();
    
    if(jwtToken){
      fetchisMyBoard();
      fetchisMyLike();
    }
  }, [jwtToken]);

  const handleUpdate = async (e) => {
    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

    if(window.confirm("정말 수정하시겠습니까?")){
      const data = {
        'title' : title,
        'content' : content
      };
      await axios.put(`http://localhost:8080/board/update/${id}`,data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });
      window.location.reload();
    
    }
  };

  const handleDelete =async () => {
    if(window.confirm("정말 삭제하시겠습니까?")){
      const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

      await axios.delete(`http://localhost:8080/board/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });
      window.location.replace(`http://localhost:3000/community/${category}`);
    
    }
  };

  const handleAddComment = async() => {
    const addcomment = {  
      'content': newComment
    };
    
    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

    try {
      const response = await axios.post(`http://localhost:8080/comment/${id}/save`, addcomment, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });
      
      window.location.reload();
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  const handleDeleteComment = (commentIndex) => {
    const updatedComments = comments.filter((_, index) => index !== commentIndex);
    setComments(updatedComments);
    dispatch(updatePost(post.id, { ...post, comments: updatedComments }));
  };

  const handleToggleLike = async() => {
    if(jwtToken==undefined){
      alert("로그인 하시길 바랍니다");
      return;
    }

    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;
    try {
      const response = await axios.post(`http://localhost:8080/BoardLike/SaveDelete/${id}`, {},{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      }); 
      const newLikes = isLiked ? likes - 1 : likes + 1;
      setLikes(newLikes);
      setIsLiked(!isLiked);
      
    } catch (error) {
      console.error("Error saving 좋아요", error);
    }
  };

  // if (!post) {
  //   return <div>게시물을 찾을 수 없습니다.</div>;
  // }

  return (
    <div className='post-detail'>
      {/* <Header /> */}
      <article className='article'>
        <div className="article-top">
          <div className="article-header">
            <h1 title='제목'>{title}</h1>
            <div className='category'>{category}</div>
          </div>
          <div className="post-meta">
            <span>{name}</span>
            <span>{formatDate(Date)}</span>
            <span>좋아요 수: {likes}</span>
            <button onClick={handleToggleLike} className={`like-button ${isLiked ? 'liked' : ''}`}>
              <img src={isLiked ? LikedIcon : BeforeLikeIcon} alt="like button" />
            </button>
          </div>
        </div>
        {isEditing ? (
          <form onSubmit={handleUpdate} className="post-detail-form">
            <div className="form-group">
              <label htmlFor="title">제목</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">내용</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
            <div className='editting-contents'>
              <button type="submit" className="submit-button">수정 완료</button>
            </div>
          </form>
        ) : (
          <div className="post-content">
            {content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
            {isMyBoard?
              (<div className="button-container">
                <button onClick={() => setIsEditing(true)} className="edit-button">수정</button>
                <button onClick={handleDelete} className="delete-button">삭제</button>
              </div>):(
                <div></div>
              )
            }
          </div>
        )}
      </article>
      <div className='reply'>
        <div className="reply-form-container">
          <div className="reply-count">
            <h2>댓글 {comments.length}개</h2>
            
          </div>
        </div>
        <div className='reply-content'>
          <ul className="comments_info">
            {comments.map((comment, index) => (
              <CommentDetail
              id={comment.id}
              author={comment.author}
              content={comment.content}
              date={comment.createdDate}
            />
            ))}
          </ul>
          <div className="reply-form">
            <textarea
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            {isLoggedIn?
            (<button onClick={handleAddComment} className="reply-submit-button">등록</button>):(<></>)}
          </div>
            
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
