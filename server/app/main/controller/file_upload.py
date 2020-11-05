"""
@author Jacob Xie
@time 11/3/2020
"""

from flask_restx import Resource, Namespace, reqparse
from werkzeug.datastructures import FileStorage
import pandas as pd

from .abstract_controller import Controller
from ..config import AppConfig

xlsx_file = "xlsx"
xlsx_file_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"


class FileUploadController(Controller):

    def __init__(self, env: AppConfig):
        super().__init__(env)

    def get_namespace(self) -> Namespace:
        namespace = Namespace("upload", description="Upload Excel and return spreadsheet")

        parser = reqparse.RequestParser()
        parser.add_argument(xlsx_file,
                            type=FileStorage,
                            location="files")
        param_head, param_multi_sheets = "head", "multiSheets"
        parser.add_argument(param_head, type=str)
        parser.add_argument(param_multi_sheets, type=str)

        @namespace.route("/", strict_slashes=False)
        class R(Resource):

            @staticmethod
            def get():
                return "wtf"

            @namespace.expect(parser)
            def post(self):
                args = parser.parse_args()
                f = args.get(xlsx_file)

                hd = 0 if args.get(param_head) == "true" else None
                ms = None if args.get(param_multi_sheets) == "true" else 0
                if f is not None and f.content_type == xlsx_file_type:
                    xs = pd.read_excel(f, header=hd, sheet_name=ms)
                    if isinstance(xs, dict):
                        res = {k: v.fillna("").to_dict(orient="records") for k, v in xs.items()}
                    else:
                        res = xs.fillna("").to_dict(orient="records")
                    return res
                else:
                    namespace.abort(400)

        return namespace
