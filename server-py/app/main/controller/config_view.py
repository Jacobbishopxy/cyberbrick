"""
@author Jacob Xie
@time 11/5/2020
"""

from flask import Blueprint, jsonify

from .abstract_controller import Controller
from ..config import AppConfig


class ConfigViewController(Controller):

    def __init__(self, env: AppConfig, *args, **kwargs):
        super().__init__(env)

    def get_blueprint(self) -> Blueprint:
        bp = Blueprint("config", __name__, url_prefix="/config")

        @bp.route("/view")
        def get():
            return jsonify(self.show_env().value.conn)

        return bp
