from db.db_connect import mongo
from bson import ObjectId


class User:
    @staticmethod
    def create(username, email, password):
        return mongo.db.users.insert_one(
            {
                "username": username,
                "email": email,
                "password": password,
                "refreshToken": "",
                "categoryNames": [],
            }
        )

    @staticmethod
    def find_by_username_or_email(identifier):
        return mongo.db.users.find_one(
            {"$or": [{"username": identifier}, {"email": identifier}]}
        )

    @staticmethod
    def find_by_id(user_id):
        return mongo.db.users.find_one({"_id": ObjectId(user_id)})

    @staticmethod
    def update_refresh_token(user_id, refresh_token):
        return mongo.db.users.update_one(
            {"_id": ObjectId(user_id)}, {"$set": {"refreshToken": refresh_token}}
        )

    @staticmethod
    def add_category(user_id, category_id):
        return mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"categoryNames": ObjectId(category_id)}},
        )

    @staticmethod
    def remove_category(user_id, category_id):
        return mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"categoryNames": ObjectId(category_id)}},
        )
