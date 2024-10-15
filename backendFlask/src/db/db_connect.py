from flask_pymongo import PyMongo
from constants import DB_RETRIES
import time

mongo = PyMongo()


def init_db(app):
    retries = DB_RETRIES
    while retries > 0:
        try:
            print("Trying to connect to database")
            # The connection is now handled by Flask-PyMongo
            print(f"Database connected successfully at: {app.config['MONGO_URI']}")
            return
        except Exception as error:
            print("Error connecting to database:", error)
            if retries == 1:
                raise
            retries -= 1
            time.sleep(1)
