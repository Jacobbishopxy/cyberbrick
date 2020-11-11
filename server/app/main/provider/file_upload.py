"""
@author Jacob Xie
@time 11/6/2020
"""

from typing import List, Union, Optional
import io
import pandas as pd
import json
from enum import Enum


class FileType(Enum):
    csv = "text/csv"
    xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    text = "text/plain"
    image = "image/*"
    html = "text/html"
    video = "video/*"
    audio = "audio/*"
    pdf = ".pdf"


def df_datetime_cvt(df: pd.DataFrame, date_format: Optional[str]):
    if date_format is None:
        assign = df.select_dtypes(["datetime"]).astype(str)
    else:
        assign = df.select_dtypes(["datetime"]).applymap(lambda x: x.strftime(date_format))

    return df.assign(**assign)


def extract_xlsx(file: io,
                 param_head: bool,
                 param_multi_sheets: Union[bool, List[int]],
                 rounding: Optional[int]):
    hd = 0 if param_head is True else None
    if param_multi_sheets is True:
        sheet_name = None
    elif param_multi_sheets is False:
        sheet_name = 0
    else:
        sheet_name = param_multi_sheets

    ans = pd.read_excel(file, header=hd, sheet_name=sheet_name)
    if isinstance(ans, dict):
        ans = {k: v.round(rounding) for k, v in ans.items()}
    else:
        ans = ans.round(rounding) if rounding else ans

    return ans


def xlsx_to_json(d: Union[dict, pd.DataFrame], date_format: str):
    if isinstance(d, dict):
        ans = {k: json.loads(df_datetime_cvt(v, date_format).to_json(orient="records")) for k, v in d.items()}
    else:
        ans = {"0": json.loads(df_datetime_cvt(d, date_format).to_json(orient="records"))}

    return ans


def extract_csv(file: io,
                param_head: bool,
                rounding: Optional[int]):
    hd = 0 if param_head is True else None

    ans = pd.read_csv(file, header=hd)
    ans = ans.round(rounding) if rounding else ans

    return ans


def csv_to_json(d: pd.DataFrame, date_format: str):
    return json.loads(df_datetime_cvt(d, date_format).to_json(orient="records"))
