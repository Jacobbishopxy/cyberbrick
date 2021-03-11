"""
@author Jacob Xie
@time 3/11/2021
"""

from typing import Optional
from sqlalchemy import Table
from sqlalchemy.ext.declarative import declarative_base

from .connector import Connector

Base = declarative_base()


class Loader(object):

    def __init__(self, connector: Connector) -> None:
        self._conn = connector

    def table(self, name: str) -> Optional[Table]:
        return self._conn.meta.tables.get(name)

    def table_cls(self, name: str) -> Optional[Base]:
        t = self.table(name)
        if t is None:
            return None

        class Cls(Base):
            __table__ = t

        return Cls
