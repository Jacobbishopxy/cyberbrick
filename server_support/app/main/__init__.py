"""
@author Jacob Xie
@time 9/3/2020
"""


from flask import Flask
from flask_restx import Api

from .config import config_by_name

api = Api()


def create_app(config_name: str):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    api.init_app(app)

    return app
