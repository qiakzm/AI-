import React from 'react';
import PropTypes from 'prop-types';
import '../css/SubjectSelectPopup.css'; // 팝업에 대한 CSS 파일 추가

const SubjectSelectPopup = ({ onSelect }) => {
  return (
    <div className="subject-popup-overlay">
      <div className="subject-select-popup">
        <h2>과목을 선택하세요</h2>
        <button onClick={() => onSelect('국어')}>국어 문제 풀기</button>
        <button onClick={() => onSelect('영어')}>영어 문제 풀기</button>
        <button onClick={() => onSelect('닫기')}>닫기</button>
      </div>
    </div>
  );
};

SubjectSelectPopup.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default SubjectSelectPopup;
