"""
Context processors for hero_builder app.
"""
from django.conf import settings
from django.utils.translation import get_language


def available_languages(request):
    """
    Add available languages to template context.
    Uses native language names (not translated).
    """
    current_code = get_language() or settings.LANGUAGE_CODE
    current_name = dict(settings.LANGUAGES).get(current_code, current_code)
    return {
        'available_languages': settings.LANGUAGES,
        'current_language_name': current_name,
    }
