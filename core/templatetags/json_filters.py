from django import template
import json

register = template.Library()


@register.filter(name='to_json')
def to_json(value):
    """Convert Python object to JSON string for use in data attributes."""
    return json.dumps(value) if value else '{}'
