import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Conversation, Message, DictionaryResult } from '../types';
import * as api from '../api';

interface AppContextProps {
  conversation: Conversation | null;
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  sendMessage: () => Promise<void>;
  isLoading: boolean;
  suggestedQuestions: string[];
  dictionaryResult: DictionaryResult | null;
  lookupWord: (word: string) => Promise<void>;
  playPronunciation: (word: string) => Promise<void>;
  playResponse: (text: string) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [dictionaryResult, setDictionaryResult] = useState<DictionaryResult | null>(null);

  useEffect(() => {
    if (conversation) {
      localStorage.setItem('conversationId', conversation.id);
    }
  }, [conversation]);

  useEffect(() => {
    const storedConversationId = localStorage.getItem('conversationId');
    if (storedConversationId) {
      loadConversationHistory(storedConversationId);
    }
  }, []);

  const loadConversationHistory = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const history = await api.getConversationHistory(conversationId);
      setMessages(history);
      setConversation({ id: conversationId, messages: history });
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading conversation history:', error);
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.onstart = () => {
        setAudioChunks([]);
      };
      
      recorder.ondataavailable = (e) => {
        setAudioChunks((chunks) => [...chunks, e.data]);
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      const { success, text } = await api.speechToText(audioBlob);
      
      if (success && text) {
        setInputText(text);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing audio:', error);
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Add user message to UI immediately
      const userMessage: Message = { role: 'user', content: inputText };
      setMessages((prev) => [...prev, userMessage]);
      
      // Send message to API
      const { conversationId, response, suggestedFollowUps } = await api.sendMessage(
        inputText,
        conversation?.id
      );
      
      // Create conversation if it doesn't exist
      if (!conversation) {
        setConversation({ id: conversationId, messages: [userMessage] });
      }
      
      // Add assistant message to UI
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Update suggested questions
      if (suggestedFollowUps) {
        const questions = suggestedFollowUps.split(',').map(q => q.trim());
        setSuggestedQuestions(questions);
      }
      
      // Clear input
      setInputText('');
      setIsLoading(false);
      
      // Auto-play the response
      await playResponse(response);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const lookupWord = async (word: string) => {
    try {
      setIsLoading(true);
      const result = await api.lookupWord(word);
      setDictionaryResult(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Error looking up word:', error);
      setIsLoading(false);
    }
  };

  const playPronunciation = async (word: string) => {
    try {
      const { audioUrl } = await api.getPronunciation(word);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Error playing pronunciation:', error);
    }
  };

  const playResponse = async (text: string) => {
    try {
      const { audioContent } = await api.textToSpeech(text);
      if (audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
        audio.play();
      }
    } catch (error) {
      console.error('Error playing response:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        conversation,
        messages,
        inputText,
        setInputText,
        isRecording,
        startRecording,
        stopRecording,
        sendMessage,
        isLoading,
        suggestedQuestions,
        dictionaryResult,
        lookupWord,
        playPronunciation,
        playResponse,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 