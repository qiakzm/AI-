import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';
import ScoreChart from './ScoreChart';
import '../css/ScoreQuery.css';

const ScoreQuery = () => {
    const location = useLocation();
    const [criteria, setCriteria] = useState('rawScore'); // 기본 기준은 원점수
    const [year, setYear] = useState('2025학년도');
    const [subject, setSubject] = useState('전체');

    // 임시 데이터
    const scores = [
        { year: '2025학년도', month: '3월', subject: '국어', media: '언어와 매체', options: '선택안함', rawScore: 86, standardScore: 133, grade: 1 },
        { year: '2025학년도', month: '3월', subject: '영어', media: '선택안함', options: '선택안함', rawScore: 90, standardScore: 95, grade: 1 },
        { year: '2025학년도', month: '5월', subject: '국어', media: '언어와 매체', options: '선택안함', rawScore: 89, standardScore: 124, grade: 2 },
        { year: '2025학년도', month: '5월', subject: '영어', media: '선택안함', options: '선택안함', rawScore: 85, standardScore: 93, grade: 2 },
        { year: '2025학년도', month: '6월', subject: '국어', media: '화법과 작문', options: '선택안함', rawScore: 88, standardScore: 133, grade: 1 },
        { year: '2025학년도', month: '6월', subject: '영어', media: '선택안함', options: '선택안함', rawScore: 82, standardScore: 93, grade: 2 },
        { year: '2024학년도', month: '3월', subject: '국어', media: '선택안함', options: '선택안함', rawScore: 80, standardScore: 129, grade: 2 },
        { year: '2024학년도', month: '3월', subject: '영어', media: '선택안함', options: '선택안함', rawScore: 75, standardScore: 80, grade: 3 },
        { year: '2024학년도', month: '6월', subject: '국어', media: '선택안함', options: '선택안함', rawScore: 88, standardScore: 134, grade: 1 },
        { year: '2024학년도', month: '6월', subject: '영어', media: '선택안함', options: '선택안함', rawScore: 72, standardScore: 80, grade: 3 },
        { year: '2024학년도', month: '9월', subject: '국어', media: '선택안함', options: '선택안함', rawScore: 78, standardScore: 129, grade: 2 },
        { year: '2024학년도', month: '9월', subject: '영어', media: '선택안함', options: '선택안함', rawScore: 80, standardScore: 80, grade: 2 },
        { year: '2023학년도', month: '3월', subject: '국어', media: '선택안함', options: '선택안함', rawScore: 68, standardScore: 125, grade: 2 },
        { year: '2023학년도', month: '3월', subject: '영어', media: '선택안함', options: '선택안함', rawScore: 75, standardScore: 80, grade: 3 },
        { year: '2023학년도', month: '6월', subject: '국어', media: '선택안함', options: '선택안함', rawScore: 74, standardScore: 118, grade: 3 },
        { year: '2023학년도', month: '6월', subject: '영어', media: '선택안함', options: '선택안함', rawScore: 90, standardScore: 80, grade: 1 },
        { year: '2023학년도', month: '9월', subject: '국어', media: '선택안함', options: '선택안함', rawScore: 78, standardScore: 129, grade: 2 },
        { year: '2023학년도', month: '9월', subject: '영어', media: '선택안함', options: '선택안함', rawScore: 88, standardScore: 80, grade: 2 },
    ];

    const handleCriteriaChange = (event) => {
        setCriteria(event.target.value);
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
    };

    const filteredScores = scores.filter(score => 
        (year === '전체' || score.year === year) && 
        (subject === '전체' || score.subject === subject)
    );

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
                    <h2>성적 조회</h2>
                    <div className="filters">
                        <div className="criteria-select">
                            <label htmlFor="criteria">기준 선택: </label>
                            <select id="criteria" value={criteria} onChange={handleCriteriaChange}>
                                <option value="rawScore">원점수</option>
                                <option value="standardScore">표준점수</option>
                            </select>
                        </div>
                        <div className="year-select">
                            <label htmlFor="year">년도 선택: </label>
                            <select id="year" value={year} onChange={handleYearChange}>
                                <option value="전체">전체</option>
                                <option value="2025학년도">2025학년도</option>
                                <option value="2024학년도">2024학년도</option>
                                <option value="2023학년도">2023학년도</option>
                                <option value="2022학년도">2022학년도</option>
                                <option value="2021학년도">2021학년도</option>
                            </select>
                        </div>
                        <div className="subject-select">
                            <label htmlFor="subject">과목 선택: </label>
                            <select id="subject" value={subject} onChange={handleSubjectChange}>
                                <option value="전체">전체</option>
                                <option value="국어">국어</option>
                                <option value="영어">영어</option>
                            </select>
                        </div>
                    </div>
                    <ScoreChart scores={filteredScores} criteria={criteria} />
                </div>
            </div>
        </div>
    );
};

export default ScoreQuery;
