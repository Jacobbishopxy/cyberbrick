"""
@author Jacob Xie
@time 9/3/2021
"""

from typing import List, Optional
from enum import Enum
from dataclasses import dataclass
from sqlalchemy import String, Float, Integer


class CyberbrickType(Enum):
    INTEGER = Integer
    NUMBER = Float
    STRING = String


@dataclass
class CyberbrickColumn:
    name: str
    type: CyberbrickType
    primary: Optional[bool] = None
    index: Optional[bool] = None


@dataclass
class CyberbrickTable:
    name: str
    columns: List[CyberbrickColumn]
