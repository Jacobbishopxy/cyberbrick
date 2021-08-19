"""
@author Jacob Xie
@time 11/4/2020
"""

from sqlalchemy import create_engine, Column, Integer, String, Enum as EnumType
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from enum import Enum
import datetime

# SQLALCHEMY_DATABASE_URL = ""
#
# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
# SessionLocal = sessionmaker(autocommit=False,
#                             autoflush=False,
#                             bind=engine)

Base = declarative_base()


class DictMixIn:
    def to_dict(self):
        return {
            column.name: getattr(self, column.name)
            if not isinstance(
                getattr(self, column.name), (datetime.datetime, datetime.date)
            )
            else getattr(self, column.name).isoformat()
            for column in self.__table__.columns
        }


class StorageType(Enum):
    PG = "postgres"


class Storage(Base, DictMixIn):
    __tablename__ = "Storage"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    type = Column(EnumType(StorageType))
    host = Column(String)
    port = Column(Integer)
    database = Column(String)
    username = Column(String)
    password = Column(String)
