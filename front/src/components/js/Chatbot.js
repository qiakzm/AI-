import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Chatbot.css'; // 챗봇에 대한 CSS 파일 추가

// 아이콘 경로 지정
import botIcon from '../../logo/bot_icon.png';
import closeIcon from '../../logo/close_icon.png';
import searchIcon from '../../logo/search_logo.png';
import soundIcon from '../../logo/sound.png';
import originIcon from '../../logo/orgin.png';

function Chatbot({ passage, question }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false); // TTS 상태를 관리하기 위한 상태 추가

  useEffect(() => {
    console.log("Passage from props:", passage);
    console.log("Question from props:", question);
  }, [passage, question]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setChatInput('');
    setChatHistory([]);
  };

  const handleInputChange = (e) => {
    setChatInput(e.target.value);
  };

  const handleSendClick = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { sender: 'user', text: chatInput, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatHistory([...chatHistory, userMessage]);

    try {
      console.log("Sending data to server:", { question: chatInput, passage: passage }); // 디버깅용 로그
      const response = await axios.post('http://localhost:5000/ask', {
        question: chatInput,
        passage: passage,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const botMessage = { sender: 'bot', text: response.data.answer, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChatHistory([...chatHistory, userMessage, botMessage]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      const errorMessage = { sender: 'bot', text: '요청을 처리하는 중 오류가 발생했습니다.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChatHistory([...chatHistory, userMessage, errorMessage]);
    }

    setChatInput('');
  };

  const handleSpeakClick = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (chatHistory.length > 0) {
        const lastBotMessage = chatHistory.filter(msg => msg.sender === 'bot').pop();
        if (lastBotMessage) {
          const utterance = new SpeechSynthesisUtterance(lastBotMessage.text);
          utterance.onend = () => setIsSpeaking(false);
          speechSynthesis.speak(utterance);
          setIsSpeaking(true);
        }
      }
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-icons">
        <div className="chat-icon" onClick={toggleChatbot}>
          <img src={originIcon} alt="로봇 이미지" className="robot_img" />
        </div>
        <div className="read-icon" onClick={handleSpeakClick}>
          <img src={soundIcon} alt="읽기 아이콘" className="read_img" />
        </div>
      </div>
      {isOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <img src={botIcon} alt="로고" className="logo" />
            <span className="title">QUIZZY</span>
            <button className="close" onClick={toggleChatbot}>
              <img src={closeIcon} alt="종료" className="close" />
            </button>
          </div>
          <div className="chatbot-body">
            <div className="chat-container">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`message-row ${msg.sender}`}>
                  <div className={`message-container ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                    <div className="bubble">
                      <div className="message-text">{msg.text}</div>
                    </div>
                  </div>
                  <div className={`timestamp-container ${msg.sender === 'user' ? 'user-timestamp' : 'bot-timestamp'}`}>
                    <div className="timestamp">{msg.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input-container">
              <input
                type="text"
                id='search-content'
                value={chatInput}
                onChange={handleInputChange}
                placeholder="Type your message here"
              />
              <button onClick={handleSendClick} className="send-button">
                <img src={searchIcon} alt="검색" className="search_icon" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
