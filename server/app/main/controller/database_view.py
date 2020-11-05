"""
@author Jacob Xie
@time 11/5/2020
"""

from flask import Blueprint, jsonify

from .abstract_controller import Controller
from ..config import AppConfig
from ..util.sql_loader import Loader, get_loader_prefix


class DatabaseViewController(Controller):

    def __init__(self, env: AppConfig):
        super().__init__(env)
        self.conn = self.show_env().value.conn
        self.loader = Loader(prefix=get_loader_prefix(self.conn["type"]),
                             host=self.conn["host"],
                             port=self.conn["port"],
                             database=self.conn["database"],
                             username=self.conn["username"],
                             password=self.conn["password"])

    def get_blueprint(self) -> Blueprint:
        ns = Blueprint("database", __name__, url_prefix="/database")

        @ns.route("/view")
        def get():
            q = f"""
            SELECT * FROM storage
            """
            d = self.loader.read(q)
            return jsonify(d.to_dict(orient="records"))

        return ns
