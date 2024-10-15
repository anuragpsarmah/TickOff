from flask import Flask
from flask_cors import CORS
from db.db_connect import init_db, mongo
from routes.auth_routes import auth_bp
from routes.todo_routes import todo_bp
from routes.new_access_token_routes import token_bp
import config

app = Flask(__name__)

# Load configuration
app.config.from_object(config)

# Initialize database
mongo.init_app(app)

# CORS configuration
CORS(
    app,
    origins=[app.config["FRONTEND_URL"], "http://localhost:5173"],
    supports_credentials=True,
)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(todo_bp, url_prefix="/api/todo")
app.register_blueprint(token_bp, url_prefix="/api/token")

if __name__ == "__main__":
    app.run(debug=True, port=app.config["PORT"])
