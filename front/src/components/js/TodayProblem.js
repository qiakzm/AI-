import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProblem, setUserAnswer, submitAnswer, setError, fetchFeedback } from '../../redux/actions/todayProblemActions';
import { useLocation } from 'react-router-dom';
import '../css/TodayProblem.css';
import Chatbot from './Chatbot';
import axios from 'axios';

import timerIcon from '../../logo/timer.png';

const TodayProblem = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subjectName = queryParams.get('subject');

  const { problem, userAnswer, result, error, feedback, isLoading } = useSelector((state) => state.todayProblem);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    if (subjectName) {
      dispatch(fetchProblem(subjectName));
      const now = Date.now();
      setStartTime(now);
      setCurrentTime(now); // 문제를 가져올 때 시작 시간을 기록합니다.
    }
  }, [dispatch, subjectName]);

  useEffect(() => {
    if (startTime && !endTime) {
      const timer = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, endTime]);

  const handleChoiceClick = (index) => {
    dispatch(setUserAnswer(index));
  };

  const handleSubmitAnswer = async () => {
    if (userAnswer === null) {
      dispatch(setError('답안을 선택해주세요.'));
      return;
    }

    try {
      const isCorrect = await dispatch(submitAnswer(problem.q_sub, userAnswer));
      if (isCorrect) {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        setEndTime(endTime);

        // 정답일 경우에만 피드백 요청
        await axios.post('http://localhost:5000/api/times/record', {
          userId: 'example_user',
          questionId: problem.id,
          timeTaken
        });

        // GPT에게 문제 풀이 시간 기반 피드백 요청
        dispatch(fetchFeedback(timeTaken));
      } else {
        // 오답일 경우에도 에러 메시지를 설정하여 사용자에게 알려줌
        // dispatch(setError('오답입니다. 다시 시도해 주세요.'));
      }
    } catch (error) {
      console.error('Error recording time or analyzing:', error);
      dispatch(setError('피드백을 받아오는 중 오류가 발생했습니다.'));
    }
  };

  const renderPassage = () => {
    return problem.passage.split('\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds}초`;
  };

  const renderTimeTaken = () => {
    if (!startTime) return null;
    const elapsed = Math.floor((currentTime - startTime) / 1000); // 밀리초를 초로 변환
    return (
      <div className="time-taken">
        <img src={timerIcon} alt="타이머 아이콘" className="timer_img" />
        <strong>풀이 시간: </strong> {formatTime(elapsed)}
      </div>
    );
  };

  return (
    <div>
      <div className="today-problem">
        <h1>오늘의 문제</h1>
        <div className="content">
          {isLoading && <div className="loading">로딩 중...</div>}
          <div className="passage-container">
            {problem && <div className="passage">{renderPassage()}</div>}
          </div>
          <div className="qa-container">
            {problem && <p>{problem.question}</p>}
            <div className="choices">
              {problem &&
                problem.selection.map((choice, index) => (
                  <div
                    key={index}
                    className={`choice-label ${userAnswer === index ? 'selected' : ''} ${
                      result === '오답입니다.' && userAnswer === index ? 'incorrect' : ''
                    }`}
                    onClick={() => handleChoiceClick(index)}
                  >
                    {choice}
                  </div>
                ))}
            </div>
            <button className="submit-button" onClick={handleSubmitAnswer} disabled={isLoading}>제출</button>
            {renderTimeTaken()} {/* 풀이 시간을 제출 버튼 바로 밑으로 이동 */}
            {feedback && <div className="feedback"><strong>Quizzy's 피드백:</strong> {feedback}</div>}
          </div>
        </div>
        {result && <div className={`result ${result === '정답입니다!' ? 'correct' : 'incorrect'}`}>{result}</div>}
        {error && <div className="error"><strong>오류:</strong> {error}</div>}
        
        <button className="new-question-button" onClick={() => {
          const now = Date.now();
          setStartTime(now); // 새로운 문제를 풀 때 시작 시간을 기록합니다.
          setCurrentTime(now); // 현재 시간 초기화
          setEndTime(null); // 새로운 문제를 풀 때 종료 시간 초기화
          dispatch(fetchProblem(subjectName));
        }} disabled={isLoading}>다른문제풀어보기</button>
        <Chatbot passage={problem ? problem.passage : ''} question={problem ? problem.question : ''} />
      </div>
    </div>
  );
};

export default TodayProblem;
