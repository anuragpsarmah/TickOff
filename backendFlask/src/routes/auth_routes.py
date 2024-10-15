from flask import Blueprint
from controllers.auth_controller import register_user, login_user, logout, validation
from middlewares.auth_middleware import auth_validation

auth_bp = Blueprint("auth", __name__)

auth_bp.route("/register", methods=["POST"])(register_user)
auth_bp.route("/login", methods=["POST"])(login_user)
auth_bp.route("/logout", methods=["POST"])(logout)
auth_bp.route("/validation", methods=["GET"])(auth_validation(validation))
