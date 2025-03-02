// useTypewriterEffect.js
import { useState, useEffect } from 'react';

const useTypewriterEffect = (text, typingSpeed = 80, delaySpeed = 1000) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (!text) {
            setDisplayedText('');
            setIsTyping(false);
            return;
        }

        let index = 0;
        let timeoutId;

        const typeText = () => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text[index]);
                index++;
                timeoutId = setTimeout(typeText, typingSpeed);
            } else {
                setIsTyping(false);
                timeoutId = setTimeout(() => {
                    setDisplayedText('');
                }, delaySpeed);
            }
        };

        typeText();

        return () => clearTimeout(timeoutId);
    }, [text, typingSpeed, delaySpeed]);

    return [displayedText, isTyping];
};

export default useTypewriterEffect;
