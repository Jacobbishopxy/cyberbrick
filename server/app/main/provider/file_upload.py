"""
@author Jacob Xie
@time 11/6/2020
"""

from typing import List, Union, Optional
import io
import pandas as pd
import json
from enum import Enum
import datetime
import numpy as np


class FileType(Enum):
    csv = "text/csv"
    xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    text = "text/plain"
    image = "image/*"
    html = "text/html"
    video = "video/*"
    audio = "audio/*"
    pdf = ".pdf"


def datetime_to_str(value, date_format: str):
    if isinstance(value, datetime.datetime):
        return value.strftime(date_format)
    return value


def df_datetime_cvt(df: pd.DataFrame, date_format: Optional[str]):
    df = df.fillna("")
    if date_format is None:
        return df

    return df.applymap(lambda x: datetime_to_str(x, date_format))


def float_rounding(value, rounding: int):
    if isinstance(value, np.float):
        return np.round(value, rounding)
    return value


def df_float_cvt(df: pd.DataFrame, rounding: Optional[int]):
    df = df.fillna("")
    if rounding is None:
        return df

    return df.applymap(lambda x: float_rounding(x, rounding))


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
        return {k: df_float_cvt(v, rounding) for k, v in ans.items()}
    else:
        return df_float_cvt(ans, rounding)


def xlsx_to_json(d: Union[dict, pd.DataFrame], date_format: Optional[str] = None):
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
    ans = ans if rounding is None else ans.round(rounding)

    return ans


def csv_to_json(d: pd.DataFrame, date_format: Optional[str] = None):
    return {"0": json.loads(df_datetime_cvt(d, date_format).to_json(orient="records"))}
