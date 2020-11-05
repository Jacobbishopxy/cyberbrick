"""
@author Jacob Xie
@time 9/3/2020
"""

from .creator import create_app, create_blueprint
from .main.config import AppConfig
from .main.controller import HelloController, FileUploadController

controllers = [
    HelloController,
    FileUploadController,
]
