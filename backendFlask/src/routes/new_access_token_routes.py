from flask import Blueprint
from controllers.new_access_token_controller import new_access_token

token_bp = Blueprint("token", __name__)

token_bp.route("/newToken", methods=["GET"])(new_access_token)
