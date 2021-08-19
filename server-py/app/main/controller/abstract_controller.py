"""
@author Jacob Xie
@time 11/5/2020
"""

from abc import ABC, abstractmethod
from flask import Blueprint

from ..config import AppConfig


class Controller(ABC):
    def __init__(self, env: AppConfig, *args, **kwargs):
        self._env = env

    def show_env(self):
        return self._env

    @abstractmethod
    def get_blueprint(self) -> Blueprint:
        pass
