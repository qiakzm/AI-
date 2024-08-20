import {
  FETCH_PROBLEM_REQUEST,
  FETCH_PROBLEM_SUCCESS,
  FETCH_PROBLEM_FAILURE,
  SUBMIT_ANSWER_REQUEST,
  SUBMIT_ANSWER_SUCCESS,
  SUBMIT_ANSWER_FAILURE,
  SET_USER_ANSWER,
  SET_ERROR,
  SET_FEEDBACK // 새로 추가된 액션 타입
} from '../actions/todayProblemActions';

const initialState = {
  isLoading: false,
  problem: null,
  userAnswer: null,
  result: '',
  error: '',
  feedback: '' // 초기 상태에 feedback 추가
};

const todayProblemReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROBLEM_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: '',
        feedback: '' // 새로운 문제를 불러올 때 피드백 초기화
      };
    case FETCH_PROBLEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        problem: action.payload,
        userAnswer: null,
        result: '',
        error: '',
        feedback: '' // 새로운 문제를 불러올 때 피드백 초기화
      };
    case FETCH_PROBLEM_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case SUBMIT_ANSWER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: ''
      };
    case SUBMIT_ANSWER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        result: action.payload ? '정답입니다!' : '오답입니다.',
        error: ''
      };
    case SUBMIT_ANSWER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case SET_USER_ANSWER:
      return {
        ...state,
        userAnswer: action.payload,
        result: '',
        error: ''
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case SET_FEEDBACK: // 피드백 상태 업데이트
      return {
        ...state,
        feedback: action.payload
      };
    default:
      return state;
  }
};

export default todayProblemReducer;
