from db.db_connect import mongo
from bson import ObjectId


class Todo:
    @staticmethod
    def create(title, description, deadline, todo_category_id):
        return mongo.db.todos.insert_one(
            {
                "title": title,
                "description": description,
                "deadline": deadline,
                "isComplete": False,
                "todoCategoryId": ObjectId(todo_category_id),
            }
        )

    @staticmethod
    def find_by_category(todo_category_id):
        return mongo.db.todos.find({"todoCategoryId": ObjectId(todo_category_id)})

    @staticmethod
    def find_by_id(todo_id):
        return mongo.db.todos.find_one({"_id": ObjectId(todo_id)})

    @staticmethod
    def toggle_completion(todo_id):
        todo = mongo.db.todos.find_one({"_id": ObjectId(todo_id)})
        if todo:
            mongo.db.todos.update_one(
                {"_id": ObjectId(todo_id)},
                {"$set": {"isComplete": not todo["isComplete"]}},
            )
        return todo

    @staticmethod
    def delete(todo_id):
        return mongo.db.todos.delete_one({"_id": ObjectId(todo_id)})

    @staticmethod
    def delete_by_category(category_id):
        return mongo.db.todos.delete_many({"todoCategoryId": ObjectId(category_id)})
