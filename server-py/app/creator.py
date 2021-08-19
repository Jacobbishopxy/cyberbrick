"""
@author Jacob Xie
@time 11/5/2020
"""

from flask import Flask
from typing import List, Type

from .main import AppConfig
from .main.controller import Controller
from .main.util import Loader, get_loader_prefix


class PrefixMiddleware(object):

    def __init__(self, app, prefix=''):
        self.app = app
        self.prefix = prefix

    def __call__(self, environ, start_response):

        if environ['PATH_INFO'].startswith(self.prefix):
            environ['PATH_INFO'] = environ['PATH_INFO'][len(self.prefix):]
            environ['SCRIPT_NAME'] = self.prefix
            return self.app(environ, start_response)
        else:
            start_response('404', [('Content-Type', 'text/plain')])
            return ["This url does not belong to the app.".encode()]


def assemble_app(prefix: str,
                 app_cfg: AppConfig,
                 controller_list: List[Type[Controller]]):
    app = Flask(__name__)
    app.wsgi_app = PrefixMiddleware(app.wsgi_app, prefix=prefix)
    # app.url_map.strict_slashes = False
    app.config.from_object(app_cfg)

    conn = app_cfg.value.conn

    db_loader = Loader(prefix=get_loader_prefix(conn["type"]),
                       host=conn["host"],
                       port=conn["port"],
                       database=conn["database"],
                       username=conn["username"],
                       password=conn["password"])

    for n in controller_list:
        ns = n(app_cfg, db_loader)
        app.register_blueprint(ns.get_blueprint())

    return app
