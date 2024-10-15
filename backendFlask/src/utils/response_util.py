from flask import jsonify
from bson import ObjectId


def serialize_data(data):
    if isinstance(data, list):
        return [serialize_data(item) for item in data]
    elif isinstance(data, dict):
        return {key: serialize_data(value) for key, value in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    return data


def response(status, message, data=None, error=None):
    if data is None:
        data = []

    serialized_data = serialize_data(data)

    return (
        jsonify(
            {"message": message, "error": error or "None", "data": serialized_data}
        ),
        status,
    )
