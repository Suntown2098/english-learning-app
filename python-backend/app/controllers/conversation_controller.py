from flask import jsonify
from app.config.openai_config import get_openai_client
import time

# In-memory storage for conversation history (in production, use a database)
conversations = {}

def send_message(data):
    """
    Send a message to the LLM and get a response
    """
    try:
        message = data.get('message')
        user_id = data.get('userId')
        conversation_id = data.get('conversationId')

        if not message:
            return jsonify({
                'success': False,
                'message': 'Message is required'
            }), 400

        # Generate a unique ID for new conversations
        session_id = conversation_id or f"session_{int(time.time() * 1000)}"
        
        # Initialize conversation history if it doesn't exist
        if session_id not in conversations:
            conversations[session_id] = [
                {
                    'role': 'system',
                    'content': 'You are an AI English conversation partner. Engage the user in natural English conversations, help them practice speaking, and provide gentle corrections for grammar or pronunciation errors when appropriate. Ask follow-up questions to keep the conversation going. Occasionally suggest vocabulary or expressions that would enhance their response. Keep responses conversational and encouraging.'
                }
            ]
        
        # Add user message to conversation history
        conversations[session_id].append({'role': 'user', 'content': message})
        
        # Get response from OpenAI
        openai_client = get_openai_client()
        completion = openai_client.chat.completions.create(
            model='gpt-4',
            messages=conversations[session_id],
            max_tokens=300,
            temperature=0.7,
        )
        
        ai_response = completion.choices[0].message.content
        
        # Add AI response to conversation history
        conversations[session_id].append({'role': 'assistant', 'content': ai_response})
        
        # Generate follow-up questions to encourage continuation
        follow_up_completion = openai_client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': 'Generate 2-3 brief follow-up questions or topics related to the current conversation to help keep it going. Format them as a simple comma-separated list. Keep them brief and conversational.'},
                {'role': 'user', 'content': f"Previous conversation: {conversations[session_id][-4:] if len(conversations[session_id]) > 4 else conversations[session_id]}"}
            ],
            max_tokens=100,
            temperature=0.7,
        )
        
        suggested_follow_ups = follow_up_completion.choices[0].message.content
        
        return jsonify({
            'success': True,
            'conversationId': session_id,
            'response': ai_response,
            'suggestedFollowUps': suggested_follow_ups
        }), 200

    except Exception as e:
        print(f"Error in send_message: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error processing your request',
            'error': str(e)
        }), 500

def get_history(conversation_id):
    """
    Get conversation history
    """
    try:
        if not conversation_id or conversation_id not in conversations:
            return jsonify({
                'success': False,
                'message': 'Conversation not found'
            }), 404

        # Filter out system messages
        history = [msg for msg in conversations[conversation_id] if msg['role'] != 'system']
        
        return jsonify({
            'success': True,
            'history': history
        }), 200

    except Exception as e:
        print(f"Error in get_history: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error processing your request',
            'error': str(e)
        }), 500 