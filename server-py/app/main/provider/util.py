"""
@author Jacob Xie
@time 5/19/2021
"""

from typing import Optional
import pandas as pd
import datetime
import numpy as np


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


def df_column_name_fix(df: pd.DataFrame):

    name_dict = dict({})
    columns = []

    for n in df.columns:
        temp_n = n.strip().replace("%", "％").replace("(", "（").replace(")", "）")
        temp_n = temp_n[:50]
        if temp_n in name_dict.keys():
            name_dict[temp_n] += 1
            temp_n = f"{name_dict[temp_n]}_{temp_n}"
        else:
            name_dict[temp_n] = 0
        columns.append(temp_n)

    df.columns = columns
    return df
