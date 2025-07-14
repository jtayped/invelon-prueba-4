import re
from rest_framework.parsers import JSONParser


def decamelize(string: str) -> str:
    # Insert underscore before each capital (that isn’t at the start), then lowercase
    return re.sub(r"(?<!^)(?=[A-Z])", "_", string).lower()


def decamelize_dict(data):
    if isinstance(data, dict):
        return {decamelize(key): decamelize_dict(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [decamelize_dict(item) for item in data]
    else:
        return data


class SnakeCaseJSONParser(JSONParser):
    def parse(self, stream, media_type=None, parser_context=None):
        data = super().parse(stream, media_type, parser_context)
        return decamelize_dict(data)
