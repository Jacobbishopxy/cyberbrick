"""
@author Jacob Xie
@time 3/6/2021
"""

import sqlalchemy
from sqlalchemy.engine.base import Engine, Connection

from ..exceptions import CyberbrickException


class Connector(object):

    def __init__(self, engine: Engine) -> None:
        self._engine = engine
        try:
            self._conn = self._engine.connect()
        except sqlalchemy.exc.OperationalError as e:
            raise CyberbrickException(e)

    @property
    def closed(self) -> bool:
        return self._conn.closed

    @property
    def engin(self) -> Engine:
        return self._engine

    @property
    def conn(self) -> Connection:
        return self._conn

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # todo: `self._conn.dispose()` condition
        self._conn.close()
