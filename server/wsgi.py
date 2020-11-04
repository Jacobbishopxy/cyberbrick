"""
@author Jacob Xie
@time 9/3/2020
"""

import logging
from flask_cors import CORS
import click

from app import create_blueprint, create_app, AppConfig, namespaces


# todo: connecting database according to `env`

@click.command()
@click.option('--env', default="dev", help="environment: dev/prod")
def start(env: str):
    if env == "prod":
        app = create_app(AppConfig.prod)
        debug = False
    else:
        app = create_app(AppConfig.dev)
        debug = True

    blueprint = create_blueprint("api", namespaces)

    CORS(blueprint)
    app.register_blueprint(blueprint, url_prefix="/api")
    gunicorn_logger = logging.getLogger("gunicorn.error")
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)

    app.run(debug=debug)


if __name__ == '__main__':
    start()
