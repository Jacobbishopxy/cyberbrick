"""
@author Jacob Xie
@time 11/4/2020
"""

from enum import Enum
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class StorageType(Enum):
    PG = "postgres"


class Storage(db.Model):
    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String(), nullable=False)
    description = db.Column(db.String(), nullable=True)
    type = db.Column(db.Enum(StorageType))
    host = db.Column(db.String())
    port = db.Column(db.Integer())
    database = db.Column(db.String())
    username = db.Column(db.String())
    password = db.Column(db.String())
