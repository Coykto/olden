"""
URL configuration for hero_builder app.
"""
from django.urls import path
from . import views

app_name = 'hero_builder'

urlpatterns = [
    # Main pages
    path('', views.index, name='index'),
    path('faction/<slug:faction_slug>/', views.faction_heroes, name='faction_heroes'),
    path('hero/<slug:hero_slug>/', views.builder, name='builder'),
    path('calculator/', views.calculator, name='calculator'),

    # API endpoints - Heroes
    path('api/hero/<slug:hero_slug>/', views.api_hero_data, name='api_hero_data'),
    path('api/heroes/', views.api_heroes, name='api_heroes'),

    # API endpoints - Units
    path('api/units/', views.api_units, name='api_units'),
    path('api/units/<str:unit_id>/', views.api_unit_detail, name='api_unit_detail'),

    # API endpoints - Skills
    path('api/skills/', views.api_skills_combat, name='api_skills'),
    path('api/skills/available/', views.api_available_skills, name='api_available_skills'),
    path('api/skills/<str:skill_id>/level/<int:level>/subskills/', views.api_skill_subskills, name='api_skill_subskills'),

    # API endpoints - Advanced Classes
    path('api/advanced-classes/', views.api_advanced_classes, name='api_advanced_classes'),
    path('api/advanced-classes/skill-indicators/', views.api_advanced_class_skill_indicators, name='api_advanced_class_skill_indicators'),

    # API endpoints - Calculator
    path('api/calculate-damage/', views.api_calculate_damage, name='api_calculate_damage'),

    # API endpoints - Items
    path('api/items/available/', views.api_available_items, name='api_available_items'),
    path('api/item-sets/', views.api_item_sets, name='api_item_sets'),

    # API endpoints - Spells
    path('api/spells/available/', views.api_available_spells, name='api_available_spells'),
]
