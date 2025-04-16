from flask import jsonify
import requests
import json
from app.config.openai_config import get_openai_client

def lookup_word(word):
    """
    Look up a word in the dictionary
    """
    try:
        if not word:
            return jsonify({
                'success': False,
                'message': 'Word is required'
            }), 400
            
        # Use the Free Dictionary API
        response = requests.get(f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}")
        
        if response.status_code != 200:
            # If the dictionary API fails, fall back to OpenAI
            return _openai_fallback_lookup(word)
            
        word_data = response.json()[0]
        
        # Use OpenAI to generate a simple explanation and example sentence
        openai_client = get_openai_client()
        completion = openai_client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': 'You are a helpful English language teaching assistant.'},
                {'role': 'user', 'content': f'Provide a simple explanation of the word "{word}" and 2 example sentences using it. Format your response as JSON with fields "explanation" and "examples" (array of strings).'}
            ],
            max_tokens=200,
            temperature=0.7,
        )
        
        try:
            enhanced_data = json.loads(completion.choices[0].message.content)
        except:
            # If parsing fails, use the raw response
            enhanced_data = {
                'explanation': completion.choices[0].message.content,
                'examples': []
            }
            
        return jsonify({
            'success': True,
            'word': word_data.get('word'),
            'phonetics': word_data.get('phonetics', []),
            'meanings': word_data.get('meanings', []),
            'explanation': enhanced_data.get('explanation', ''),
            'examples': enhanced_data.get('examples', [])
        }), 200
            
    except Exception as e:
        print(f"Error in lookup_word: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error processing your request',
            'error': str(e)
        }), 500
        
def _openai_fallback_lookup(word):
    """
    Use OpenAI as a fallback for word lookup
    """
    try:
        openai_client = get_openai_client()
        completion = openai_client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': 'You are a helpful English language teaching assistant.'},
                {'role': 'user', 'content': f'Provide information about the word "{word}" including its definition, pronunciation (in IPA if possible), part of speech, and 2 example sentences. Format your response as JSON with fields "definition", "pronunciation", "partOfSpeech", and "examples" (array of strings).'}
            ],
            max_tokens=300,
            temperature=0.7,
        )
        
        try:
            word_info = json.loads(completion.choices[0].message.content)
        except:
            # If parsing fails, create a basic structure
            word_info = {
                'definition': completion.choices[0].message.content,
                'pronunciation': '',
                'partOfSpeech': '',
                'examples': []
            }
            
        return jsonify({
            'success': True,
            'word': word,
            'openaiGenerated': True,
            'definition': word_info.get('definition', ''),
            'pronunciation': word_info.get('pronunciation', ''),
            'partOfSpeech': word_info.get('partOfSpeech', ''),
            'examples': word_info.get('examples', [])
        }), 200
        
    except Exception as e:
        print(f"Error in _openai_fallback_lookup: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error processing your request',
            'error': str(e)
        }), 500
        
def get_pronunciation(word):
    """
    Get pronunciation for a word
    """
    try:
        if not word:
            return jsonify({
                'success': False,
                'message': 'Word is required'
            }), 400
            
        # Use the Free Dictionary API
        response = requests.get(f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}")
        
        if response.status_code != 200:
            return jsonify({
                'success': False,
                'message': 'Word not found'
            }), 404
            
        word_data = response.json()[0]
        
        # Look for audio pronunciation
        audio_url = ''
        if 'phonetics' in word_data and word_data['phonetics']:
            for phonetic in word_data['phonetics']:
                if 'audio' in phonetic and phonetic['audio']:
                    audio_url = phonetic['audio']
                    break
        
        # Get IPA pronunciation
        ipa = ''
        if 'phonetics' in word_data and word_data['phonetics']:
            for phonetic in word_data['phonetics']:
                if 'text' in phonetic and phonetic['text']:
                    ipa = phonetic['text']
                    break
                    
        return jsonify({
            'success': True,
            'word': word_data.get('word'),
            'ipa': ipa,
            'audioUrl': audio_url
        }), 200
            
    except Exception as e:
        print(f"Error in get_pronunciation: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error processing your request',
            'error': str(e)
        }), 500 