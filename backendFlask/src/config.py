import os
from dotenv import load_dotenv

# Get the path to the directory this file is in
BASEDIR = os.path.abspath(os.path.dirname(__file__))

# Connect the path with your '.env' file name
load_dotenv(os.path.join(BASEDIR, "..", ".env"))

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")
JWT_SECRET_KEY = os.getenv("JWT_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL")
PORT = int(os.getenv("PORT", 5000))

# Flask-PyMongo expects MONGO_URI
MONGO_URI = f"{MONGODB_URI}/{DB_NAME}"
