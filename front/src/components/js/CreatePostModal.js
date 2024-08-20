import React, { useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import '../css/CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose, addPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('empty');

  const cookies = new Cookies();
  const jwtToken = cookies.get('Authorization');

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if(category=="empty"){
      alert("게시판을 선택해주세요");
      return;
    }

    e.preventDefault();
    const newPost = {  
      title,
      content,
      category
    };

    const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;  

    try {
      const response = await axios.post('http://localhost:8080/board/save', newPost, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken,
        },
      });
      const id = response.data.id;
      window.location.replace(`http://localhost:3000/post/${id}`);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-post-overlay">
      <div className="modal-post-content">
      <button className="close-button" onClick={onClose}>×</button>
        <h1>게시물 작성</h1>
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title"> 제목 </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">게시판 선택</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="empty">선택</option>
              <option value="freeboard">자유게시판</option>
              <option value="Challenge">도전! 목표 대학/학과</option>
              <option value="study">스터디그룹 모집</option>
            </select>
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
          <button type="submit" className="submit-button">등록</button>
        </form>

        <article className='write-guide' title='게시판 작성 유의사항'>
          <ul>
            <li> - 스터디 그룹 이용 시 안전한 이용을 위해 마이페이지에서 학교 인증이 필요합니다. </li>
            <li> - 게시판에 개인정보(휴대폰 번호, 메일 등)를 입력하시면 외부 노출의 위험이 있으므로 작성하지 말아주세요.<br></br>
                   개인정보 작성 시 안내 없이 삭제 또는 수정될 수 있습니다. </li>
          </ul>
        </article>
      </div>
    </div>
  );
};

export default CreatePostModal;
