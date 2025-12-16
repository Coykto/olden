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

    # API endpoints - Calculator
    path('api/calculate-damage/', views.api_calculate_damage, name='api_calculate_damage'),
]
