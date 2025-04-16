import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import MessageBubble from '../components/MessageBubble';
import SuggestedQuestions from '../components/SuggestedQuestions';
import '../styles/ChatBox.css';

const ChatBox: React.FC = () => {
  const { messages, isLoading, suggestedQuestions, setInputText } = useAppContext();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSuggestionClick = (question: string) => {
    setInputText(question);
  };

  return (
    <div className="chat-box">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h2>Welcome to English Conversation Practice!</h2>
            <p>
              Start speaking or typing in English to practice your conversation skills.
              Click the microphone button to speak, or type your message in the text box below.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))
        )}
        {isLoading && (
          <div className="loading-indicator">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      {suggestedQuestions.length > 0 && !isLoading && (
        <SuggestedQuestions 
          questions={suggestedQuestions} 
          onQuestionClick={handleSuggestionClick} 
        />
      )}
    </div>
  );
};

export default ChatBox; 