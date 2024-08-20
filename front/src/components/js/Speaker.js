// soundIcon 클릭으로 읽기 모드 ON/OFF 전환
// 읽기 모드 ON 상태 일 때 커서 조작 시 해당 텍스트 TTS 기능 추가 코드
import React, { useState, useEffect } from 'react';
import soundIcon from '../../logo/sound_logo.png';

const Speaker_Button = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState('');

  useEffect(() => {
    const handleMouseEnter=(event) => {
        if (isEnabled){
            const text = event.target.innerText || event.target.alt;
            if (text) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'ko-KR';
                window.speechSynthesis.speak(utterance);
                setIsSpeaking(true);

                utterance.onend = () => {
                    setIsSpeaking(false);
                };
            }
        }
    };

    const handleMouseLeave = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
        document.removeEventListener('mouseenter', handleMouseEnter, true);
        document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
}, [isEnabled, isSpeaking]);

    const toggleEnable = () => {
        setIsEnabled(!isEnabled);
        if (isSpeaking){
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <button className='icon-button' onClick={toggleEnable}>
            <img src={soundIcon} alt='sound-icon'  className={`sound-icon ${isEnabled ? 'active' : ''}`} />
        </button>
    );
};

export default Speaker_Button;