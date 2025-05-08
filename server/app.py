from flask import Flask
from flask_cors import CORS
from routes.data_routes import data_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(data_bp)

if __name__ == "__main__":
    app.run(debug=True)
