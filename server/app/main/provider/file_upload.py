"""
@author Jacob Xie
@time 11/6/2020
"""

from typing import List, Union
import io
import pandas as pd
import json
from enum import Enum

xlsx_file = "xlsx"
xlsx_file_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
csv_file = "csv"
csv_file_type = ".csv"


class FileType(Enum):
    csv = ".csv"
    xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    text = "text/plain"
    image = "image/*"
    html = "text/html"
    video = "video/*"
    audio = "audio/*"
    pdf = ".pdf"


def extract_xlsx(file: io, param_head: bool, param_multi_sheets: Union[bool, List[int]]):
    hd = 0 if param_head is True else None
    if param_multi_sheets is True:
        sheet_name = None
    elif param_multi_sheets is False:
        sheet_name = 0
    else:
        sheet_name = param_multi_sheets

    return pd.read_excel(file, header=hd, sheet_name=sheet_name)


def xlsx_to_json(d: Union[dict, pd.DataFrame]):
    if isinstance(d, dict):
        ans = {k: json.loads(v.to_json(orient="records", date_format="iso")) for k, v in d.items()}
    else:
        ans = {"0": json.loads(d.to_json(orient="records", date_format="iso"))}

    return ans


def extract_csv(file: io):
    pass


def csv_to_json(d: pd.DataFrame):
    pass
