"""
@author Jacob Xie
@time 11/5/2020
"""

from flask_restx import Resource, Namespace

from .abstract_controller import Controller
from ..config import AppConfig


class ConfigViewController(Controller):

    def __init__(self, env: AppConfig):
        super().__init__(env)

    def get_namespace(self) -> Namespace:
        namespace = Namespace("config")

        @namespace.route("/view")
        class R(Resource):

            @staticmethod
            def get():
                return self.show_env().value

        return namespace
