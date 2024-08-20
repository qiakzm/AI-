export const ADD_POST = 'ADD_POST';
export const UPDATE_POST = 'UPDATE_POST';
export const DELETE_POST = 'DELETE_POST';
export const LOAD_POSTS = 'LOAD_POSTS';
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';

export const addPost = (post) => ({
  type: ADD_POST,
  payload: post,
});

export const updatePost = (id, updatedPost) => ({
  type: UPDATE_POST,
  payload: { id, updatedPost },
});

export const deletePost = (id) => ({
  type: DELETE_POST,
  payload: id,
});

export const loadPosts = (posts) => ({
  type: LOAD_POSTS,
  payload: posts,
});

export const fetchPosts = () => {
  return async (dispatch) => {
    // api 자리
    const posts = [
      { id: 1, title: '첫 번째 게시물', content: '내용1', category: '자유게시판', author: '작성자1', likes: 0, date: '2024-07-10' },
      { id: 2, title: '두 번째 게시물', content: '내용2', category: '스터디모집', author: '작성자2', likes: 0, date: '2024-07-11' },
    ];

    dispatch({
      type: FETCH_POSTS_SUCCESS,
      payload: posts,
    });
  };
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffInMilliseconds = now - date;
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

export const commentDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};