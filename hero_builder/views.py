"""
Views for the Hero Builder application.
"""
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from gamedata.models import GameVersion, Hero, Faction, Item, Skill, Unit


def index(request):
    """Hero builder home page - select a hero to build."""
    # Get the active game version
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return render(request, 'hero_builder/no_data.html')

    # Get all factions with their heroes
    factions = Faction.objects.filter(version=version).prefetch_related('heroes')

    context = {
        'version': version,
        'factions': factions,
    }
    return render(request, 'hero_builder/index.html', context)


def builder(request, hero_slug):
    """Hero builder interface for a specific hero."""
    # Get the active game version
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return render(request, 'hero_builder/no_data.html')

    # Get the hero
    hero = get_object_or_404(Hero, version=version, slug=hero_slug)

    # Get all available items grouped by slot
    items_by_slot = {}
    for item in Item.objects.filter(version=version).order_by('slot', '-rarity', 'id_key'):
        slot = item.slot
        if slot not in items_by_slot:
            items_by_slot[slot] = []
        items_by_slot[slot].append(item)

    # Get all available skills
    skills = Skill.objects.filter(version=version).order_by('skill_type', 'id_key')

    # Get all units for starting army
    units = Unit.objects.filter(version=version, faction=hero.faction).order_by('tier', 'id_key')

    context = {
        'version': version,
        'hero': hero,
        'items_by_slot': items_by_slot,
        'skills': skills,
        'units': units,
    }
    return render(request, 'hero_builder/builder.html', context)


def api_hero_data(request, hero_slug):
    """API endpoint to get hero data as JSON."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    hero = get_object_or_404(Hero, version=version, slug=hero_slug)

    data = {
        'id': hero.id_key,
        'faction': hero.faction.name,
        'class_type': hero.class_type,
        'icon': hero.icon,
        'stats': {
            'offence': hero.start_offence,
            'defence': hero.start_defence,
            'spell_power': hero.start_spell_power,
            'intelligence': hero.start_intelligence,
            'luck': hero.start_luck,
            'moral': hero.start_moral,
        },
        'raw_data': hero.raw_data,
    }

    return JsonResponse(data)
