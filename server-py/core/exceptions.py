"""
@author Jacob Xie
@time 3/6/2021
"""

from typing import Optional


class CyberbrickException(Exception):
    status = 500
    message = ""

    def __init__(self, message: str = "", exception: Optional[Exception] = None) -> None:
        if message:
            self.message = message
        self._exception = exception
        super().__init__(self.message)

    @property
    def exception(self) -> Optional[Exception]:
        return self._exception
