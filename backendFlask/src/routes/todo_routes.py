from flask import Blueprint
from controllers.todo_controller import (
    get_todo_category,
    create_todo_category,
    get_todo,
    create_todo,
    toggle_todo,
    delete_todo_category,
    delete_todo,
)
from middlewares.auth_middleware import auth_validation

todo_bp = Blueprint("todo", __name__)

todo_bp.route("/getToDoCategory", methods=["GET"])(auth_validation(get_todo_category))
todo_bp.route("/createToDoCategory", methods=["POST"])(
    auth_validation(create_todo_category)
)
todo_bp.route("/deleteToDoCategory", methods=["DELETE"])(
    auth_validation(delete_todo_category)
)
todo_bp.route("/getToDo", methods=["GET"])(auth_validation(get_todo))
todo_bp.route("/createToDo", methods=["POST"])(auth_validation(create_todo))
todo_bp.route("/deleteToDo", methods=["DELETE"])(auth_validation(delete_todo))
todo_bp.route("/toggleToDo", methods=["GET"])(auth_validation(toggle_todo))
