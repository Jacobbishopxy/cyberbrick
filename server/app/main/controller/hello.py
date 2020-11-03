"""
@author Jacob Xie
@time 9/3/2020
"""

from flask_restx import Resource, Namespace

ns = Namespace("hello")


@ns.route("/hello")
class HelloWorld(Resource):

    @staticmethod
    def get():
        return "Hello World!"
