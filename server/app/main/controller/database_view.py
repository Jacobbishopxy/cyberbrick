"""
@author Jacob Xie
@time 11/5/2020
"""

from flask_restx import Resource, Namespace, reqparse
from ..util.sql_loader import Loader

ns = Namespace("database", description="database connections")


@ns.route("/", strict_slashes=False)
class DatabaseViewAPI(Resource):
    pass
