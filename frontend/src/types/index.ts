export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
}

export interface DictionaryResult {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  explanation?: string;
  examples?: string[];
  openaiGenerated?: boolean;
  definition?: string;
  pronunciation?: string;
  partOfSpeech?: string;
}

export interface Phonetic {
  text?: string;
  audio?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface ConversationResponse {
  success: boolean;
  conversationId: string;
  response: string;
  suggestedFollowUps: string;
}

export interface SpeechToTextResponse {
  success: boolean;
  text: string;
}

export interface TextToSpeechResponse {
  success: boolean;
  audioContent: string;
}

export interface PronunciationResponse {
  success: boolean;
  word: string;
  ipa: string;
  audioUrl: string;
} 