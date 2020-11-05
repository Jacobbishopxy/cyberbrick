"""
@author Jacob Xie
@time 9/3/2020
"""

from .config import AppConfig
from .controller.file_upload import FileUploadController
from .controller.config_view import ConfigViewController
from .controller.database_view import DatabaseViewController

controllers = [
    FileUploadController,
    ConfigViewController,
    DatabaseViewController,
]
