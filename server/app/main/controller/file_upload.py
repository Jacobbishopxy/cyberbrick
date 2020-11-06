"""
@author Jacob Xie
@time 11/3/2020
"""

from flask import abort, Blueprint, request, jsonify, make_response

from .abstract_controller import Controller
from ..config import AppConfig
from ..util.sql_loader import Loader, get_loader_prefix
from ..provider.file_upload import extract_xlsx, xlsx_to_json

xlsx_file = "xlsx"
xlsx_file_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"


class FileUploadController(Controller):

    def __init__(self, env: AppConfig, db_loader: Loader, *args, **kwargs):
        super().__init__(env)
        self.loader = db_loader

    def get_blueprint(self) -> Blueprint:
        bp = Blueprint("upload", __name__, url_prefix="/upload")

        param_head, param_multi_sheets = "head", "multiSheets"

        @bp.route("/extractXlsx", strict_slashes=False, methods=["POST"])
        def extract_xlsx_api():
            f = request.files[xlsx_file]

            if f is not None and f.content_type == xlsx_file_type:
                hd = True if request.args.get(param_head) == "true" else False
                ms = request.args.get(param_multi_sheets)
                if ms == "true":
                    sheet_name = True
                elif ms == "false" or ms is None:
                    sheet_name = False
                else:
                    try:
                        sheet_name = [int(i) for i in ms.split(",")]
                    except ValueError:
                        return abort(400, "Error: multiSheets must be bool type or 1,2,3 alike")

                d = extract_xlsx(f, hd, sheet_name)
                return xlsx_to_json(d)
            else:
                return abort(400, "Error: file must be .xlsx")

        # todo: 1. error handling; 2. `flask-sqlAlchemy` handling connection and session
        @bp.route("/insert", strict_slashes=False, methods=["POST"])
        def insert_xlsx_api():
            f = request.files[xlsx_file]
            db_id = request.args.get("id")
            if db_id is None:
                return abort(400, "Error: param `id` is required for database")

            q = f"""
            SELECT * FROM storage WHERE id='{db_id}'
            """
            source = self.loader.read(q)
            if not len(source):
                return abort(400, f"Error: database `id`: {db_id} not found")

            temp_db_conn = source.iloc[0].to_dict()

            temp_loader = Loader(prefix=get_loader_prefix(temp_db_conn["type"]),
                                 host=temp_db_conn["host"],
                                 port=temp_db_conn["port"],
                                 database=temp_db_conn["database"],
                                 username=temp_db_conn["username"],
                                 password=temp_db_conn["password"])

            d = extract_xlsx(f, param_head=True, param_multi_sheets=True)

            for key, value in d.items():
                temp_loader.insert(key, value)

            temp_loader.dispose()

            data = {"message": "Created", "code": "SUCCESS"}
            return make_response(jsonify(data), 201)

        return bp
