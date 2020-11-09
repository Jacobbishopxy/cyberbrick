"""
@author Jacob Xie
@time 11/5/2020
"""

from flask import abort, Blueprint, request, jsonify, make_response
import json

from .abstract_controller import Controller
from ..config import AppConfig
from ..util.sql_loader import Loader
from ..provider.file_upload import xlsx_file, xlsx_file_type, extract_xlsx
from ..provider.database_manipulation import get_database_source, create_temporary_loader

res_success = {"message": "Created", "code": "SUCCESS"}
res_failure = {"message": "Created", "code": "FAILURE"}


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
            if db_id is None:
                return abort(400, "Error: database `id` not found")

            temp_db_conn = get_database_source(self.loader, db_id)
            if isinstance(temp_db_conn, str):
                return abort(400, temp_db_conn)
            temp_loader = create_temporary_loader(temp_db_conn)
            names = temp_loader.table_names()
            temp_loader.dispose()

            return jsonify(names)

        # todo: options: file format
        @bp.route("/new-table", strict_slashes=False, methods=["POST"])
        def new_table_by_xlsx_api():
            """
            insert xlsx file to a database (id specified in storage)
            """
            f = request.files.get(xlsx_file)
            db_id = request.args.get("id")
            insert_option = request.args.get("insertOption")
            insert_option = "replace" if insert_option is None else insert_option

            if db_id is None:
                return abort(400, "Error: `id` is required")
            if f is None:
                return abort(400, "Error: `file` is required")
            if f.content_type != xlsx_file_type:
                return abort(400, "Error: file must be .xlsx")
            if insert_option not in ["replace", "append", "fail"]:
                return abort(400, "Error: `insertOption` should be replace/append")

            temp_db_conn = get_database_source(self.loader, db_id)
            if isinstance(temp_db_conn, str):
                return abort(400, temp_db_conn)

            temp_loader = create_temporary_loader(temp_db_conn)

            d = extract_xlsx(f, param_head=True, param_multi_sheets=True)

            for key, value in d.items():
                try:
                    temp_loader.insert(key, value, if_exists=insert_option)
                except Exception:
                    return make_response(jsonify(res_failure), 400)

            temp_loader.dispose()

            return make_response(jsonify(res_success), 201)

        @bp.route("/gen-uuid-key", strict_slashes=False, methods=["POST"])
        def gen_uuid_key_api():
            """

            """
            db_id = request.args.get("id")
            table_name = request.json.get("tableName")
            key_col = request.json.get("keyColumn")

            if db_id is None:
                return abort(400, "Error: `id` is required")
            if table_name is None:
                return abort(400, "Error: `tableName` is required in body")
            if key_col is None:
                return abort(400, "Error: `keyColumn` is required in body")

            temp_db_conn = get_database_source(self.loader, db_id)
            if isinstance(temp_db_conn, str):
                return abort(400, temp_db_conn)

            temp_loader = create_temporary_loader(temp_db_conn)

            try:
                temp_loader.add_primary_uuid_key(table_name, key_col)
            except Exception:
                return make_response(jsonify(res_failure), 400)

            temp_loader.dispose()

            return make_response(jsonify(res_success), 201)

        @bp.route("/read", strict_slashes=False, methods=["POST"])
        def read_table_api():
            """
            read data from a database (id specified in storage)
            """
            db_id = request.args.get("id")
            query_str = request.json.get("query")

            if db_id is None:
                return abort(400, "Error: `id` is required")
            if query_str is None:
                return abort(400, "Error: `query` is required")

            temp_db_conn = get_database_source(self.loader, db_id)
            if isinstance(temp_db_conn, str):
                return abort(400, temp_db_conn)

            temp_loader = create_temporary_loader(temp_db_conn)
            try:
                data = temp_loader.read(query_str)
            except Exception:
                return make_response(jsonify(res_failure), 400)

            temp_loader.dispose()

            return jsonify(json.loads(data.to_json(orient="records")))

        return bp
