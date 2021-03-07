"""
@author Jacob Xie
@time 3/7/2021
"""

from abc import ABC, abstractmethod
from typing import Any


class BaseCommand(ABC):
    """
    Base class for SQL DDL & DML
    """

    @abstractmethod
    def run(self) -> Any:
        """
        Executes commands
        """

    @abstractmethod
    def validate(self) -> None:
        """
        Call before run
        Raises exception if validation fails
        """
