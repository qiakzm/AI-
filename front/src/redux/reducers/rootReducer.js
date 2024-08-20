import { combineReducers } from 'redux';
import authReducer from './authReducer';
import postReducer from './postReducer';
import todayProblemReducer from './todayProblemReducer';
import userReducer from './userReducer'; 

const rootReducer = combineReducers({
  auth: authReducer,
  posts: postReducer,
  todayProblem: todayProblemReducer,
  user: userReducer, 
});

export default rootReducer;
