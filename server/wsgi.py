"""
@author Jacob Xie
@time 9/3/2020
"""

import logging
from flask_cors import CORS
import click

from app import create_app, AppConfig, create_blueprint, controllers


@click.command()
@click.option('--env', default="dev", help="environment: dev/prod")
def start(env: str):
    if env == "prod":
        cfg = AppConfig.prod
        debug = False
    else:
        cfg = AppConfig.dev
        debug = True

    app = create_app(cfg)
    blueprint = create_blueprint(cfg, controllers)

    CORS(blueprint)
    app.register_blueprint(blueprint, url_prefix="/api")
    gunicorn_logger = logging.getLogger("gunicorn.error")
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)

    app.run(debug=debug)


if __name__ == '__main__':
    start()
