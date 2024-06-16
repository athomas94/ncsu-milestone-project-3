# blueprint/routes for the note table
from flask import Blueprint, jsonify, request, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import joinedload

# import the model for this blueprint
from ..models import Campaign, User, UserCampaigns,Character, CharacterCampaigns

# import database
from ..config import db

# initialize the blueprint named notes
campaign_bp = Blueprint('campaign', __name__, url_prefix='/campaigns')

# ROUTES
# try except is like try catch, Exception is all the errors, the as a variable helps to do something with the error.

# logged in, gets one campaign, and the character for that campaign
@campaign_bp.route('/<int:campaign_id>/characters', methods=['GET'])
@jwt_required()
def get_characters(campaign_id):
    try:
        user_id = get_jwt_identity()['userId']
        user = User.query.get(user_id)

        campaign = Campaign.query.get(campaign_id)
        # itierates through the results object, then gets the attributes and puts them in a list using a method defined in the model
        characters = [char.to_dict() for char in campaign.characters]
        return jsonify(characters)
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Failed to retrieve characters'}), 500

# logged in, gets one campaign, and creates a character
@campaign_bp.route('/<int:campaign_id>/characters', methods=['POST'])
@jwt_required()
def create_character(campaign_id):
    try:
        data = request.get_json() #get_json gets the json request.
        user_id = get_jwt_identity()['userId']
        user = User.query.get(user_id)

        campaign = Campaign.query.get(campaign_id)
        new_char = Character(**data)

        campaign.characters.append(new_char)

        db.session.add(new_char)
        db.session.commit()

        return jsonify(new_char.to_dict())
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Failed to create character'}), 500


# Route to fetch all campaigns the user is not a part of and not the DM of
@campaign_bp.route('/eligible_wrong', methods=['GET'])
@jwt_required()
def get_eligible_campaigns():
    try:
        user_id = get_jwt_identity()['userId']
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Fetch all campaigns where the user is not the DM and is not associated with any characters
        eligible_campaigns = (Campaign.query
                              .filter(Campaign.dm != user_id)
                              .filter(~Campaign.characters.any(Character.user_id == user_id))
                              .all())
        
        # Convert eligible campaigns to a dictionary format
        eligible_campaigns_data = [campaign.to_dict() for campaign in eligible_campaigns]

        return jsonify(eligible_campaigns_data)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to retrieve eligible campaigns'}), 500
    

# Route to fetch eligible campaigns where the user is not the DM
# @campaign_bp.route('/eligible', methods=['GET'])
# @jwt_required()
# def get_eligible_correct_campaigns():
#     try:
#         user_id = get_jwt_identity()['userId']
#         user = User.query.get(user_id)
        
#         if not user:
#             return jsonify({"error": "User not found"}), 404

#         # Fetch all campaigns where the user is not the DM
#         eligible_campaigns = (Campaign.query
#                               .filter(Campaign.dm != user_id)
#                               .join(UserCampaigns)
#                               .filter(UserCampaigns.user_id == user_id)
#                               .all())
        
#         # Convert eligible campaigns to a dictionary format
#         eligible_campaigns_data = [campaign.to_dict() for campaign in eligible_campaigns]

#         return jsonify(eligible_campaigns_data)

#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({'error': 'Failed to retrieve eligible campaigns'}), 500


# Route to fetch eligible campaigns where the user is not the DM and doesn't have a character already
@campaign_bp.route('/eligible', methods=['GET'])
@jwt_required()
def get_eligible_campaigns():

    user_id = get_jwt_identity()['userId']
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404

    #creates an empty list to append eligible campaigns for a character to be added to
    eligible_campaigns = []

    # print('testing what user.campaigns looks like: ', user.campaigns) 

    for user_campaign in user.campaigns:
        campaign = user_campaign.campaign

        if campaign.dm != user_id:
            eligible_campaigns.append(campaign.to_dict()) # add each campaign info to the list


    return jsonify(eligible_campaigns)






# @campaign_bp.route('/eligible', methods=['GET'])
# @jwt_required()
# def get_eligible_correct_campaigns():
#     try:
#         user_id = get_jwt_identity()['userId']
#         user = User.query.get(user_id)
        
