"""
@author Jacob Xie
@time 11/3/2020
"""

from flask import abort, Blueprint, request
import pandas as pd
import json

from .abstract_controller import Controller
from ..config import AppConfig
from ..util.sql_loader import Loader

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
        def post():
            f = request.files[xlsx_file]

            if f is not None and f.content_type == xlsx_file_type:
                hd = 0 if request.args.get(param_head) == "true" else None
                ms = request.args.get(param_multi_sheets)
                if ms == "true":
                    sheet_name = None
                elif ms == "false" or ms is None:
                    sheet_name = 0
                else:
                    try:
                        sheet_name = [int(i) for i in ms.split(",")]
                    except ValueError:
                        return abort(400, {"error": "multiSheets must be bool type or 1,2,3 alike"})

                xs = pd.read_excel(f, header=hd, sheet_name=sheet_name)

                if isinstance(xs, dict):
                    res = {k: json.loads(v.to_json(orient="records", date_format="iso")) for k, v in xs.items()}
                else:
                    res = {"0": json.loads(xs.to_json(orient="records", date_format="iso"))}

                return res
            else:
                return abort(400, {"error": "file must be .xlsx"})

        return bp
