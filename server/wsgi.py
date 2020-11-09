"""
@author Jacob Xie
@time 9/3/2020
"""

from flask_cors import CORS
import click
from gevent.pywsgi import WSGIServer

from app import create_app, AppConfig, controllers


@click.command()
@click.option('--env', default="dev", help="environment: dev/prod")
def start(env: str):
    cfg = AppConfig.prod if env == "prod" else AppConfig.dev
    host, port = "0.0.0.0", cfg.value.server_port

    app = create_app("/api", cfg, controllers)
    CORS(app)

    if env == "prod":
        http_server = WSGIServer((host, port), app)
        print(f"App listening on port {port}")
        http_server.serve_forever()
    else:
        app.run(debug=cfg.value.DEBUG, host=host, port=port)


if __name__ == '__main__':
    start()