#         if not user:
#             return jsonify({"error": "User not found"}), 404

#         # Fetch all campaigns where the user is not the DM
#         # Also exclude campaigns where the user already has a character
#         eligible_campaigns = (Campaign.query
#                               .filter(Campaign.dm != user_id)
#                               .outerjoin(CharacterCampaigns)
#                               .filter(~CharacterCampaigns.character.has(Character.user_id == user_id))
#                               .all())
        
#         # Convert eligible campaigns to a dictionary format
#         eligible_campaigns_data = [campaign.to_dict() for campaign in eligible_campaigns]

#         return jsonify(eligible_campaigns_data)

#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({'error': 'Failed to retrieve eligible campaigns'}), 500




# @campaign_bp.route('/eligible', methods=['GET'])
# @jwt_required()
# def get_eligible_campaigns():

#     if request.method == 'OPTIONS':
#         response = make_response()
#         response.headers['Access-Control-Allow-Origin'] = '*'
#         response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
#         response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
#         return response

#     user_id = get_jwt_identity()['userId']
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"error": "user not found"}), 404

#     #creates an empty list to append eligible campaigns for a character to be added to
#     eligible_campaigns = []

#     print('testing what user.campaigns looks like: ', user.campaigns) 

#     for user_campaign in user.campaigns:
#         campaign = user_campaign.campaign

#         # if campaign DM is not the user, and there are no characters in the campaign that belong to the user
#         print('testing what campaign looks like: ', campaign.to_dict()) # <UserCampaigns 4, 7>
        
#         if campaign.dm != user_id and not any(character for character in campaign.characters if character.user_id == user_id):
#             eligible_campaigns.append(campaign.to_dict()) # add each campaign info to the list

#     return jsonify(eligible_campaigns)





# GET route
@campaign_bp.route('/', methods=['GET'])
@jwt_required()
# get all campaigns and turn it in a json object
def get_campaigns():

    current_user = get_jwt_identity()
    user = User.query.get(current_user['userId'])
    if not user:
        print("User not found")
        return jsonify({'error': 'User not found'}), 404
    
    try:
        results = Campaign.query.all()
        # itierates through the results object, then gets the attributes and puts them in a list using a method defined in the model
        campaign_data = [result.to_dict() for result in results]
        return jsonify(campaign_data)
        
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Failed to retrieve campaigns'}), 500
    
# GET route for a single campaign
@campaign_bp.route('/<int:campaign_id>', methods=['GET'])
def get_user(campaign_id):
    try:
        result = Campaign.query.get(campaign_id)
        return jsonify(result.to_dict())
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Failed to retrieve campaign'}), 500



# POST route
@campaign_bp.route('/', methods=['POST'])
# post a new campaign
def new_campaign():
    try:
        
        data = request.get_json() #get_json gets the json request.
        
        new_campaign = Campaign(**data)  # the ** unpacks the dictionary data and passes its key value pairs as arguments 
        db.session.add(new_campaign)
        db.session.commit()
        # print('testing what new_campaign looks like: ', new_campaign)
        return jsonify(new_campaign.to_dict()) #returns the new_campaign
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Failed to create campaign'}), 500

# PUT route
@campaign_bp.route('/<int:campaign_id>', methods=['PUT'])
def update_user(campaign_id):
    data = request.get_json() #get_json gets the json request.
    campaign = Campaign.query.get(campaign_id)
    try:
        Campaign.query.filter_by(id=campaign_id).update(data)
        db.session.commit()
        updated_campaign = Campaign.query.get(campaign_id)
        return jsonify(updated_campaign.to_dict())
    except Exception as err:
            print(f"Error: {err}")
            return jsonify({'error': 'Failed to update campaign'}), 500

# DELETE route
@campaign_bp.route('/<int:campaign_id>', methods=['DELETE'])
def delete_campaign(campaign_id):
    try:
        Campaign.query.filter_by(id=campaign_id).delete()
        db.session.commit()
        return jsonify({'message': 'Campaign deleted successfully'})
    except Exception as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Failed to delete campaign'}), 500
    