"""
@author Jacob Xie
@time 9/3/2020
"""

from enum import Enum
from os import getenv, path
from pathlib import Path
import json

base_dir = Path(__file__).parent
resources_dir = Path(__file__).parents[3]

config_name = "resources/config.json"
config_template_name = "resources/config.template.json"


def read_config():
    try:
        config_path = path.join(resources_dir, config_name)
        with open(config_path) as cf:
            return json.loads(cf.read())
    except FileNotFoundError:
        config_path = path.join(resources_dir, config_template_name)
        with open(config_path) as cf:
            return json.loads(cf.read())
    except Exception as e:
        err = f"Please check if {config_name} or {config_template_name} exists! \n\n {e}"
        raise Exception(err)


class Config(object):
    SECRET_KEY = getenv("SECRET_KEY", "secret_key")
    DEBUG = False
    CFG = read_config()


class DevelopmentConfig(Config):
    DEBUG = True
    conn = Config.CFG['connDevGallery']
    server_port = Config.CFG["serverPyPort"]


class ProductionConfig(Config):
    DEBUG = False
    conn = Config.CFG['connProdGallery']
    server_port = Config.CFG["serverPyPort"]


class AppConfig(Enum):
    dev = DevelopmentConfig
    prod = ProductionConfig


key = Config.SECRET_KEY

if __name__ == '__main__':
    x1 = DevelopmentConfig().conn
    print(x1)
    x2 = ProductionConfig().conn
    print(x2)
