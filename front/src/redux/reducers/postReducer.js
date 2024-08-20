import { ADD_POST, UPDATE_POST, DELETE_POST, LOAD_POSTS } from '../actions/postActions';

const initialState = {
  posts: [],
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_POSTS:
      return {
        ...state,
        posts: action.payload,
      };
    case ADD_POST:
      const addedPosts = [...state.posts, action.payload];
      localStorage.setItem('posts', JSON.stringify(addedPosts));
      return {
        ...state,
        posts: addedPosts,
      };
    case UPDATE_POST:
      const updatedPosts = state.posts.map((post) =>
        post.id === action.payload.id ? action.payload.updatedPost : post
      );
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      return {
        ...state,
        posts: updatedPosts,
      };
    case DELETE_POST:
      const filteredPosts = state.posts.filter((post) => post.id !== action.payload);
      localStorage.setItem('posts', JSON.stringify(filteredPosts));
      return {
        ...state,
        posts: filteredPosts,
      };
    default:
      return state;
  }
};

export default postReducer;
