"""
@author Jacob Xie
@time 9/3/2020
"""

from flask_restx import Api
from flask import Blueprint

from .main.controller.file_upload import ns as fu_namespace
from .main.controller.hello import ns as hl_namespace

blueprint = Blueprint('api', __name__)

api = Api(blueprint,
          title='spreadsheet-api',
          version='1.0',
          description='flask-spreadsheet service')

api.add_namespace(fu_namespace, path='/api')
api.add_namespace(hl_namespace, path='/api')
