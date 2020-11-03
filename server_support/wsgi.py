"""
@author Jacob Xie
@time 9/3/2020
"""

import logging
from flask_cors import CORS
from server_support.app import blueprint
from server_support.app.main import create_app

app = create_app("dev")
CORS(blueprint)
app.register_blueprint(blueprint)
gunicorn_logger = logging.getLogger("gunicorn.error")
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

if __name__ == '__main__':
    app.run(debug=True)
