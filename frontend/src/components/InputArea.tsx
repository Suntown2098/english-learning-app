import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/InputArea.css';

const InputArea: React.FC = () => {
  const { 
    inputText, 
    setInputText, 
    isRecording, 
    startRecording, 
    stopRecording, 
    sendMessage,
    isLoading
  } = useAppContext();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim() && !isLoading) {
      sendMessage();
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Adjust the textarea height based on content
  const adjustHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="input-area">
      <div className="input-container">
        <textarea
          className="message-input"
          placeholder="Type your message or click the microphone to speak..."
          value={inputText}
          onChange={(e) => {
            handleInputChange(e);
            adjustHeight(e);
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
        />
        <button
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={handleToggleRecording}
          disabled={isLoading}
          title={isRecording ? 'Stop recording' : 'Start recording'}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            {isRecording ? (
              <path d="M6 6h12v12H6z" />
            ) : (
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
            )}
          </svg>
        </button>
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          title="Send message"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InputArea; 