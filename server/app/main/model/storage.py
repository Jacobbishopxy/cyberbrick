"""
@author Jacob Xie
@time 11/4/2020
"""

from enum import Enum
from typing import Optional


class StorageType(Enum):
    PG = "postgres"


class Storage(object):
    def __init__(self,
                 id: Optional[str],
                 name: str,
                 description: Optional[str],
                 type: StorageType,
                 host: str,
                 port: int,
                 database: str,
                 username: str,
                 password: str):
        self.id = id
        self.name = name
        self.description = description
        self.type = type
        self.host = host
        self.port = port
        self.database = database
        self.username = username
        self.password = password
