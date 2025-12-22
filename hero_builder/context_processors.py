"""
Context processors for hero_builder app.
"""
from django.conf import settings


def available_languages(request):
    """
    Add available languages to template context.
    Uses native language names (not translated).
    """
    return {
        'available_languages': settings.LANGUAGES
    }
