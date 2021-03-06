"""
@author Jacob Xie
@time 3/6/2021
"""

from typing import Optional
from dataclasses import dataclass
from sqlalchemy.engine.url import URL
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.sql import Select


@dataclass
class Url:
    drivername: str
    username: Optional[str] = None
    password: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    database: Optional[str] = None
    query: Optional[str] = None

    def to_dict(self) -> dict:
        return {
            "drivername": self.drivername,
            "username": self.username,
            "password": self.password,
            "host": self.host,
            "port": self.port,
            "database": self.database,
            "query": self.query,
        }

    def to_url(self) -> URL:
        return URL(**self.to_dict())
