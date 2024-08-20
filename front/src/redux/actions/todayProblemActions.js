import axios from 'axios';

export const FETCH_PROBLEM_REQUEST = 'FETCH_PROBLEM_REQUEST';
export const FETCH_PROBLEM_SUCCESS = 'FETCH_PROBLEM_SUCCESS';
export const FETCH_PROBLEM_FAILURE = 'FETCH_PROBLEM_FAILURE';
export const SUBMIT_ANSWER_REQUEST = 'SUBMIT_ANSWER_REQUEST';
export const SUBMIT_ANSWER_SUCCESS = 'SUBMIT_ANSWER_SUCCESS';
export const SUBMIT_ANSWER_FAILURE = 'SUBMIT_ANSWER_FAILURE';
export const SET_USER_ANSWER = 'SET_USER_ANSWER';
export const SET_ERROR = 'SET_ERROR';
export const SET_FEEDBACK = 'SET_FEEDBACK';

export const fetchProblemRequest = () => ({ type: FETCH_PROBLEM_REQUEST });
export const fetchProblemSuccess = (problem) => ({ type: FETCH_PROBLEM_SUCCESS, payload: problem });
export const fetchProblemFailure = (error) => ({ type: FETCH_PROBLEM_FAILURE, payload: error });

export const submitAnswerRequest = () => ({ type: SUBMIT_ANSWER_REQUEST });
export const submitAnswerSuccess = (isCorrect) => ({ type: SUBMIT_ANSWER_SUCCESS, payload: isCorrect });
export const submitAnswerFailure = (error) => ({ type: SUBMIT_ANSWER_FAILURE, payload: error });

export const setUserAnswer = (answer) => ({ type: SET_USER_ANSWER, payload: answer });
export const setError = (error) => ({ type: SET_ERROR, payload: error });
export const setFeedback = (feedback) => ({ type: SET_FEEDBACK, payload: feedback });

export const fetchProblem = (subject) => {
  return async (dispatch) => {
    dispatch(fetchProblemRequest());
    try {
      const response = await axios.get(`http://localhost:8080/api/subjects/random/${subject}`);
      const { q_sub, passage, question, selection } = response.data;
      const problem = { q_sub, passage, question, selection: parseSelections(selection) };
      dispatch(fetchProblemSuccess(problem));
    } catch (error) {
      dispatch(fetchProblemFailure('지문을 불러오는 중 오류가 발생했습니다.'));
    }
  };
};

export const submitAnswer = (qSub, userAnswer) => {
  return async (dispatch) => {
    dispatch(submitAnswerRequest());
    try {
      const response = await axios.post('http://localhost:8080/api/subjects/check', { q_sub: qSub, userAnswer: userAnswer + 1 });
      const isCorrect = response.data;
      dispatch(submitAnswerSuccess(isCorrect));
      return isCorrect; // 정답 여부 반환
    } catch (error) {
      dispatch(submitAnswerFailure('정답을 확인하는 중 오류가 발생했습니다.'));
      throw error;
    }
  };
};

export const fetchFeedback = (timeTaken) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('http://localhost:5000/analyze_time', { time_taken: timeTaken });
      const feedback = response.data.feedback;
      dispatch(setFeedback(feedback));
    } catch (error) {
      dispatch(setError('피드백을 받아오는 중 오류가 발생했습니다.'));
    }
  };
};

const parseSelections = (selectionText) => {
  const regex = /①|②|③|④|⑤/;
  return selectionText.split(regex).filter(s => s.trim() !== "").map((s, index) => {
    return `${String.fromCharCode(9312 + index)} ${s.trim()}`;
  });
};
