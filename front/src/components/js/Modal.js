import React, { useState } from 'react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import '../css/Modal.css'; // 모달 스타일을 위한 CSS 파일

const Modal = ({ isOpen, onClose, correctAnswers, incorrectAnswers,year,month,subject,type }) => {
    const [analysisResult, setAnalysisResult] = useState(null);

    const cookies = new Cookies();
    const jwtToken = cookies.get('Authorization');

    if (!isOpen) return null;

    const handleAnalyze = async () => {
        const bearerToken = jwtToken.startsWith('Bearer ') ? jwtToken : `Bearer ${jwtToken}`;

        try {
            const response = await axios.post('http://localhost:5000/analyze', {
                correctAnswers,
                incorrectAnswers
            });
            setAnalysisResult(response.data.analysis);
            
            const yearInt = parseInt(year, 10);
            const monthInt = parseInt(month, 10);

            await axios.post('http://localhost:8080/analyze/save', {
                year: yearInt,
                month: monthInt,
                subject,
                type,
                analyze: response.data.analysis
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearerToken,
                },
            });

        } catch (error) {
            console.error('Error analyzing answers:', error);
        }
    };

    const handleClose = () => {
        setAnalysisResult(null);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>채점 결과</h2>
                <div className="result-container">
                    <div className="correct-answers">
                        <h3>맞은 문제: {correctAnswers.length}개</h3>
                        <ul className="answers-list">
                            {correctAnswers.map(question => (
                                <li key={question}>문제 {question}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="incorrect-answers">
                        <h3>틀린 문제: {incorrectAnswers.length}개</h3>
                        <ul className="answers-list">
                            {incorrectAnswers.map(question => (
                                <li key={question}>문제 {question}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                    <button className="analyze" onClick={handleAnalyze}>분석받기</button>
                    <button className="close_btn" onClick={handleClose}>닫기</button>
                {analysisResult && (
                    <div className="analysis-result">
                        <h3>분석 결과</h3>
                        <p>{analysisResult}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
