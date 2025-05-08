from flask import jsonify, request

def get_data():
    return jsonify({"data": [1, 2, 3, 4]})

def post_data():
    data = request.json
    return jsonify({"received": data})
