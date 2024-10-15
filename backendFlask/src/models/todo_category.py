from db.db_connect import mongo
from bson import ObjectId


class TodoCategory:
    @staticmethod
    def create(category_name, user_id):
        return mongo.db.todo_categories.insert_one(
            {"categoryName": category_name, "userId": ObjectId(user_id), "todos": []}
        )

    @staticmethod
    def find_by_user(user_id):
        return mongo.db.todo_categories.find({"userId": ObjectId(user_id)})

    @staticmethod
    def find_by_name_and_user(category_name, user_id):
        return mongo.db.todo_categories.find_one(
            {"categoryName": category_name, "userId": ObjectId(user_id)}
        )

    @staticmethod
    def delete(category_id):
        return mongo.db.todo_categories.delete_one({"_id": ObjectId(category_id)})

    @staticmethod
    def add_todo(category_id, todo_id):
        return mongo.db.todo_categories.update_one(
            {"_id": ObjectId(category_id)}, {"$push": {"todos": ObjectId(todo_id)}}
        )

    @staticmethod
    def remove_todo(category_id, todo_id):
        return mongo.db.todo_categories.update_one(
            {"_id": ObjectId(category_id)}, {"$pull": {"todos": ObjectId(todo_id)}}
        )
