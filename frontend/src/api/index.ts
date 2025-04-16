import axios from 'axios';
import {
  ConversationResponse,
  DictionaryResult,
  Message,
  PronunciationResponse,
  SpeechToTextResponse,
  TextToSpeechResponse
} from '../types';

// Ensure the URL has a trailing slash for consistency
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '') + '/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add proper CORS configuration
  withCredentials: false
});

// Conversation API
export const sendMessage = async (
  message: string,
  conversationId?: string
): Promise<ConversationResponse> => {
  const response = await api.post('conversation', {
    message,
    conversationId,
  });
  return response.data;
};

export const getConversationHistory = async (
  conversationId: string
): Promise<Message[]> => {
  const response = await api.get(`conversation/history?conversationId=${conversationId}`);
  return response.data.history;
};

// Speech API
export const speechToText = async (audioBlob: Blob): Promise<SpeechToTextResponse> => {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  const response = await axios.post(`${API_BASE_URL}speech/speech-to-text`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: false
  });
  return response.data;
};

export const textToSpeech = async (
  text: string,
  voice?: string
): Promise<TextToSpeechResponse> => {
  const response = await api.post('speech/text-to-speech', {
    text,
    voice,
  });
  return response.data;
};

// Dictionary API
export const lookupWord = async (word: string): Promise<DictionaryResult> => {
  const response = await api.get(`dictionary/lookup?word=${encodeURIComponent(word)}`);
  return response.data;
};

export const getPronunciation = async (word: string): Promise<PronunciationResponse> => {
  const response = await api.get(`dictionary/pronunciation?word=${encodeURIComponent(word)}`);
  return response.data;
}; 