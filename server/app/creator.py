"""
@author Jacob Xie
@time 11/5/2020
"""

from flask import Flask
from flask_restx import Api
from flask import Blueprint
from typing import List, Type

from .main import AppConfig
from .main.controller import Controller


def create_app(app_cfg: AppConfig):
    app = Flask(__name__)
    # app.url_map.strict_slashes = False
    app.config.from_object(app_cfg)

    api = Api()
    api.init_app(app)

    return app


def create_blueprint(app_cfg: AppConfig,
                     controller_list: List[Type[Controller]]):
    blueprint = Blueprint("api", __name__)

    api = Api(blueprint,
              title='CyberBrick-api',
              version='1.0',
              description='CyberBrick service')

    for n in controller_list:
        ns = n(app_cfg)
        api.add_namespace(ns.get_namespace())

    return blueprint
