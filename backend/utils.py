from functools import wraps
from flask import request
import re

def camel_to_snake(name):
    """Convert camelCase string to snake_case."""
    name = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', name).lower()

def convert_keys(obj):
    """Recursively converts dictionary keys from camelCase to snake_case."""
    if isinstance(obj, dict):
        return {camel_to_snake(key): convert_keys(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_keys(elem) for elem in obj]
    return obj

def normalize_request_data(f):
    """Decorator to convert request data from camelCase to snake_case."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.is_json:
            # Get the original JSON data
            json_data = request.get_json(force=True)
            if json_data:
                # Convert the data
                converted_data = convert_keys(json_data)
                # Override the request's get_json method to return our converted data
                def new_get_json(*args, **kwargs):
                    return converted_data
                request.get_json = new_get_json
        
        if request.args:
            # Convert query parameters
            kwargs.update({
                camel_to_snake(key): value
                for key, value in request.args.items()
            })
        return f(*args, **kwargs)
    return decorated_function 