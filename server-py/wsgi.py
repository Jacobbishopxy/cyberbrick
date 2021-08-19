"""
@author Jacob Xie
@time 9/3/2020
"""

from flask_cors import CORS
import click
from gevent.pywsgi import WSGIServer

from app import assemble_app, AppConfig, controllers


@click.command()
@click.option('--env', default="dev", help="environment: dev/prod")
@click.option('--debug', default="default", help="debug: default/true/false")
def start(env: str, debug: str):
    cfg = AppConfig.prod if env == "prod" else AppConfig.dev
    host, port = "0.0.0.0", cfg.value.server_port

    app = assemble_app("/api", cfg, controllers)
    CORS(app)

    if env == "prod":
        http_server = WSGIServer((host, port), app)
        print(f"App listening on port {port}")
        http_server.serve_forever()
    else:
        if debug == "default":
            dbg = cfg.value.DEBUG
        else:
            dbg = True if debug == "true" else False
        app.run(debug=dbg, host=host, port=port)


if __name__ == '__main__':
    start()
