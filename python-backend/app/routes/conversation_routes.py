from flask import Blueprint, request
from app.controllers.conversation_controller import send_message, get_history

blueprint = Blueprint('conversation', __name__, url_prefix='/api/conversation')

@blueprint.route('', methods=['POST', 'OPTIONS'])
@blueprint.route('/', methods=['POST', 'OPTIONS'])
def handle_send_message():
    """
    Handle sending a message to the conversation
    """
    if request.method == 'OPTIONS':
        return '', 200
    return send_message(request.json)

@blueprint.route('/history', methods=['GET', 'OPTIONS'])
def handle_get_history():
    """
    Handle getting conversation history
    """
    if request.method == 'OPTIONS':
        return '', 200
    conversation_id = request.args.get('conversationId')
    return get_history(conversation_id) 