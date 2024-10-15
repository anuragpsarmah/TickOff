from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from models.user import User
from utils.response_util import response
from config import JWT_SECRET_KEY


def register_user():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not all([username, email, password]):
        return response(400, "Missing fields received")

    existing_user = User.find_by_username_or_email(
        username
    ) or User.find_by_username_or_email(email)
    if existing_user:
        return response(400, "User already exists")

    hashed_password = generate_password_hash(password)
    User.create(username, email, hashed_password)

    return response(200, "User registered successfully")


def login_user():
    data = request.json
    identifier = data.get("identifier")
    password = data.get("password")

    if not all([identifier, password]):
        return response(400, "Missing fields received")

    user = User.find_by_username_or_email(identifier)
    if not user or not check_password_hash(user["password"], password):
        return response(401, "Invalid credentials")

    access_token = jwt.encode(
        {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "exp": datetime.utcnow() + timedelta(days=15),
        },
        JWT_SECRET_KEY,
        algorithm="HS256",
    )

    refresh_token = jwt.encode(
        {"id": str(user["_id"]), "exp": datetime.utcnow() + timedelta(days=15)},
        JWT_SECRET_KEY,
        algorithm="HS256",
    )

    User.update_refresh_token(user["_id"], refresh_token)

    resp = jsonify(
        {
            "message": "User logged in successfully",
            "data": {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
            },
            "error": "none",
        }
    )
    resp.set_cookie(
        "accessToken", access_token, httponly=True, secure=True, samesite="None"
    )
    resp.set_cookie(
        "refreshToken", refresh_token, httponly=True, secure=True, samesite="None"
    )
    return resp, 200


def logout():
    user_id = request.json.get("userid")
    if not user_id:
        return response(400, "Failed to log out user")

    User.update_refresh_token(user_id, "")

    resp = jsonify(
        {"message": "User logged out successfully", "data": "none", "error": "none"}
    )
    resp.set_cookie("accessToken", "", httponly=True, secure=True, samesite="None")
    resp.set_cookie("refreshToken", "", httponly=True, secure=True, samesite="None")
    return resp, 200


def validation():
    return response(200, "Validated successfully", request.user)
