"""
@author Jacob Xie
@time 9/3/2020
"""

from flask import Flask
from flask_restx import Api
from flask import Blueprint

from .main import AppConfig, namespaces


def create_blueprint(name: str, namespace_list: list):
    blueprint = Blueprint(name, __name__)

    api = Api(blueprint,
              title='CyberBrick-api',
              version='1.0',
              description='CyberBrick service')

    for n in namespace_list:
        api.add_namespace(n)

    return blueprint


def create_app(app_cfg: AppConfig):
    app = Flask(__name__)
    app.url_map.strict_slashes = False
    app.config.from_object(app_cfg)

    api = Api()
    api.init_app(app)

    return app
