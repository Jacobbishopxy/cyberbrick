

from typing import Optional


def attach_prefix(name: str, prefix: Optional[str]) -> str:
    return name if prefix is None else f"{prefix}_{name}"
