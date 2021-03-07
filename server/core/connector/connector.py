"""
@author Jacob Xie
@time 3/6/2021
"""

from sqlalchemy.exc import OperationalError
from sqlalchemy.engine.base import Engine, Connection
from sqlalchemy.sql.schema import MetaData

from ..exceptions import CyberbrickException


class Connector(object):

    def __init__(self, engine: Engine) -> None:
        self._engine = engine
        try:
            self._conn = self._engine.connect()
        except OperationalError as e:
            raise CyberbrickException(e)
        self._meta = MetaData()
        self._meta.reflect(bind=self._engine)

    @property
    def closed(self) -> bool:
        return self._conn.closed

    @property
    def engin(self) -> Engine:
        return self._engine

    @property
    def conn(self) -> Connection:
        return self._conn

    @property
    def meta(self) -> MetaData:
        return self._meta

    def close(self):
        self._conn.close()

    def dispose(self):
        self._engine.dispose()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # todo: `self._conn.dispose()` condition
        self.close()
