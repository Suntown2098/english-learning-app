from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

# Initialize CORS with proper configuration
CORS(app, 
     resources={r"/api/*": {
         "origins": os.getenv("CORS_ORIGIN", "http://localhost:3000"),
         "methods": ["GET", "POST", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"]
     }},
     supports_credentials=False)

# Initialize Socket.IO
socketio = SocketIO(app, cors_allowed_origins=os.getenv("CORS_ORIGIN", "http://localhost:3000"))

# Import routes
from app.routes import conversation_routes, speech_routes, dictionary_routes

# Register routes
app.register_blueprint(conversation_routes.blueprint)
app.register_blueprint(speech_routes.blueprint)
app.register_blueprint(dictionary_routes.blueprint)

# Event handlers for Socket.IO
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected') 