from functools import wraps
from flask import request
import jwt
from utils.response_util import response
from config import JWT_SECRET_KEY


def auth_validation(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        access_token = request.cookies.get("accessToken")
        if not access_token:
            return response(401, "Unauthorized Access")

        try:
            decoded = jwt.decode(access_token, JWT_SECRET_KEY, algorithms=["HS256"])
            request.user = decoded
        except jwt.ExpiredSignatureError:
            return response(401, "Token has expired")
        except jwt.InvalidTokenError:
            return response(401, "Invalid token")

        return f(*args, **kwargs)

    return decorated
