"""
URL configuration for hero_builder app.
"""
from django.urls import path
from . import views

app_name = 'hero_builder'

urlpatterns = [
    path('', views.index, name='index'),
    path('builder/<slug:hero_slug>/', views.builder, name='builder'),
    path('api/hero/<slug:hero_slug>/', views.api_hero_data, name='api_hero_data'),
]
