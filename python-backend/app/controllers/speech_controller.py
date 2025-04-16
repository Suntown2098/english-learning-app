from flask import jsonify, request
import requests
import base64
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def text_to_speech(data):
    """
    Convert text to speech
    """
    try:
        text = data.get('text')
        voice = data.get('voice', 'en-US-Standard-B')

        if not text:
            return jsonify({
                'success': False,
                'message': 'Text is required'
            }), 400

        # For demonstration, we'll use Google Cloud Text-to-Speech API
        # In production, replace with your preferred TTS service
        url = 'https://texttospeech.googleapis.com/v1/text:synthesize'
        
        headers = {
            'Authorization': f"Bearer {os.getenv('SPEECH_API_KEY')}",
            'Content-Type': 'application/json',
            'x-goog-user-project': f"{os.getenv('PROJECT_ID')}",
        }
        
        payload = {
            'input': {'text': text},
            'voice': {'languageCode': 'en-US', 'name': voice},
            'audioConfig': {'audioEncoding': 'MP3'}
        }
        print("header",headers)
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code != 200:
            return jsonify({
                'success': False,
                'message': 'Error generating speech',
                'error': response.text
            }), response.status_code
        
        return jsonify({
            'success': True,
            'audioContent': response.json().get('audioContent')
        }), 200

    except Exception as e:
        print(f"Error in text_to_speech: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error processing your request',
            'error': str(e)
        }), 500

def speech_to_text():
    """
    Convert speech to text
    """
    try:
        # Check if request contains a file
        if 'audio' not in request.files:
            return jsonify({
                'success': False,
                'message': 'Audio file is required'
            }), 400
            
        audio_file = request.files['audio']
        
        # Convert audio file to base64
        audio_content = base64.b64encode(audio_file.read()).decode('utf-8')
        
        # For demonstration, we'll use Google Cloud Speech-to-Text API
        # In production, replace with your preferred STT service
        url = 'https://speech.googleapis.com/v1/speech:recognize'
        
        headers = {
            'Authorization': f"Bearer {os.getenv('SPEECH_API_KEY')}",
            'Content-Type': 'application/json'
        }
        
        payload = {
            'config': {
                'encoding': 'WEBM_OPUS',
                'sampleRateHertz': 48000,
                'languageCode': 'en-US'
            },
            'audio': {
                'content': audio_content
            }
        }
        
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code != 200:
            return jsonify({
                'success': False,
                'message': 'Error transcribing speech',
                'error': response.text
            }), response.status_code
        
        # Extract transcription
        response_data = response.json()
        if (response_data and 
            'results' in response_data and 
            len(response_data['results']) > 0 and 
            'alternatives' in response_data['results'][0] and 
            len(response_data['results'][0]['alternatives']) > 0):
            
            transcription = response_data['results'][0]['alternatives'][0]['transcript']
            
            return jsonify({
                'success': True,
                'text': transcription
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Could not transcribe audio'
            }), 400
            
    except Exception as e:
        print(f"Error in speech_to_text: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error processing your request',
            'error': str(e)
        }), 500 