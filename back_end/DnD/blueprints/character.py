# blueprint/routes for the note table
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError

# import the model for this blueprint
from ..models import Character, User, Campaign, CharacterCampaigns

# import database
from ..config import db

# initialize the blueprint named notes
char_bp = Blueprint('character', __name__, url_prefix='/characters')

# ROUTES
# try except is like try catch, Exception is all the errors, the as a variable helps to do something with the error.

# gets all characters after logging in
@char_bp.route('/', methods=['GET'])
@jwt_required()
def get_chars():
    try:
        user_id = get_jwt_identity()['userId']
        user = User.query.get(user_id)
        if not user:
            print("User not found")
            return jsonify({'error': 'User not found'}), 404
        characters = [char.to_dict() for char in user.characters]
        return jsonify(characters)
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Failed to retrieve characters'}), 500
    

# gets a character by id
@char_bp.route('/<int:char_id>', methods=['GET'])
@jwt_required()
def get_char_by_id(char_id):
    try:
        user_id = get_jwt_identity()['userId']
        # gets the character based on the user id
        character = Character.query.filter_by(id=char_id).first() 
        if not character:
            return jsonify({'error': 'Character not found'}), 404

        return jsonify(character.to_dict())
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Failed to retrieve characters'}), 500

# updates a character by id
@char_bp.route('/<int:char_id>', methods=['PUT'])
@jwt_required()
def update_char_by_id(char_id):
    try:
        character = Character.query.get(char_id)
        if not character:
            return jsonify({'error': 'Character not found'}), 404

        # Get the JSON data from the request
        data = request.get_json()

        # Update the character fields based on flattened keys
        for key, value in data.items():
            if hasattr(character, key):
                setattr(character, key, value)

        # Commit the changes to the database
        db.session.commit()

        return jsonify(character.to_dict()), 200

    except SQLAlchemyError as err:
        print(f"SQLAlchemy Error: {err}")
        return jsonify({'error': 'Failed to update character'}), 500
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({'error': 'An error occurred'}), 500
    

# deletes a character by id
@char_bp.route('/<int:char_id>', methods=['DELETE'])
@jwt_required()
def delete_char_by_id(char_id):
    try:
        character = Character.query.get(char_id)
        if character:
            # Delete the character from the database
            db.session.delete(character)
            db.session.commit()
            return jsonify({'message': 'Character deleted successfully'}), 200
        else:
            return jsonify({'error': 'Character not found'}), 404

    except SQLAlchemyError as err:
        db.session.rollback()
        print(f"Error: {err}")
        return jsonify({'error': 'Failed to delete character'}), 500
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Internal Server Error'}), 500

# create character after logging in
@char_bp.route('/', methods=['POST'])
@jwt_required()
def create_char():
    try:
        data = request.get_json() #get_json gets the json request.
        # get the user id from the jwt
        user_id = get_jwt_identity()['userId']

        # get the user
        user = User.query.get(user_id)

        # create a new character
        new_char = Character(**data)

        # add the character to the user
        user.characters.append(new_char)
        
        db.session.add(new_char)
        db.session.commit()

        return jsonify(new_char.to_dict())
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Failed to create character'}), 500


# add character to campaign
@char_bp.route('/addToCampaign', methods=['POST'])
@jwt_required()
def add_char_to_camp():
    try:
        data = request.get_json()
        char_id = data.get('character_id')
        campaign_id = data.get('campaign_id')
        user_id = get_jwt_identity()['userId']
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        character = Character.query.get(char_id)
        campaign = Campaign.query.get(campaign_id)
        
        if not character or not campaign:
            return jsonify({"error": "Character or Campaign not found"}), 404

        if character.user_id != user_id:
            return jsonify({"error": "You do not own this character"}), 403

        if campaign.dm == user.id:
            return jsonify({"error": "You cannot add a character to a campaign you are the DM of"}), 403

        # if any(char for char in campaign.characters if char.user_id == user_id):
        #     return jsonify({"error": "You already have a character in this campaign"}), 400

        # Check if the character is already in the campaign
        if CharacterCampaigns.query.filter_by(character_id=char_id, campaign_id=campaign_id).first():
            return jsonify({"error": "Character already in this campaign"}), 400
        

         # Create a new association between character and campaign
        char_campaign = CharacterCampaigns(character_id=char_id, campaign_id=campaign_id)
        
        db.session.add(char_campaign)
        db.session.commit()

        return jsonify(char_campaign.to_dict())

        # char_campaign = CharacterCampaigns(character_id=char_id, campaign_id=campaign_id, character=character, campaign=campaign)
        
        # db.session.add(char_campaign)
        # db.session.commit()

        # return jsonify(char_campaign.to_dict())
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Failed to add character to campaign'}), 500


# # GET route
# @char_bp.route('/', methods=['GET'])
# # get all notes and turn it in a json object
# def get_chars():
    
#     try:
#         results = Character.query.all()
#         # itierates through the results object, then gets the attributes and puts them in a list using a method defined in the model
#         char_data = [result.to_dict() for result in results]
#         return jsonify(char_data)
        
#     except Exception as err:
#         print(f"Error: {err}")
#         return jsonify({'error': 'Failed to retrieve characters'}), 500
    
# # GET route for a single character
# @char_bp.route('/<int:char_id>', methods=['GET'])
# def get_char(char_id):
#     try:
#         result = Character.query.get(char_id)
#         return jsonify(result.to_dict())
#     except Exception as err:
#         print(f"Error: {err}")
#         return jsonify({'error': 'Failed to retrieve character'}), 500

# # POST route
# @char_bp.route('/', methods=['POST'])
# # post a new character
# def new_char():
#     try:
#         data = request.get_json() #get_json gets the json request.
#         new_char = Character(**data)  # the ** unpacks the dictionary data and passes its key value pairs as arguments 
#         db.session.add(new_char)
#         db.session.commit()
#         # print('testing what new_char looks like: ', new_char)
#         return jsonify(new_char.to_dict()) #returns the new_char
#     except Exception as err:
#         print(f"Error: {err}")
#         return jsonify({'error': 'Failed to create character'}), 500

# # PUT route
# @char_bp.route('/<int:char_id>', methods=['PUT'])
# def update_char(char_id):
#     data = request.get_json() #get_json gets the json request.
#     character = Character.query.get(char_id)
#     try:
#         Character.query.filter_by(id=char_id).update(data)
#         db.session.commit()
#         updated_char = Character.query.get(char_id)
#         return jsonify(updated_char.to_dict())
#     except Exception as err:
#             print(f"Error: {err}")
#             return jsonify({'error': 'Failed to update character'}), 500

# # DELETE route
# @char_bp.route('/<int:char_id>', methods=['DELETE'])
# def delete_char(char_id):
#     try:
#         Character.query.filter_by(id=char_id).delete()
#         db.session.commit()
#         return jsonify({'message': 'Character deleted successfully'})
#     except Exception as err:
#         print(f"Error: {err}")
#         return jsonify({'error': 'Failed to delete character'}), 500
    