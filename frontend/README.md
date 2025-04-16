# English Learning App Frontend

This is the frontend for the English Learning App, designed to help users practice English conversation through speech recognition and language model interactions.

## Features

- **Speech Recognition**: Speak in English and have your speech converted to text
- **Natural Language Conversation**: Chat with an AI language model to practice English
- **Text-to-Speech**: Hear the correct pronunciation of responses
- **Word Dictionary**: Click on any word to see its definition, pronunciation, and examples
- **Suggested Questions**: Get follow-up question suggestions to keep the conversation going

## Tech Stack

- React with TypeScript
- Context API for state management
- CSS for styling
- Axios for API requests
- Web Speech API for recording audio

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the root directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## How to Use

1. **Start a Conversation**: Type in the text box or click the microphone icon to record your voice.
2. **Edit Transcribed Text**: After recording, you can edit the transcribed text if needed.
3. **Send Message**: Click the send button or press Enter to send your message.
4. **Listen to Response**: Click the play button on the assistant's message to hear it spoken.
5. **Look Up Words**: Click on any word in the assistant's message to see its definition.
6. **Continue the Conversation**: Use the suggested questions or ask your own follow-up questions.

## Integration with Backend

This frontend is designed to work with the Python Flask backend provided in the `/python-backend` directory. The backend provides:

1. Speech-to-text and text-to-speech conversion
2. Language model interactions
3. Dictionary lookup services

## License

MIT
