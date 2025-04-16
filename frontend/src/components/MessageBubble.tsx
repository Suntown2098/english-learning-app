import React from 'react';
import { Message } from '../types';
import { useAppContext } from '../context/AppContext';
import '../styles/MessageBubble.css';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { lookupWord, playResponse } = useAppContext();
  const isUser = message.role === 'user';

  const handleWordClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const word = e.currentTarget.textContent?.trim().toLowerCase();
    if (word) {
      lookupWord(word);
    }
  };

  const handlePlayClick = () => {
    playResponse(message.content);
  };

  // Function to wrap words in clickable spans for the assistant's messages
  const renderMessageContent = () => {
    if (isUser) {
      return <p>{message.content}</p>;
    }

    // For assistant messages, wrap each word in a span for dictionary lookup
    const words = message.content.split(' ');
    return (
      <p>
        {words.map((word, index) => {
          // Remove punctuation for the word lookup
          const cleanWord = word.replace(/[.,!?;:()]/g, '');
          
          // Skip wrapping very short words or empty strings
          if (cleanWord.length <= 2) {
            return (
              <React.Fragment key={index}>
                {word}{' '}
              </React.Fragment>
            );
          }
          
          return (
            <React.Fragment key={index}>
              <span 
                className="clickable-word" 
                onClick={handleWordClick}
                title="Click to look up this word"
              >
                {word}
              </span>{' '}
            </React.Fragment>
          );
        })}
      </p>
    );
  };

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-content">
        {renderMessageContent()}
        {!isUser && (
          <button 
            className="play-button" 
            onClick={handlePlayClick}
            title="Listen to this message"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>
      <div className="message-time">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default MessageBubble; 