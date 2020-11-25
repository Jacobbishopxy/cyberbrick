"""
@author Jacob Xie
@time 11/7/2020
"""

from ..util import Loader, get_loader_prefix


def get_database_source(loader: Loader, db_id: str):
    q = f"SELECT * FROM storage WHERE id='{db_id}'"

    try:
        source = loader.read(q)
    except Exception:
        return "Error: illegal `db_id`"

    if not len(source):
        return "Error: source is empty"

    return source.iloc[0].to_dict()


def gen_update_string(table_name: str, item_id: str, data: dict):
    stringify_data = ",".join([f"\"{key}\" = '{value}'" for key, value in data.items()])
    return f"UPDATE {table_name} SET {stringify_data} WHERE index='{item_id}'"


def gen_delete_string(table_name: str, item_id: str):
    return f"DELETE FROM {table_name} WHERE index='{item_id}'"


def create_temporary_loader(conn: dict):
    return Loader(prefix=get_loader_prefix(conn["type"]),
                  host=conn["host"],
                  port=conn["port"],
                  database=conn["database"],
                  username=conn["username"],
                  password=conn["password"],
                  null_pool=True)
