# English Learning App Python Backend

Flask-based backend server for the English Learning App, providing API endpoints for conversation, speech recognition, and dictionary services.

## Features

- **Conversation API**: Interact with a language model to practice English conversation
- **Speech API**: Speech-to-text and text-to-speech functionality
- **Dictionary API**: Word lookup and pronunciation assistance

## Setup

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository
2. Navigate to the python-backend directory:
   ```bash
   cd english-learning-app/python-backend
   ```
3. Set up a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```
4. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
6. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
7. Edit the `.env` file and add your API keys:
   - OpenAI API key
   - Speech API key (Google Cloud, Azure, etc.)
   - Secret key for Flask

### Running the server

Development mode:
```bash
python run.py
```

Production mode (with gunicorn, for Linux/macOS):
```bash
gunicorn -k eventlet -w 1 'app:app'
```

## API Documentation

### Conversation API

#### Send a message

- **URL**: `/api/conversation`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "message": "Hello, how are you?",
    "conversationId": "optional-existing-conversation-id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "conversationId": "session_1234567890",
    "response": "I'm doing well, thank you for asking! How about you?",
    "suggestedFollowUps": "What did you do today?, Do you enjoy learning English?, What's your favorite topic to discuss?"
  }
  ```

#### Get conversation history

- **URL**: `/api/conversation/history?conversationId=session_1234567890`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "success": true,
    "history": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      },
      {
        "role": "assistant",
        "content": "I'm doing well, thank you for asking! How about you?"
      }
    ]
  }
  ```

### Speech API

#### Text to Speech

- **URL**: `/api/speech/text-to-speech`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "text": "Hello, how are you?",
    "voice": "en-US-Standard-B" // Optional
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "audioContent": "base64-encoded-audio"
  }
  ```

#### Speech to Text

- **URL**: `/api/speech/speech-to-text`
- **Method**: `POST`
- **Body**: Form data with audio file (key: 'audio')
- **Response**:
  ```json
  {
    "success": true,
    "text": "Hello, how are you?"
  }
  ```

### Dictionary API

#### Look up a word

- **URL**: `/api/dictionary/lookup?word=example`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "success": true,
    "word": "example",
    "phonetics": [...],
    "meanings": [...],
    "explanation": "A thing characteristic of its kind or illustrating a general rule",
    "examples": [
      "This is a good example of how the system works",
      "I need to set an example for the younger students"
    ]
  }
  ```

#### Get pronunciation

- **URL**: `/api/dictionary/pronunciation?word=example`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "success": true,
    "word": "example",
    "ipa": "/ɪɡˈzæmpəl/",
    "audioUrl": "https://api.dictionaryapi.dev/media/pronunciations/en/example-us.mp3"
  }
  ```

## Integration with Frontend

The backend is designed to work with the React frontend located in the `/frontend` directory. It provides all the necessary API endpoints for the frontend's features:

1. English conversation practice
2. Speech recognition and synthesis
3. Dictionary and vocabulary assistance

## License

MIT 