"""
@author Jacob Xie
@time 11/6/2020
"""

from typing import List, Union, Optional
import io
import pandas as pd
import json
from enum import Enum

from .util import df_float_cvt, df_datetime_cvt, df_column_name_fix


class FileType(Enum):
    csv = "text/csv"
    xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    text = "text/plain"
    image = "image/*"
    html = "text/html"
    video = "video/*"
    audio = "audio/*"
    pdf = ".pdf"


def _df_fix(df: pd.DataFrame, rounding: Optional[int], transpose: bool, if_header: bool) -> pd.DataFrame:

    df = df.T if transpose is True else df
    df = df.dropna(how='all', axis=1)
    df = df.dropna(how='all')

    if if_header is True:
        return df_column_name_fix(df_float_cvt(df, rounding))
    else:
        return df_float_cvt(df, rounding)


def extract_xlsx(file: io,
                 param_head: bool,
                 param_multi_sheets: Union[bool, List[int]],
                 rounding: Optional[int],
                 transpose: Optional[bool]):
    hd = 0 if param_head is True else None
    if param_multi_sheets is True:
        sheet_name = None
    elif param_multi_sheets is False:
        sheet_name = 0
    else:
        sheet_name = param_multi_sheets

    ans = pd.read_excel(file, header=hd, sheet_name=sheet_name)
    if isinstance(ans, dict):
        return {k: _df_fix(v, rounding, transpose, param_head) for k, v in ans.items()}
    else:
        return {"0":_df_fix(ans, rounding, transpose, param_head)}


def xlsx_to_json(d: Union[dict, pd.DataFrame], date_format: Optional[str] = None):
    if isinstance(d, dict):
        ans = {k: json.loads(df_datetime_cvt(v, date_format).to_json(orient="records")) for k, v in d.items()}
    else:
        ans = {"0": json.loads(df_datetime_cvt(d, date_format).to_json(orient="records"))}

    return ans


def extract_csv(file: io,
                param_head: bool,
                rounding: Optional[int],
                transpose: Optional[bool]):
    hd = 0 if param_head is True else None

    ans = pd.read_csv(file, header=hd)

    return {"0": _df_fix(ans, rounding, transpose, param_head)}


def csv_to_json(d: pd.DataFrame, date_format: Optional[str] = None):
    return {"0": json.loads(df_datetime_cvt(d, date_format).to_json(orient="records"))}
