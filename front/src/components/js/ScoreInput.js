import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Modal from './Modal';
import '../css/ScoreInput.css';

const ScoreInput = () => {
    const location = useLocation();
    const [year, setYear] = useState('2025학년도');
    const [month, setMonth] = useState('6월');
    const [subject, setSubject] = useState('국어');
    const [media, setMedia] = useState('언어와 매체');
    const [options, setOptions] = useState('홀수형');
    const [scoreInputType, setScoreInputType] = useState('점수로 입력하기');
    const [rawScore, setRawScore] = useState('');
    const [standardScore, setStandardScore] = useState('');
    const [grade, setGrade] = useState('');
    const [omrAnswers, setOmrAnswers] = useState(
        Array(45).fill(Array(5).fill(false)) // 총 45문제, 각 문제에 대한 5개의 선택지
    );

    const [quizData, setQuizData] = useState(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // JSON 파일을 불러오기
        fetch("/omr_answer_korean.json")
            .then(response => response.json())
            .then(data => setQuizData(data))
            .catch(error => console.error('Error fetching quiz data:', error));
    }, []);

    const handleScoreInputTypeChange = (e) => {
        setScoreInputType(e.target.value);
    };

    const handleOmrClick = (row, col) => {
        const newOmrAnswers = omrAnswers.map((rowAnswers, rowIndex) =>
            rowIndex === row
                ? rowAnswers.map((cell, colIndex) => (colIndex === col ? !cell : cell))
                : rowAnswers
        );
        setOmrAnswers(newOmrAnswers);
    };

    const handleSubmit = () => {
        const selectedAnswers = omrAnswers.map((rowAnswers, rowIndex) => {
            const selectedOption = rowAnswers.findIndex(answer => answer === true);
            return { question: rowIndex + 1, answer: selectedOption + 1 }; // 선택지 인덱스는 0부터 시작하므로 +1
        });

        // 선택한 년도와 월, 과목, 매체, 형식에 맞는 데이터 필터링
        const filteredQuiz = quizData.find(q => 
            q.year === parseInt(year) &&
            q.month === parseInt(month) &&
            q.subject === subject &&
            q.type === media &&
            q.odd_or_even === options
        );
        
        console.log(filteredQuiz);
        
        console.log('Selected OMR Answers:', selectedAnswers);
        // 성적 입력 처리 로직

        if (filteredQuiz) {
            // 정답을 추출
            const correctAnswers = Object.keys(filteredQuiz)
                .filter(key => key.startsWith("answer_"))
                .map(key => filteredQuiz[key]);
    
            // 선택한 답과 정답을 비교하여 맞은 문제와 틀린 문제를 찾기
            const correctQuestions = selectedAnswers.filter(sa => {
                const correctAnswer = correctAnswers[sa.question - 1];
                return correctAnswer === sa.answer.toString();
            }).map(sa => sa.question);

            const incorrectQuestions = selectedAnswers.filter(sa => {
                const correctAnswer = correctAnswers[sa.question - 1];
                return correctAnswer !== sa.answer.toString();
            }).map(sa => sa.question);

            setCorrectCount(correctQuestions.length);
            setIncorrectCount(incorrectQuestions.length);
            setCorrectAnswers(correctQuestions);
            setIncorrectAnswers(incorrectQuestions);
            setIsModalOpen(true);
        } else {
            alert('해당하는 시험 데이터를 찾을 수 없습니다.');
        }
    };

    // 10문제씩 나누어서 배열 생성
    const groupedOmrAnswers = [];
    for (let i = 0; i < omrAnswers.length; i += 10) {
        groupedOmrAnswers.push(omrAnswers.slice(i, i + 10));
    }

    return (
        <div className="score-container">
            {/* <Header /> */}
            <div className="content">
                <div className="sidebar">
                    <h2>나의 성적 그래프</h2>
                    <ul>
                        <li>
                            <Link to="/score-query" className={location.pathname === '/score-query' ? 'active' : ''}>
                                • 성적 조회
                            </Link>
                        </li>
                        <li>
                            <Link to="/score-input" className={location.pathname === '/score-input' ? 'active' : ''}>
                                • 성적 입력
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="main-content">
                    <div className="radio-header">
                        <select value={year} onChange={(e) => setYear(e.target.value)}>
                            <option>2025학년도</option>
                            <option>2024학년도</option>
                            <option>2023학년도</option>
                            <option>2022학년도</option>
                            <option>2021학년도</option>
                        </select>
                        <select value={month} onChange={(e) => setMonth(e.target.value)}>
                            <option>3월</option>
                            <option>5월</option>
                            <option>6월</option>
                            <option>7월</option>
                            <option>9월</option>
                            <option>10월</option>
                            <option>수능</option>
                        </select>
                        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                            <option>국어</option>
                            <option>영어</option>
                        </select>
                        <select value={media} onChange={(e) => setMedia(e.target.value)}>
                            <option>선택안함</option>
                            <option>언어와 매체</option>
                            <option>화법과 작문</option>
                        </select>
                        <select value={options} onChange={(e) => setOptions(e.target.value)}>
                            <option>홀수형</option>
                            <option>짝수형</option>
                        </select>
                    </div>

                    <div className="selection">
                        <div className="radio-buttons">
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    value="점수로 입력하기"
                                    checked={scoreInputType === '점수로 입력하기'}
                                    onChange={handleScoreInputTypeChange}
                                />
                                점수로 입력하기
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    value="OMR로 입력하기"
                                    checked={scoreInputType === 'OMR로 입력하기'}
                                    onChange={handleScoreInputTypeChange}
                                />
                                OMR로 입력하기
                            </label>
                        </div>
                        {scoreInputType === '점수로 입력하기' ? (
                            <div className="input-fields">
                                <label>원점수</label>
                                <input
                                    type="text"
                                    value={rawScore}
                                    onChange={(e) => setRawScore(e.target.value)}
                                />
                                <label>표준점수</label>
                                <input
                                    type="text"
                                    value={standardScore}
                                    onChange={(e) => setStandardScore(e.target.value)}
                                />
                                <label>등급</label>
                                <input
                                    type="text"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className="omr-section">
                                {groupedOmrAnswers.map((group, groupIndex) => (
                                    <div className="omr-column" key={groupIndex}>
                                        {group.map((row, rowIndex) => (
                                            <div className="omr-row" key={rowIndex}>
                                                <div className="omr-question-number">{groupIndex * 10 + rowIndex + 1}</div>
                                                {row.map((cell, colIndex) => (
                                                    <div
                                                        key={colIndex}
                                                        className={`omr-cell ${cell ? 'selected' : ''}`}
                                                        onClick={() => handleOmrClick(groupIndex * 10 + rowIndex, colIndex)}
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="submit-button-container">
                        <button className="submit-button" onClick={handleSubmit}>
                            성적 입력
                        </button>
                    </div>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        correctAnswers={correctAnswers}
                        incorrectAnswers={incorrectAnswers}
                        year = {year}
                        month = {month}
                        subject = {subject}
                        type = {media}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScoreInput;
