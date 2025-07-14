from rest_framework.renderers import JSONRenderer

def camelize(string):
    parts = string.split("_")
    return parts[0] + "".join(word.capitalize() for word in parts[1:])


def camelize_dict(data):
    if isinstance(data, dict):
        new_dict = {}
        for key, value in data.items():
            new_key = camelize(key)
            new_dict[new_key] = camelize_dict(value)
        return new_dict
    elif isinstance(data, list):
        return [camelize_dict(item) for item in data]
    else:
        return data


class CamelCaseJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        data = camelize_dict(data)
        return super().render(data, accepted_media_type, renderer_context)
