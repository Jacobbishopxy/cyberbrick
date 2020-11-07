"""
@author Jacob Xie
@time 11/3/2020
"""

from flask import abort, Blueprint, request

from .abstract_controller import Controller
from ..config import AppConfig
from ..provider.file_upload import xlsx_file, xlsx_file_type, extract_xlsx, xlsx_to_json


class FileUploadController(Controller):

    def __init__(self, env: AppConfig, *args, **kwargs):
        super().__init__(env)

    def get_blueprint(self) -> Blueprint:
        bp = Blueprint("upload", __name__, url_prefix="/upload")

        param_head, param_multi_sheets = "head", "multiSheets"

        @bp.route("/extractXlsx", strict_slashes=False, methods=["POST"])
        def extract_xlsx_api():
            f = request.files.get(xlsx_file)

            if f is None or f.content_type == xlsx_file_type:
                return abort(400, "Error: file must be .xlsx")

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

        return bp
