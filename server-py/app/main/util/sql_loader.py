"""
@author Jacob Xie
@time 11/3/2020
"""

from typing import List, Optional, Dict
import json
import pandas as pd
import sqlalchemy as sa
from sqlalchemy.pool import NullPool
import gc


def get_loader_prefix(db_type: str):
    if db_type == "postgres":
        return "postgresql+psycopg2"
    raise Exception(f"db_type: {db_type} not found!")


class Loader(object):
    def __init__(self,
                 prefix: str,
                 host: str,
                 username: str,
                 password: str,
                 database: str,
                 port: Optional[int] = None,
                 driver: Optional[str] = None,
                 null_pool: bool = False):
        drv = '' if driver is None else f'?driver={driver}'
        pt = '' if port is None else f':{port}'
        self.conn = f'{prefix}://{username}:{password}@{host}{pt}/{database}{drv}'
        if null_pool:
            self._engine = sa.create_engine(self.conn, encoding='utf-8', poolclass=NullPool)
        else:
            self._engine = sa.create_engine(self.conn, encoding='utf-8')

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.dispose()

    def dispose(self):
        """
        dispose db connection
        """
        self._engine.dispose()
        gc.collect()

    def table_names(self):
        """
        show all table name
        """
        return self._engine.table_names()

    def execute(self, execute_str: str, **kwargs):
        """
        raw execute sql string
        """
        self._engine.execute(execute_str, **kwargs)

    def read(self, query_str: str, **kwargs):
        """
        query by sql string and return DF
        """
        return pd.read_sql(query_str, self._engine, **kwargs)

    def mutate(self, mutate_str: str, use_sa_text: bool = True):
        """
        mutation by sql string
        """
        if use_sa_text:
            self.execute(sa.text(mutate_str))
        else:
            self.execute(mutate_str)

    def insert(self,
               table_name: str,
               df: pd.DataFrame,
               index: bool = True,
               if_exists: str = "append"):
        """
        insert DF to DB
        """
        df.to_sql(table_name, con=self._engine, index=index, if_exists=if_exists)

    def get_column_info(self, table_name: str):
        """
        get column info from a table
        """
        q = f"""
        SELECT "column_name", "data_type" FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '{table_name}'
        """
        return self.read(q)

    def add_primary_uuid_key(self,
                             table_name: str,
                             key_col: str):
        """
        alter an existing column to uuid column, only worked for PostgresSql
        """

        q1 = f"""
        ALTER TABLE "{table_name}"
        ALTER COLUMN {key_col} SET DATA TYPE UUID USING (uuid_generate_v4()),
        ALTER COLUMN {key_col} SET DEFAULT uuid_generate_v4()
        """
        self._engine.execute(q1)

        q2 = f"""
        ALTER TABLE "{table_name}"
        ADD CONSTRAINT "{table_name}_{key_col}_primary" PRIMARY KEY ("{key_col}")
        """
        self._engine.execute(q2)

    def add_auto_increment_primary_key(self, table_name: str, key_col: str):
        """
        alter an existing column to uuid column, only worked for PostgresSql
        """

        q = f"""
        ALTER TABLE "{table_name}" ADD COLUMN {key_col} SERIAL PRIMARY KEY
        """
        self._engine.execute(q)

    def list_all_constraint(self, table_name: str) -> List[str]:
        """
        list all constraint from a table
        """
        q = f"""
        SELECT con.conname FROM pg_catalog.pg_constraint con
        INNER JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid
        INNER JOIN pg_catalog.pg_namespace nsp ON nsp.oid = connamespace
        WHERE rel.relname = '{table_name}'
        """

        return self.read(q)["conname"].tolist()

    def check_constraint_exists(self, table_name: str, constraint_name: str):
        return constraint_name in self.list_all_constraint(table_name)

    def create_constraint_unique(self,
                                 table_name: str,
                                 constraint_name: str,
                                 keys: List[str],
                                 if_exists_replace: bool = False):
        """
        add constraint unique keys
        """
        k = ",".join([f'"{i}"' for i in keys])

        if if_exists_replace:
            self.remove_constraint(table_name, constraint_name)

        q = f"""
        ALTER TABLE {table_name} ADD CONSTRAINT {constraint_name} UNIQUE ({k})
        """
        self.execute(q)

    def remove_constraint(self, table_name: str, constraint_name: str):
        """
        remove constraint
        """
        q = f"""
        ALTER TABLE {table_name} DROP CONSTRAINT {constraint_name}
        """
        self.execute(q)

    @staticmethod
    def gen_sql_join_str(table_names: List[str],
                         join_keys: List[str],
                         join_type: str = "INNER"):
        """
        generate sql join string
        join_type: INNER/LEFT/RIGHT/FULL
        """
        init_table_name = table_names[0]
        key_using = ",".join([f'"{k}"' for k in join_keys])
        join_str = " ".join([
            f'{join_type} JOIN "{t}" USING ({key_using})' for t in table_names[1:]
        ])
        return f'SELECT * FROM "{init_table_name}" {join_str}'

    def create_view_by_joining(self,
                               view_name: str,
                               table_names: List[str],
                               join_keys: List[str],
                               join_type: str = "INNER",
                               replace: bool = False):
        """
        create a view by join multiple tables
        """
        create_or_replace = "CREATE OR REPLACE" if replace else "CREATE"
        exec_str = f"""
        {create_or_replace} VIEW {view_name}
        AS {self.gen_sql_join_str(table_names, join_keys, join_type)}
        """
        self.execute(exec_str)

    def drop_view(self, view_name: str):
        try:
            self.execute(f'DROP VIEW "{view_name}"')
        except Exception as e:
            print(e)

    def rename_table(self, table_name: str, replacement: str):
        """
        pg only
        """
        exec_str = f"""ALTER TABLE "{table_name}" RENAME TO "{replacement}" """
        self.execute(exec_str)

    def drop_table(self, table_name: str):
        try:
            self.execute(f'DROP TABLE "{table_name}"')
        except Exception as e:
            print(e)

    def rename_columns(self, table_name: str, rename_dict: Dict[str, str]):
        exec_str_list = [
            f"""
            ALTER TABLE {table_name} RENAME "{k}" TO "{v}"
            """ for k, v in rename_dict.items()
        ]
        for e in exec_str_list:
            self.execute(e)

    def insert_json(self,
                    table_name: str,
                    df: pd.DataFrame,
                    json_cols: List[str],
                    str_cols: Optional[List[str]] = None,
                    use_sa_text: bool = True):
        cols = ",".join([f'"{c}"' for c in df.columns])
        s_cols = [] if str_cols is None else str_cols
        values = self.df2db_values(df, json_cols, s_cols)

        exec_str = f"""
        INSERT INTO {table_name}({cols})
        VALUES {values}
        """

        self.mutate(exec_str, use_sa_text)

    @staticmethod
    def json_dumps(data):
        return 'null' if data is None else json.dumps(data, ensure_ascii=False)

    def df2db_values(self, df: pd.DataFrame, json_cols: List[str], str_cols: List[str]):
        index_list = []
        for index, row in df.iterrows():
            value_list = []
            for idx, item in row.items():
                if idx in json_cols:
                    _context = self.json_dumps(item).replace("'", "''").replace("%", "%%")
                    value_list.append(f"'{_context}'")
                else:
                    if idx in str_cols:
                        value_list.append(f"'{str(item)}'")
                    else:
                        value_list.append(str(item))

            row_value = "(" + ",".join(value_list) + ")"
            index_list.append(row_value)
        return ",".join(index_list)
