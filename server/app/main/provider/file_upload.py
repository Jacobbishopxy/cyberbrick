"""
@author Jacob Xie
@time 11/6/2020
"""

from typing import List, Union
import io
import pandas as pd
import json


def extract_xlsx(file: io, param_head: bool, param_multi_sheets: Union[bool, List[int]]):
    hd = 0 if param_head is True else None
    if param_multi_sheets is True:
        sheet_name = None
    elif param_multi_sheets is False:
        sheet_name = 0
    else:
        sheet_name = param_multi_sheets

    return pd.read_excel(file, header=hd, sheet_name=sheet_name)


def xlsx_to_json(xs: Union[dict, pd.DataFrame]):
    if isinstance(xs, dict):
        ans = {k: json.loads(v.to_json(orient="records", date_format="iso")) for k, v in xs.items()}
    else:
        ans = {"0": json.loads(xs.to_json(orient="records", date_format="iso"))}

    return ans
