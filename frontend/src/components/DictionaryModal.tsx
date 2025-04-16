import React from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/DictionaryModal.css';

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DictionaryModal: React.FC<DictionaryModalProps> = ({ isOpen, onClose }) => {
  const { dictionaryResult, playPronunciation } = useAppContext();

  if (!isOpen || !dictionaryResult) return null;

  const handlePlayPronunciation = () => {
    playPronunciation(dictionaryResult.word);
  };

  return (
    <div className="dictionary-modal-overlay" onClick={onClose}>
      <div className="dictionary-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        
        <div className="dictionary-header">
          <h2 className="word-title">{dictionaryResult.word}</h2>
          
          {dictionaryResult.openaiGenerated ? (
            <>
              {dictionaryResult.pronunciation && (
                <div className="pronunciation">
                  {dictionaryResult.pronunciation}
                </div>
              )}
            </>
          ) : (
            <>
              {dictionaryResult.phonetics && dictionaryResult.phonetics.length > 0 && (
                <div className="phonetics">
                  {dictionaryResult.phonetics.map((phonetic, index) => (
                    <div key={index} className="phonetic-item">
                      {phonetic.text && <span>{phonetic.text}</span>}
                      {phonetic.audio && (
                        <button 
                          className="play-pronunciation-button"
                          onClick={handlePlayPronunciation}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="dictionary-content">
          {dictionaryResult.openaiGenerated ? (
            <div className="openai-definition">
              <div className="definition-section">
                <h3 className="section-title">Definition</h3>
                <p>{dictionaryResult.definition}</p>
              </div>
              
              {dictionaryResult.examples && dictionaryResult.examples.length > 0 && (
                <div className="examples-section">
                  <h3 className="section-title">Examples</h3>
                  <ul className="examples-list">
                    {dictionaryResult.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              {dictionaryResult.explanation && (
                <div className="explanation-section">
                  <h3 className="section-title">Explanation</h3>
                  <p>{dictionaryResult.explanation}</p>
                </div>
              )}
              
              {dictionaryResult.examples && dictionaryResult.examples.length > 0 && (
                <div className="examples-section">
                  <h3 className="section-title">Examples</h3>
                  <ul className="examples-list">
                    {dictionaryResult.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {dictionaryResult.meanings && dictionaryResult.meanings.length > 0 && (
                <div className="meanings-section">
                  <h3 className="section-title">Meanings</h3>
                  {dictionaryResult.meanings.map((meaning, index) => (
                    <div key={index} className="meaning-item">
                      <h4 className="part-of-speech">{meaning.partOfSpeech}</h4>
                      <ol className="definitions-list">
                        {meaning.definitions.map((def, defIndex) => (
                          <li key={defIndex} className="definition-item">
                            <div className="definition-text">{def.definition}</div>
                            {def.example && (
                              <div className="definition-example">"{def.example}"</div>
                            )}
                            {def.synonyms && def.synonyms.length > 0 && (
                              <div className="synonyms">
                                <span className="synonym-label">Synonyms: </span>
                                {def.synonyms.join(', ')}
                              </div>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DictionaryModal; 