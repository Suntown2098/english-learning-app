from flask import Blueprint, request
from app.controllers.dictionary_controller import lookup_word, get_pronunciation

blueprint = Blueprint('dictionary', __name__, url_prefix='/api/dictionary')

@blueprint.route('/lookup', methods=['GET'])
def handle_lookup_word():
    """
    Handle looking up a word in the dictionary
    """
    word = request.args.get('word')
    return lookup_word(word)

@blueprint.route('/pronunciation', methods=['GET'])
def handle_get_pronunciation():
    """
    Handle getting pronunciation for a word
    """
    word = request.args.get('word')
    return get_pronunciation(word) 