"""
@author Jacob Xie
@time 9/3/2020
"""

from .config import AppConfig
from .controller.file_upload import FileUploadController
from .controller.hello import HelloController

controllers = [
    FileUploadController,
    HelloController
]
