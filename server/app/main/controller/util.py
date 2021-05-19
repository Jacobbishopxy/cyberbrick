"""
@author Jacob Xie
@time 5/19/2021
"""


from typing import Optional


def attach_prefix(name: str, prefix: Optional[str]) -> str:
    name = name if prefix is None else f"{prefix}_{name}"
    return name.strip()
