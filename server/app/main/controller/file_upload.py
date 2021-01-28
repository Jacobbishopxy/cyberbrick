"""
@author Jacob Xie
@time 11/3/2020
"""

from flask import abort, Blueprint, request, jsonify

from .abstract_controller import Controller
from ..config import AppConfig
from ..provider.file_upload import FileType, extract_xlsx, xlsx_to_json, extract_csv, csv_to_json


class FileUploadController(Controller):

    def __init__(self, env: AppConfig, *args, **kwargs):
        super().__init__(env)

    def get_blueprint(self) -> Blueprint:
        bp = Blueprint("upload", __name__, url_prefix="/upload")

        param_head = "head"
        param_multi_sheets = "multiSheets"
        param_round = "numberRounding"
        param_date_format = "dateFormat"
        param_transpose = "transpose"

        @bp.route("/extract", strict_slashes=False, methods=["POST"])
        def extract_xlsx_api():
            f = request.files.get("file")

            if f is None:
                return abort(400, "Error: file not found")

            number_rounding = request.args.get(param_round)
            hd = True if request.args.get(param_head) == "true" else False
            nr = None if number_rounding is None else int(number_rounding)
            df = request.args.get(param_date_format)
            tp = True if request.args.get(param_transpose) == "true" else False

            if df is None:
                df = "%Y/%m/%d"

            if f.content_type == FileType.xlsx.value:
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
                try:
                    d = extract_xlsx(f, hd, sheet_name, nr, tp)
                    ans = xlsx_to_json(d, df)
                except Exception as e:
                    return abort(400, e)
            elif f.content_type == FileType.csv.value:
                try:
                    d = extract_csv(f, hd, nr, tp)
                    ans = csv_to_json(d, df)
                except Exception as e:
                    return abort(400, e)
            else:
                return abort(400, "Error: file must be .csv or .xlsx")

            return jsonify(ans)

        return bp
