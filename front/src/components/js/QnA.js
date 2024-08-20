import React, { useState } from 'react';
import searchIcon from '../../logo/search_logo.png'; // 검색 아이콘 이미지 경로
import questionlogo from '../../logo/question_logo.png' 
import '../css/QnA.css';
import Header from './Header';


const QnA = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [bookmarked, setBookmarked] = useState([]);

    const questions = [
        {
            question: 'ZIPPER가 뭔가요?',
            answer: '수강자들에게 AI chatbot 서비스를 통해 맞춤형 학습을 제공합니다.'
        },
        {
            question: '이용가능한 서비스는 어떤 것이 있나요?',
            answer: 'AI 챗봇 기능, 오늘의 문제 추천, 학습자 개인 맞춤 대시보드 등이 있습니다.',
        },
        {
            question: '서비스 이용 범위는 어떻게 되나요?',
            answer: '현재는 수능 학습 용도로 개발되었습니다. 추후 다양한 데이터 추가를 통해 수능 이외 다양한 학습 범위에서 사용 가능할 것으로 예상됩니다.',
        },
        {
            question: '서비스 이용 문의는 어디로 해야하나요?',
            answer: '이 서비스는 AIVLE SCHOOL 프로젝트 일환으로 제작되었습니다. 해당 프로젝트 개발팀에게 문의하세요.'
        }
    ];

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const toggleBookmark = (index) => {
        setBookmarked(bookmarked.includes(index)
            ? bookmarked.filter(i => i !== index)
            : [...bookmarked, index]);
    };

    const filteredQuestions = questions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
           {/* <Header /> */}
            <div className='content-area'>
                <div className='title'>
                    <h1>FAQ</h1>
                    <img src={questionlogo} alt='물음표' className='design' />
                </div>
                <div className='search-box'>
                    <input id='question' type='text' placeholder='도움말을 검색해 보세요' value={searchQuery} onChange={handleSearch} />
                    <button className='search_button'>
                        <img src={searchIcon} alt='검색' title='질문 검색' />
                    </button>
                </div>
                <div className='faq'>
                    {filteredQuestions.map((item, index) => (
                        <div key={index} className='faq-item'>
                            <div className='faq-question' onClick={() => toggleAnswer(index)}>
                                <p>Q. {item.question}</p>
                                <button onClick={() => toggleBookmark(index)} className='bookmark-button'>
                                    {bookmarked.includes(index) ? '★' : '☆'}
                                </button>
                            </div>
                            {activeIndex === index && (
                                <div className='faq-answer'>
                                    <p> {item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {bookmarked.length > 0 && (
                    <div className='bookmarked'>
                        <h2>즐겨찾기</h2>
                        {bookmarked.map(index => (
                            <div key={index} className='faq-item'>
                                <div className='faq-question' onClick={() => toggleAnswer(index)}>
                                    <p>Q. {questions[index].question}</p>
                                </div>
                                {activeIndex === index && (
                                    <div className='faq-answer'>
                                        <p> {questions[index].answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default QnA;