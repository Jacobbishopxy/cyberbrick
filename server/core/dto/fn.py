"""
@author Jacob Xie
@time 9/3/2021
"""

from .table import CyberbrickColumn, CyberbrickTable
from sqlalchemy import MetaData, Table, Column


def to_column(c: CyberbrickColumn) -> Column:
    return Column(c.name, c.type.value, primary_key=c.primary, index=c.index)


def to_table(d: CyberbrickTable, meta: MetaData) -> Table:
    cols = [to_column(c) for c in d.columns]
    return Table(d.name, meta, *cols)
