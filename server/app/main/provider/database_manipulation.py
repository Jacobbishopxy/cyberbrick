"""
@author Jacob Xie
@time 11/7/2020
"""

from ..util.sql_loader import Loader, get_loader_prefix


def get_database_source(loader: Loader, db_id: str):
    q = f"SELECT * FROM storage WHERE id='{db_id}'"

    try:
        source = loader.read(q)
    except Exception:
        return "Error: illegal `db_id`"

    if not len(source):
        return "Error: source is empty"

    return source.iloc[0].to_dict()


def create_temporary_loader(conn: dict):
    return Loader(prefix=get_loader_prefix(conn["type"]),
                  host=conn["host"],
                  port=conn["port"],
                  database=conn["database"],
                  username=conn["username"],
                  password=conn["password"],
                  null_pool=True)
