"""
@author Jacob Xie
@time 11/5/2020
"""

from typing import Optional
from flask import abort, Blueprint, request, jsonify, make_response
import pandas as pd
import json

from .abstract_controller import Controller
from ..config import AppConfig
from ..util.sql_loader import Loader
from ..provider.file_upload import xlsx_file, xlsx_file_type, extract_xlsx
from ..provider.database_manipulation import get_database_source, create_temporary_loader

res_success = {"message": "Created", "code": "SUCCESS"}
res_failure = {"message": "Created", "code": "FAILURE"}


def _create_temp_loader(storage_loader: Loader, db_id: Optional[str]):
    if db_id is None:
        return abort(400, "Error: database `id` not found")

    temp_db_conn = get_database_source(storage_loader, db_id)
    if isinstance(temp_db_conn, str):
        return abort(400, temp_db_conn)

    return create_temporary_loader(temp_db_conn)


class DatabaseManipulationController(Controller):

    def __init__(self, env: AppConfig, db_loader: Loader, *args, **kwargs):
        super().__init__(env)
        self.conn = self.show_env().value.conn
        self.loader = db_loader

    def get_blueprint(self) -> Blueprint:
        bp = Blueprint("database", __name__, url_prefix="/database")

        @bp.route("/view-storage")
        def view_storage_api():
            q = f"""SELECT * FROM storage"""
            d = self.loader.read(q)
            return jsonify(d.to_dict(orient="records"))

        @bp.route("/list-table")
        def list_table_api():
            """
            list table names in a database (id specified in storage)
            """
            db_id = request.args.get("id")

            temp_loader = _create_temp_loader(self.loader, db_id)
            names = temp_loader.table_names()
            temp_loader.dispose()

            return jsonify(names)

        @bp.route("/gen-uuid-key", strict_slashes=False, methods=["POST"])
        def gen_uuid_key_api():
            """
            generate a primary uuid key fow a raw table in a database (id specified in storage)
            """
            db_id = request.args.get("id")
            table_name = request.json.get("tableName")
            key_col = request.json.get("keyColumn")

            if table_name is None:
                return abort(400, "Error: `tableName` is required in body")
            if key_col is None:
                return abort(400, "Error: `keyColumn` is required in body")

            temp_loader = _create_temp_loader(self.loader, db_id)

            try:
                temp_loader.add_primary_uuid_key(table_name, key_col)
            except Exception as e:
                temp_loader.dispose()
                return make_response(str(e), 400)

            temp_loader.dispose()

            return make_response(jsonify(res_success), 201)

        # todo: options: file format
        @bp.route("/insert-by-file", strict_slashes=False, methods=["POST"])
        def insert_by_xlsx_api():
            """
            insert xlsx file to a database (id specified in storage)
            append to existing table when insertOption == "append"
            """
            f = request.files.get(xlsx_file)
            db_id = request.args.get("id")
            insert_option = request.args.get("insertOption")
            insert_option = "replace" if insert_option is None else insert_option

            if f is None:
                return abort(400, "Error: `file` is required")
            if f.content_type != xlsx_file_type:
                return abort(400, "Error: file must be .xlsx")
            if insert_option not in ["replace", "append", "fail"]:
                return abort(400, "Error: `insertOption` should be replace/append/fail")

            temp_loader = _create_temp_loader(self.loader, db_id)

            d = extract_xlsx(f, param_head=True, param_multi_sheets=True)

            for key, value in d.items():
                try:
                    temp_loader.insert(key, value, if_exists=insert_option)
                    if insert_option == "replace":
                        temp_loader.add_primary_uuid_key(key, "index")
                except Exception as e:
                    temp_loader.dispose()
                    return make_response(str(e), 400)

            temp_loader.dispose()

            return make_response(jsonify(res_success), 201)

        @bp.route("/insert", strict_slashes=False, methods=["POST"])
        def insert_table_api():
            """
            insert data into a database's (id specified in storage) table
            """
            db_id = request.args.get("id")
            table_name = request.args.get("tableName")
            insert_option = request.args.get("insertOption")
            insert_option = "append" if insert_option is None else insert_option
            data = request.json

            if not isinstance(data, list):
                return abort(400, "Error: json must be a list of plain objects which keys represent column name")

            if insert_option not in ["replace", "append", "fail"]:
                return abort(400, "Error: `insertOption` should be replace/append/fail")

            temp_loader = _create_temp_loader(self.loader, db_id)

            try:
                d = pd.DataFrame(data)
                if insert_option == "append":
                    temp_loader.insert(table_name, d, index=False, if_exists=insert_option)
                else:
                    temp_loader.insert(table_name, d, if_exists=insert_option)
            except Exception as e:
                temp_loader.dispose()
                return make_response(str(e), 400)

            temp_loader.dispose()

            return make_response(jsonify(res_success), 201)

        @bp.route("/update", strict_slashes=False, methods=["POST"])
        def update_table_api():
            """
            update existing table in a database (id specified in storage)
            """
            db_id = request.args.get("id")
            table_name = request.args.get("tableName")
            item_id = request.args.get("itemId")
            data = request.json

            if table_name is None:
                return abort(400, "Error: `tableName` is required")
            if item_id is None:
                return abort(400, "Error: `itemId` is required")
            if not isinstance(data, dict):
                return abort(400, "Error: json must be a plain object which keys represent column name")

            temp_loader = _create_temp_loader(self.loader, db_id)

            try:
                stringify_data = ",".join([f"\"{key}\" = '{value}'" for key, value in data.items()])
                q = f"""
                UPDATE {table_name}
                SET {stringify_data}
                WHERE index='{item_id}'
                """
                temp_loader.execute(q)
            except Exception as e:
                temp_loader.dispose()
                return make_response(str(e), 400)

            temp_loader.dispose()

            return make_response(jsonify(res_success), 201)

        @bp.route("/read", strict_slashes=False, methods=["POST"])
        def read_table_api():
            """
            read data from a database (id specified in storage)
            """
            db_id = request.args.get("id")
            query_str = request.json.get("query")

            if query_str is None:
                return abort(400, "Error: `query` is required")

            temp_loader = _create_temp_loader(self.loader, db_id)
            try:
                data = temp_loader.read(query_str)
            except Exception as e:
                temp_loader.dispose()
                return make_response(str(e), 400)

            temp_loader.dispose()

            return jsonify(json.loads(data.to_json(orient="records")))

        return bp
