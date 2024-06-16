
# This file initializes the Flask app and registers the blueprints and extensions.

from flask import Flask
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from .config import DatabaseConfig, db, migrate, JWTConfig

from .blueprints import register_blueprints


def create_app(): 
    # initializing a flask application
    app = Flask(__name__)

    # load configuration settings for the database
    app.config.from_object(DatabaseConfig)
    app.config.from_object(JWTConfig) 
    
    # initialize the database with the application
    db.init_app(app)
    
    #Enable CORS
    # CORS(app)
    CORS(app, origins='*', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allow_headers=['Content-Type', 'Authorization'], supports_credentials=True)

    bcrypt = Bcrypt(app)
    # Initialize JWT
    jwt = JWTManager(app)

    # initialize the database with flask migrate
    migrate.init_app(app, db)

    # register the blueprints/routes
    register_blueprints(app)
    

    return app
