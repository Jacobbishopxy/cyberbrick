"""
@author Jacob Xie
@time 9/3/2020
"""

from .config import AppConfig
from .controller.file_upload import ns as fu_namespace
from .controller.hello import ns as hl_namespace

namespaces = [
    fu_namespace,
    hl_namespace
]
