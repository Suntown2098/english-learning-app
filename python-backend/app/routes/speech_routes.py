from flask import Blueprint, request
from app.controllers.speech_controller import text_to_speech, speech_to_text

blueprint = Blueprint('speech', __name__, url_prefix='/api/speech')

@blueprint.route('/text-to-speech', methods=['POST'])
def handle_text_to_speech():
    """
    Handle converting text to speech
    """
    return text_to_speech(request.json)

@blueprint.route('/speech-to-text', methods=['POST'])
def handle_speech_to_text():
    """
    Handle converting speech to text
    """
    return speech_to_text() 