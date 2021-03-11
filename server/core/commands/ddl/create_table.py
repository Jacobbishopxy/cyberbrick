"""
@author Jacob Xie
@time 3/11/2021
"""

from typing import Dict, Any
from ..base import BaseCommand
from ...connector import Connector


class CreateTableCommand(BaseCommand):
    def __init__(self, connector: Connector, data: Dict[str, Any]):
        self._conn = connector

    def run(self):
        # self._conn.session
        pass

    def validate(self) -> None:
        pass
