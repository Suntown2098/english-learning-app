import React from 'react';
import '../styles/SuggestedQuestions.css';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onQuestionClick 
}) => {
  return (
    <div className="suggested-questions">
      <div className="suggested-questions-title">
        Suggested follow-up questions:
      </div>
      <div className="questions-container">
        {questions.map((question, index) => (
          <button
            key={index}
            className="question-button"
            onClick={() => onQuestionClick(question)}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions; 