"""
@author Jacob Xie
@time 9/3/2020
"""


from flask import Flask
from flask_restx import Api

from .config import AppConfig

api = Api()


def create_app(app_cfg: AppConfig):
    app = Flask(__name__)
    app.config.from_object(app_cfg)
    api.init_app(app)

    return app
