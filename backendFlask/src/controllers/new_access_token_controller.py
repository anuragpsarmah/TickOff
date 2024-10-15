from flask import request, jsonify
import jwt
from datetime import datetime, timedelta
from models.user import User
from utils.response_util import response
from config import JWT_SECRET_KEY


def new_access_token():
    refresh_token = request.cookies.get("refreshToken")
    if not refresh_token:
        return response(401, "Refresh Token was not sent")

    try:
        decoded = jwt.decode(refresh_token, JWT_SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["id"]

        user = User.find_by_id(user_id)
        if not user or refresh_token != user["refreshToken"]:
            return response(401, "Unauthorized access was found")

        new_access_token = jwt.encode(
            {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
                "exp": datetime.utcnow() + timedelta(minutes=15),
            },
            JWT_SECRET_KEY,
            algorithm="HS256",
        )

        new_refresh_token = jwt.encode(
            {"id": str(user["_id"]), "exp": datetime.utcnow() + timedelta(days=15)},
            JWT_SECRET_KEY,
            algorithm="HS256",
        )

        User.update_refresh_token(user["_id"], new_refresh_token)

        resp = jsonify(
            {
                "message": "User authorized successfully",
                "data": {
                    "id": str(user["_id"]),
                    "username": user["username"],
                    "email": user["email"],
                },
                "error": "none",
            }
        )
        resp.set_cookie(
            "accessToken", new_access_token, httponly=True, secure=True, samesite="None"
        )
        resp.set_cookie(
            "refreshToken",
            new_refresh_token,
            httponly=True,
            secure=True,
            samesite="None",
        )
        return resp, 200

    except jwt.ExpiredSignatureError:
        return response(401, "Refresh token has expired")
    except jwt.InvalidTokenError:
        return response(401, "Invalid refresh token")
