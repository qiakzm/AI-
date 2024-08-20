import React, { useState, useEffect } from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { addPost, updatePost, deletePost } from '../../redux/actions/postActions';
import searchIcon from '../../logo/search_logo.png';
import Header from './Header';
import CreatePostModal from './CreatePostModal';
import { formatDate } from '../../redux/actions/postActions';
import '../css/Community.css';

const Communitypopular = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const category = 'popular';

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(category || '전체');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postList, setPostList] = useState(posts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 5;
  const [categoryname, setCategoryname] = useState('인기게시판');
  const [optionname,setoptionname] = useState('인기게시판')

  
  

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/board/popular?page=${page}&size=${postsPerPage}`);
      console.log(response);
      setPostList(response.data.boards);
      setFilteredPosts(response.data.boards);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, [page]);



  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === 'freeboard') {
      
      setoptionname('자유게시판')
    } else if (option === 'Challenge') {
      
      setoptionname('도전! 목표 대학/학과')
    } else if(option=='study') {
      
      setoptionname('스터디그룹')
    }else{
      
      setoptionname('인기게시판')
    }
    setIsDropdownOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigateToPostDetail = (id) => {
    navigate(`/post/${id}`, { state: { category } });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };



  const handleSearch = () => {
    
    if(searchTerm!=''){
      window.location.replace(`http://localhost:3000/community/${category}/Search?keyword=${searchTerm}`);
    }
  };

  const activeEnter = (e) => {
    if(e.key === "Enter") {
      handleSearch();
    }
  }

  const handleFilterButtonClick = (category) => {
    window.location.replace(`http://localhost:3000/community/${category}`);
  };


  const sortByLikes = () => {
    window.location.href=`http://localhost:3000/community/${category}/best`;
  };

  const sortByDate = () => {
    const sortedPosts = [...filteredPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredPosts(sortedPosts);
  };

  return (
    <div>
      {/* <Header /> */}
      <div>
        <div className='search_bar'>
          <div className='dropdown'>
            <button onClick={toggleDropdown} className='dropdown_toggle'>
              {optionname} <span className="arrow">&#9660;</span>
            </button>
            {isDropdownOpen && (
              <ul className='dropdown_menu'>
                <li onClick={() => handleOptionClick('popular')}>인기게시판</li>
                <li onClick={() => handleOptionClick('freeboard')}>자유게시판</li>
                <li onClick={() => handleOptionClick('Challenge')}>도전! 목표 대학/학과</li>
                <li onClick={() => handleOptionClick('study')}>스터디그룹</li>
              </ul>
            )}
          </div>
          <input type='text' id='search' name='search' value={searchTerm} onChange={handleSearchChange}  onKeyDown={(e) => activeEnter(e)} placeholder='두 글자 이상 입력해 주세요' />
          <button className='search_button' onClick={handleSearch}>
            <img src={searchIcon} alt="검색" className='search_img' />
          </button>
        </div>
        <div className='buttons'>
          <button onClick={() => handleFilterButtonClick('popular')}>인기 게시판</button>
          <button onClick={() => handleFilterButtonClick('freeboard')}>자유 게시판</button>
        <button onClick={() => handleFilterButtonClick('challenge')}>도전! 목표 대학/학과</button>
        <button onClick={() => handleFilterButtonClick('study')}>스터디 그룹</button>
        </div>
        <div className='posts-info'>
          <span className='postNum'>게시글 {filteredPosts.length}건</span>
          {isLoggedIn?(<button className='create-post' onClick={openModal}>게시물 작성</button>):(
            <></>
          )}

          <div className='post-button'>
            

          </div>
        </div>
        <div className='community-table-container'>
          <table className='community-table'>
            <thead>
              <tr>
                <th>번호</th>
                <th>분류</th>
                <th>제목</th>
                <th>작성자</th>
                <th>좋아요</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <tr key={post.id} onClick={() => navigateToPostDetail(post.id)}>
                    <td>{index + 1}</td>
                    <td>{categoryname}</td>
                    <td className="post-title">{post.title}</td>
                    <td>{post.author}</td>
                    <td>{post.likes}</td>
                    <td>{formatDate(post.createdDate)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">게시글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={closeModal}
          addPost={(newPost) => {
            dispatch(addPost(newPost));
            setIsModalOpen(false);
          }}>
        </CreatePostModal>
      </div>
    </div>
  );
};

export default Communitypopular;
