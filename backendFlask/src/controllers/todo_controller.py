from flask import request
from bson import ObjectId
from models.todo_category import TodoCategory
from models.todo import Todo
from models.user import User
from utils.response_util import response


def get_todo_category():
    user = request.user
    if not user:
        return response(404, "Something went wrong. Clear cookies.")

    todo_categories = list(TodoCategory.find_by_user(user["id"]))
    return response(200, "Categories fetched successfully", todo_categories)


def create_todo_category():
    user = request.user
    if not user:
        return response(404, "Cannot fetch categories. Clear cookies.")

    category_name = request.json.get("categoryName")
    if not category_name:
        return response(400, "Category name is required")

    existing_category = TodoCategory.find_by_name_and_user(category_name, user["id"])
    if existing_category:
        return response(400, "Category already exists")

    new_category = TodoCategory.create(category_name, user["id"])
    User.add_category(user["id"], new_category.inserted_id)

    return response(200, "Category created successfully")


def delete_todo_category():
    user = request.user
    if not user:
        return response(404, "Something went wrong. Clear cookies.")

    category_id = request.args.get("id")
    if not category_id:
        return response(400, "Category id param was not sent")

    TodoCategory.delete(category_id)
    Todo.delete_by_category(category_id)
    User.remove_category(user["id"], category_id)

    return response(200, "Category deleted successfully")


def get_todo():
    user = request.user
    if not user:
        return response(404, "Something went wrong. Clear cookies.")

    category_id = request.args.get("categoryId")
    if not category_id:
        return response(400, "Category Id param not received")

    todos = list(Todo.find_by_category(category_id))
    return response(200, "ToDos fetched successfully", todos)


def create_todo():
    user = request.user
    if not user:
        return response(404, "Something went wrong. Clear cookies.")

    data = request.json
    title = data.get("title")
    description = data.get("description")
    deadline = data.get("deadline")
    todo_category_id = data.get("todoCategoryId")

    if not all([title, description, deadline, todo_category_id]):
        return response(400, "Missing fields were received")

    todo = Todo.create(title, description, deadline, todo_category_id)
    TodoCategory.add_todo(todo_category_id, todo.inserted_id)

    return response(200, "Todos added successfully")


def toggle_todo():
    user = request.user
    if not user:
        return response(404, "Something went wrong. Clear cookies.")

    todo_id = request.args.get("todoId")
    if not todo_id:
        return response(400, "ToDo Id param not received")

    updated_todo = Todo.toggle_completion(todo_id)
    return response(200, "ToDo completion toggled successfully", updated_todo)


def delete_todo():
    user = request.user
    if not user:
        return response(404, "Something went wrong. Clear cookies.")

    todo_id = request.args.get("id")
    if not todo_id:
        return response(400, "ToDo Id param not received")

    todo = Todo.find_by_id(todo_id)
    if todo:
        Todo.delete(todo_id)
        TodoCategory.remove_todo(todo["todoCategoryId"], todo_id)
        return response(200, "Todo deleted successfully")
    else:
        return response(404, "Todo not found")
