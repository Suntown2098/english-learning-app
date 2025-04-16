import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import ChatBox from './components/ChatBox';
import InputArea from './components/InputArea';
import DictionaryModal from './components/DictionaryModal';
import './App.css';

// Main app wrapper that provides the AppContext
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

// Inner component that can use the context
const AppContent: React.FC = () => {
  const { dictionaryResult } = useAppContext();
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);

  // Show dictionary modal when a word is looked up
  useEffect(() => {
    if (dictionaryResult) {
      setIsDictionaryOpen(true);
    }
  }, [dictionaryResult]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <ChatBox />
        <InputArea />
      </main>
      <DictionaryModal 
        isOpen={isDictionaryOpen} 
        onClose={() => setIsDictionaryOpen(false)} 
      />
    </div>
  );
};

export default App;
