from flask import Blueprint
from controllers.data_controller import get_data, post_data

data_bp = Blueprint('data', __name__)

data_bp.route("/api/data", methods=["GET"])(get_data)
data_bp.route("/api/data", methods=["POST"])(post_data)
