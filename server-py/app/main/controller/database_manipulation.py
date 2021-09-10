"""
@author Jacob Xie
@time 11/5/2020
"""

from typing import Optional
from flask import abort, Blueprint, request, jsonify, make_response
import pandas as pd
import json

from .abstract_controller import Controller
from .util import attach_prefix
from ..config import AppConfig
from ..util import Loader
from ..provider.file_upload import FileType, extract_xlsx, extract_csv
from ..provider.database_manipulation import get_database_source, create_temporary_loader, gen_update_string, \
    gen_delete_string

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

        @bp.route("/viewStorage")
        def view_storage_api():
            q = f"""SELECT * FROM storage"""
            d = self.loader.read(q)
            return jsonify(d.to_dict(orient="records"))

        @bp.route("/listTable")
        def list_table_api():
            """
            list table names in a database (id specified in storage)
            """
            db_id = request.args.get("id")

            with _create_temp_loader(self.loader, db_id) as loader:
                names = loader.table_names()

            return jsonify(names)

        @bp.route("/getTableColumns")
        def get_table_columns_api():
            """
            get a table's columns info
            """
            db_id = request.args.get("id")
            table_name = request.args.get("tableName")
            data_type = request.args.get("dataType")

            if table_name is None:
                return abort(400, "Error: `tableName` is required in query")

            with _create_temp_loader(self.loader, db_id) as loader:
                info = loader.get_column_info(table_name)

            if data_type == "true":
                return jsonify(json.loads(info.to_json(orient="records")))
            else:
                return jsonify(list(info["column_name"]))

        @bp.route("/genUuidKey", strict_slashes=False, methods=["POST"])
        def gen_uuid_key_api():
            """
            generate a primary uuid key fow a raw table in a database (id specified in storage)

            CAUTIOUS! this API shouldn't be used while we've already got `add_auto_increment_primary_key`
            """
            db_id = request.args.get("id")
            table_name = request.json.get("tableName")
            key_col = request.json.get("keyColumn")

            if table_name is None:
                return abort(400, "Error: `tableName` is required in body")
            if key_col is None:
                return abort(400, "Error: `keyColumn` is required in body")

            with _create_temp_loader(self.loader, db_id) as loader:
                try:
                    loader.add_primary_uuid_key(table_name, key_col)
                except Exception as e:
                    return make_response(str(e), 400)

            return make_response(jsonify(res_success), 201)

        @bp.route("/insertByFile", strict_slashes=False, methods=["POST"])
        def insert_data_by_file_api():
            """
            insert csv file to a database (id specified in storage)
            append to existing table when insertOption == "append"
            """
            f = request.files.get("file")
            db_id = request.args.get("id")
            table_name = request.args.get("tableName")
            insert_option = request.args.get("insertOption")
            insert_option = "replace" if insert_option is None else insert_option
            number_rounding = request.args.get("numberRounding")
            nr = None if number_rounding is None else int(number_rounding)
            tp = True if request.args.get("transpose") == "true" else False
            sheet_prefix = request.args.get("sheetPrefix")

            if f is None:
                return abort(400, "Error: `file` is required in form data")
            if insert_option not in ["replace", "append", "fail"]:
                return abort(400, "Error: `insertOption` should be replace/append/fail")

            if f.content_type == FileType.csv.value:
                if table_name is None:
                    return abort(400, "Error: `tableName` is required in query")

                with _create_temp_loader(self.loader, db_id) as loader:
                    try:
                        d = extract_csv(f, param_head=True, rounding=nr, transpose=tp)
                    except Exception as e:
                        return make_response(str(e), 400)
                    try:
                        loader.insert(table_name, d, if_exists=insert_option, index=False)
                        if insert_option == "replace":
                            # add auto increment primary key
                            loader.add_auto_increment_primary_key(table_name, "_id")
                    except Exception as e:
                        return make_response(str(e), 400)

            elif f.content_type == FileType.xlsx.value:
                with _create_temp_loader(self.loader, db_id) as loader:
                    try:
                        d = extract_xlsx(f, param_head=True, param_multi_sheets=True, rounding=nr, transpose=tp)
                    except Exception as e:
                        return make_response(str(e), 400)
                    for key, value in d.items():
                        try:
                            key = attach_prefix(key, sheet_prefix)
                            loader.insert(key, value, if_exists=insert_option, index=False)
                            if insert_option == "replace":
                                # add auto increment primary key
                                loader.add_auto_increment_primary_key(key, "_id")
                        except Exception as e:
                            return make_response(str(e), 400)
            else:
                return abort(400, "Error: file must be .csv or .xlsx")

            return make_response(jsonify(res_success), 201)

        # todo: export data from database, new POST JSON structure
        @bp.route("/exportData", methods=["POST"])
        def export_data_api():
            return

        @bp.route("/renameTable", methods=["POST"])
        def rename_table_api():
            db_id = request.args.get("id")
            data = request.json
            table_name, replacement = data.get("tableName"), data.get("replacement")

            if table_name is None or replacement is None:
                return abort(400, "Error: json requires `tableName` and `replacement`")

            with _create_temp_loader(self.loader, db_id) as loader:
                try:
                    loader.rename_table(table_name, replacement)
                except Exception as e:
                    return make_response(str(e), 400)

            return make_response(jsonify(res_success), 200)

        @bp.route("/dropTable", methods=["DELETE"])
        def drop_table_api():
            db_id = request.args.get("id")
            table_name = request.args.get("tableName")

            with _create_temp_loader(self.loader, db_id) as loader:
                try:
                    loader.drop_table(table_name)
                except Exception as e:
                    return make_response(str(e), 400)

            return make_response(jsonify(res_success), 200)

        @bp.route("/insert", strict_slashes=False, methods=["POST"])
        def insert_data_api():
            """
            insert data into an existing database's (id specified in storage) table
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

            with _create_temp_loader(self.loader, db_id) as loader:
                try:
                    d = pd.DataFrame(data)
                    if insert_option == "append":
                        loader.insert(table_name, d, index=False, if_exists=insert_option)
                    else:
                        loader.insert(table_name, d, if_exists=insert_option)
                except Exception as e:
                    return make_response(str(e), 400)

            return make_response(jsonify(res_success), 201)

        @bp.route("/update", strict_slashes=False, methods=["POST"])
        def update_data_api():
            """
            update data in an existing table
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

            with _create_temp_loader(self.loader, db_id) as loader:
                try:
                    q = gen_update_string(table_name=table_name, item_id=item_id, data=data)
                    loader.execute(q)
                except Exception as e:
                    return make_response(str(e), 400)

            return make_response(jsonify(res_success), 201)

        @bp.route("/delete", methods=["DELETE"])
        def delete_data_api():
            """
            delete data in an existing table
            """
            db_id = request.args.get("id")
            table_name = request.args.get("tableName")
            item_id = request.args.get("itemId")

            if table_name is None:
                return abort(400, "Error: `tableName` is required")
            if item_id is None:
                return abort(400, "Error: `itemId` is required")

            with _create_temp_loader(self.loader, db_id) as loader:
                try:
                    q = gen_delete_string(table_name=table_name, item_id=item_id)
                    loader.execute(q)
                except Exception as e:
                    return make_response(str(e), 400)

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

            with _create_temp_loader(self.loader, db_id) as loader:
                try:
                    data = loader.read(query_str)
                except Exception as e:
                    return make_response(str(e), 400)

            return jsonify(json.loads(data.to_json(orient="records")))

        return bp
