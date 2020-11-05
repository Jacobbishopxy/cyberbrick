"""
@author Jacob Xie
@time 9/3/2020
"""

from flask_restx import Resource, Namespace

from .abstract_controller import Controller
from ..config import AppConfig


class HelloController(Controller):

    def __init__(self, env: AppConfig):
        super().__init__(env)

    def get_namespace(self) -> Namespace:
        namespace = Namespace("hello")

        @namespace.route("/")
        class R(Resource):

            @staticmethod
            def get():
                return f"Hello: {self.show_env().value.conn}"

        return namespace
