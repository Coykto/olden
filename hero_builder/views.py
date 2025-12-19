"""
Views for the Hero Builder application.
"""
import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from gamedata.models import GameVersion, Hero, Faction, Item, ItemSet, Skill, Unit, Spell, MagicSchool
from core.localizations import get_skill_info, get_localizations, get_item_info, get_item_set_info, get_skill_args, get_subskill_configs, get_spell_info, get_spell_descriptions_by_level, get_unit_ability_args
import re


def get_ability_display_name(ability_id: str) -> str:
    """Convert ability ID to display name using localizations.

    Ability IDs use 0-based indexing (e.g., fairy_dragon_ability_0)
    but localizations use 1-based indexing (e.g., fairy_dragon_ability_1_name).
    """
    localizations = get_localizations()

    # Convert 0-based to 1-based index: ability_0 -> ability_1, passive_0 -> passive_1
    def increment_index(match):
        return f"{match.group(1)}{int(match.group(2)) + 1}"

    localization_key = re.sub(r'(ability_|passive_)(\d+)', increment_index, ability_id)
    name_key = f"{localization_key}_name"

    if name_key in localizations:
        return localizations[name_key]

    # Try without _name suffix
    if localization_key in localizations:
        return localizations[localization_key]

    # For upgraded units (_upg, _upg_alt), try base unit ability name
    # e.g., esquire_upg_passive_1 -> esquire_passive_1
    base_key = re.sub(r'_upg(_alt)?', '', localization_key)
    base_name_key = f"{base_key}_name"
    if base_name_key in localizations:
        return localizations[base_name_key]

    # Try aura suffix directly
    if ability_id.endswith('_aura'):
        aura_name_key = f"{ability_id}_name"
        if aura_name_key in localizations:
            return localizations[aura_name_key]

    # Fallback: prettify the ability_id
    # Remove unit prefix and clean up
    pretty = ability_id
    # Remove common suffixes
    pretty = re.sub(r'_passive_\d+$', '', pretty)
    pretty = re.sub(r'_ability_\d+$', '', pretty)
    pretty = re.sub(r'_aura$', ' Aura', pretty)
    # Remove _upg variants
    pretty = re.sub(r'_upg(_alt)?', '', pretty)
    # Convert to title case
    pretty = pretty.replace('_', ' ').title()
    return pretty


def get_ability_info(ability_id: str) -> dict:
    """Get ability info including name, description template, and args.

    Uses the same index conversion logic as get_ability_display_name.
    Returns dict with: name, description_template, description_args
    """
    localizations = get_localizations()
    args_data = get_unit_ability_args()

    # Convert 0-based to 1-based index: ability_0 -> ability_1, passive_0 -> passive_1
    def increment_index(match):
        return f"{match.group(1)}{int(match.group(2)) + 1}"

    localization_key = re.sub(r'(ability_|passive_)(\d+)', increment_index, ability_id)
    desc_key = f"{localization_key}_description"

    # Try main description key
    description_template = localizations.get(desc_key, "")
    description_args = args_data.get(desc_key, [])

    # For upgraded units (_upg, _upg_alt), try base unit ability description
    if not description_template:
        base_key = re.sub(r'_upg(_alt)?', '', localization_key)
        base_desc_key = f"{base_key}_description"
        description_template = localizations.get(base_desc_key, "")
        description_args = args_data.get(base_desc_key, [])

    # Try aura suffix directly
    if not description_template and ability_id.endswith('_aura'):
        aura_desc_key = f"{ability_id}_description"
        description_template = localizations.get(aura_desc_key, "")
        description_args = args_data.get(aura_desc_key, [])

    return {
        'name': get_ability_display_name(ability_id),
        'description_template': description_template,
        'description_args': description_args,
    }


def index(request):
    """Combined faction and hero selection page."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return render(request, 'hero_builder/no_data.html')

    factions = Faction.objects.filter(version=version)

    # Check for faction query param, otherwise default to first faction (Temple)
    faction_slug = request.GET.get('faction')
    if faction_slug:
        selected_faction = factions.filter(slug=faction_slug).first() or factions.first()
    else:
        selected_faction = factions.first()

    heroes = Hero.objects.filter(version=version, faction=selected_faction).order_by('sort_order') if selected_faction else []

    context = {
        'version': version,
        'factions': factions,
        'selected_faction': selected_faction,
        'heroes': heroes,
    }
    return render(request, 'hero_builder/index.html', context)


def faction_heroes(request, faction_slug):
    """Hero selection partial for a specific faction (HTMX endpoint)."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return render(request, 'hero_builder/no_data.html')

    faction = get_object_or_404(Faction, version=version, slug=faction_slug)
    heroes = Hero.objects.filter(version=version, faction=faction).order_by('sort_order')

    context = {
        'version': version,
        'faction': faction,
        'heroes': heroes,
    }
    # Return partial template for HTMX requests
    return render(request, 'hero_builder/partials/_heroes_grid.html', context)


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

    # Get starting squad units
    start_squad = []
    raw_squad = hero.raw_data.get('startSquad', [])
    for squad_entry in raw_squad:
        unit_id = squad_entry.get('sid', '')
        count = squad_entry.get('count', 0)

        # Look up the unit
        unit = Unit.objects.filter(version=version, id_key=unit_id).first()
        if unit:
            start_squad.append({
                'id': unit.id_key,
                'name': unit.display_name,
                'count': count,
                'tier': unit.tier,
                'icon_url': unit.icon_url,
                'stats': {
                    'hp': unit.hp,
                    'offence': unit.offence,
                    'defence': unit.defence,
                    'damage_min': unit.damage_min,
                    'damage_max': unit.damage_max,
                    'initiative': unit.initiative,
                    'speed': unit.speed,
                },
                'attack_type': unit.attack_type,
                'move_type': unit.move_type,
            })

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
        'start_squad': start_squad,
        'raw_data': hero.raw_data,
    }

    return JsonResponse(data)


def api_units(request):
    """API endpoint to get all units with combat stats."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    faction_filter = request.GET.get('faction')

    units_qs = Unit.objects.filter(version=version).select_related('faction')
    if faction_filter:
        units_qs = units_qs.filter(faction__id_key=faction_filter)

    units_data = []
    for unit in units_qs.order_by('faction', 'tier', 'id_key'):
        units_data.append({
            'id': unit.id_key,
            'name': unit.display_name,
            'faction': unit.faction.id_key if unit.faction else None,
            'faction_name': unit.faction.name if unit.faction else None,
            'tier': unit.tier,
            'stats': {
                'hp': unit.hp,
                'offence': unit.offence,
                'defence': unit.defence,
                'damage_min': unit.damage_min,
                'damage_max': unit.damage_max,
                'initiative': unit.initiative,
                'speed': unit.speed,
                'luck': unit.luck,
                'moral': unit.moral,
            },
            'attack_type': unit.attack_type,
            'move_type': unit.move_type,
            'abilities': unit.abilities,
            'damage_modifiers': unit.damage_modifiers,
        })

    return JsonResponse({'units': units_data})


def api_unit_detail(request, unit_id):
    """API endpoint to get detailed unit data."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    unit = get_object_or_404(Unit, version=version, id_key=unit_id)

    data = {
        'id': unit.id_key,
        'name': unit.display_name,
        'faction': unit.faction.id_key if unit.faction else None,
        'faction_name': unit.faction.name if unit.faction else None,
        'tier': unit.tier,
        'squad_value': unit.squad_value,
        'stats': {
            'hp': unit.hp,
            'offence': unit.offence,
            'defence': unit.defence,
            'damage_min': unit.damage_min,
            'damage_max': unit.damage_max,
            'initiative': unit.initiative,
            'speed': unit.speed,
            'luck': unit.luck,
            'moral': unit.moral,
        },
        'attack_type': unit.attack_type,
        'move_type': unit.move_type,
        'abilities': unit.abilities,
        'damage_modifiers': unit.damage_modifiers,
        'costs': {
            'gold': unit.cost_gold,
            'wood': unit.cost_wood,
            'ore': unit.cost_ore,
            'gemstones': unit.cost_gemstones,
            'crystals': unit.cost_crystals,
            'mercury': unit.cost_mercury,
        },
    }

    return JsonResponse(data)


@require_GET
def api_faction_units(request, faction_slug):
    """Get all units for a faction, grouped by tier."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    faction = get_object_or_404(Faction, version=version, slug=faction_slug)

    # Get all units for this faction
    units = Unit.objects.filter(version=version, faction=faction).order_by('tier', 'id_key')

    # Group units by tier
    units_by_tier = {}
    for unit in units:
        tier = str(unit.tier)
        if tier not in units_by_tier:
            units_by_tier[tier] = []

        # Convert ability IDs to full ability info, separated by type
        passives = []
        actives = []
        for ability_id in (unit.abilities or []):
            ability_info = get_ability_info(ability_id)
            ability_data = {
                'id': ability_id,
                'name': ability_info['name'],
                'description_template': ability_info['description_template'],
                'description_args': ability_info['description_args'],
            }
            if '_passive_' in ability_id or ability_id.endswith('_aura'):
                passives.append(ability_data)
            else:
                actives.append(ability_data)

        units_by_tier[tier].append({
            'id': unit.id_key,
            'name': unit.display_name,
            'tier': unit.tier,
            'icon_url': unit.icon_url,
            'stats': {
                'hp': unit.hp,
                'offence': unit.offence,
                'defence': unit.defence,
                'damage_min': unit.damage_min,
                'damage_max': unit.damage_max,
                'initiative': unit.initiative,
                'speed': unit.speed,
                'luck': unit.luck,
                'morale': unit.moral,
            },
            'attack_type': unit.attack_type,
            'move_type': unit.move_type,
            'squad_value': unit.squad_value,
            'passives': passives,
            'actives': actives,
            'is_upgrade': '_upg' in unit.id_key,
            'raw_data': unit.raw_data,
        })

    return JsonResponse({
        'faction': faction.name,
        'units_by_tier': units_by_tier,
    })


@require_GET
def api_all_units(request):
    """Get all units from all factions, grouped by faction and tier.

    Used by the unit picker modal to allow selecting units from any faction.
    """
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    # Get all factions ordered by sort_order
    factions = Faction.objects.filter(version=version).order_by('sort_order')

    # Get all units
    units = Unit.objects.filter(version=version).select_related('faction').order_by('faction__sort_order', 'tier', 'id_key')

    # Group units by faction, then by tier
    factions_data = []
    for faction in factions:
        faction_units = [u for u in units if u.faction_id == faction.id]

        units_by_tier = {}
        for unit in faction_units:
            tier = str(unit.tier)
            if tier not in units_by_tier:
                units_by_tier[tier] = []

            # Convert ability IDs to full ability info, separated by type
            passives = []
            actives = []
            for ability_id in (unit.abilities or []):
                ability_info = get_ability_info(ability_id)
                ability_data = {
                    'id': ability_id,
                    'name': ability_info['name'],
                    'description_template': ability_info['description_template'],
                    'description_args': ability_info['description_args'],
                }
                # Classify by ID pattern: passive_, aura = passive; ability_ = active
                if '_passive_' in ability_id or ability_id.endswith('_aura'):
                    passives.append(ability_data)
                else:
                    actives.append(ability_data)

            units_by_tier[tier].append({
                'id': unit.id_key,
                'name': unit.display_name,
                'tier': unit.tier,
                'icon_url': unit.icon_url,
                'stats': {
                    'hp': unit.hp,
                    'offence': unit.offence,
                    'defence': unit.defence,
                    'damage_min': unit.damage_min,
                    'damage_max': unit.damage_max,
                    'initiative': unit.initiative,
                    'speed': unit.speed,
                    'luck': unit.luck,
                    'morale': unit.moral,
                },
                'attack_type': unit.attack_type,
                'move_type': unit.move_type,
                'squad_value': unit.squad_value,
                'passives': passives,
                'actives': actives,
                'is_upgrade': '_upg' in unit.id_key,
                'raw_data': unit.raw_data,
            })

        factions_data.append({
            'id': faction.id_key,
            'slug': faction.slug,
            'name': faction.name,
            'icon_url': faction.icon_url,
            'units_by_tier': units_by_tier,
        })

    return JsonResponse({
        'factions': factions_data,
    })


def api_heroes(request):
    """API endpoint to get all heroes."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    faction_filter = request.GET.get('faction')

    heroes_qs = Hero.objects.filter(version=version).select_related('faction')
    if faction_filter:
        heroes_qs = heroes_qs.filter(faction__id_key=faction_filter)

    heroes_data = []
    for hero in heroes_qs.order_by('faction', 'sort_order'):
        heroes_data.append({
            'id': hero.id_key,
            'slug': hero.slug,
            'name': hero.display_name,
            'faction': hero.faction.id_key if hero.faction else None,
            'faction_name': hero.faction.name if hero.faction else None,
            'class_type': hero.class_type,
            'portrait_url': hero.portrait_url,
            'stats': {
                'offence': hero.start_offence,
                'defence': hero.start_defence,
                'spell_power': hero.start_spell_power,
                'intelligence': hero.start_intelligence,
                'luck': hero.start_luck,
                'moral': hero.start_moral,
            },
            'starting_skills': hero.starting_skills,
            'specialization': {
                'name': hero.specialization_name,
                'description': hero.specialization_desc,
            }
        })

    return JsonResponse({'heroes': heroes_data})


def api_available_skills(request):
    """
    API endpoint to get skills available for selection.
    Filters by faction to exclude other factions' skills.
    """
    version = GameVersion.objects.filter(is_active=True).first()
    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    faction_id = request.GET.get('faction', '')
    exclude_ids = request.GET.get('exclude', '').split(',') if request.GET.get('exclude') else []

    # Get the faction's own faction skill
    faction = Faction.objects.filter(version=version, id_key=faction_id).first()
    allowed_faction_skill = faction.faction_skill if faction else None

    # Get all other factions' skills to exclude
    other_faction_skills = set(
        Faction.objects.filter(version=version)
        .exclude(id_key=faction_id)
        .exclude(faction_skill='')
        .values_list('faction_skill', flat=True)
    )

    skills_data = []
    for skill in Skill.objects.filter(version=version).order_by('skill_type', 'id_key'):
        # Skip if already selected
        if skill.id_key in exclude_ids:
            continue
        # For Faction-type skills, only allow the hero's own faction skill
        if skill.skill_type == 'Faction':
            if skill.id_key != allowed_faction_skill:
                continue

        info = get_skill_info(skill.id_key, level=1)

        # Get ALL subskills from level 2 and level 3 data
        subskill_preview = []
        params = skill.raw_data.get('parametersPerLevel', [])

        # Collect subskill IDs from both levels
        all_subskill_ids = []
        if len(params) >= 2:
            all_subskill_ids.extend(params[1].get('subSkills', []))
        if len(params) >= 3:
            all_subskill_ids.extend(params[2].get('subSkills', []))

        # Get full info for each subskill
        for sub_id in all_subskill_ids:
            sub_info = get_skill_info(sub_id, level=1)
            subskill_preview.append({
                'id': sub_id,
                'name': sub_info['name'],
                'description': sub_info['description'],
                'icon': f'{sub_id}_icon',  # Subskill icons have _icon suffix
            })

        # Get description args for dynamic description computation
        localizations = get_localizations()
        skill_args = get_skill_args()

        # Try multiple desc key patterns (skill_id_desc or from parametersPerLevel)
        desc_key = skill.raw_data.get('parametersPerLevel', [{}])[0].get('desc', f"{skill.id_key}_desc")
        description_template = localizations.get(desc_key, "")
        description_args = skill_args.get(desc_key, [])

        skills_data.append({
            'id': skill.id_key,
            'type': skill.skill_type,
            'name': info['name'],
            'description': info['description'],  # Keep for fallback
            'description_template': description_template,
            'description_args': description_args,
            'raw_data': skill.raw_data,
            'icon': skill.id_key,
            'subskill_preview': subskill_preview,
        })

    return JsonResponse({'skills': skills_data})


def api_skills_combat(request):
    """API endpoint to get skills with combat effects."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    skills_data = []
    for skill in Skill.objects.filter(version=version).order_by('skill_type', 'id_key'):
        # Get skill info with localized name and description
        info = get_skill_info(skill.id_key, level=1)

        skills_data.append({
            'id': skill.id_key,
            'name': info['name'],
            'description': info['description'],
            'type': skill.skill_type,
            'values': skill.extracted_values,
        })

    return JsonResponse({'skills': skills_data})


def api_skill_subskills(request, skill_id, level):
    """
    API endpoint to get subskills when leveling up a skill.
    """
    version = GameVersion.objects.filter(is_active=True).first()
    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    if level not in [2, 3]:
        return JsonResponse({'error': 'Level must be 2 or 3'}, status=400)

    skill = Skill.objects.filter(version=version, id_key=skill_id).first()
    if not skill:
        return JsonResponse({'error': 'Skill not found'}, status=404)

    # Get upgraded skill info
    skill_info = get_skill_info(skill_id, level=level)
    icon_suffix = f'_{level}' if level > 1 else ''

    # Get subskills from raw_data
    params = skill.raw_data.get('parametersPerLevel', [])
    if len(params) < level:
        return JsonResponse({'error': 'Invalid skill level data'}, status=500)

    subskill_ids = params[level - 1].get('subSkills', [])

    # Get localizations and args for dynamic descriptions
    localizations = get_localizations()
    skill_args = get_skill_args()
    subskill_configs = get_subskill_configs()

    subskills_data = []
    for sub_id in subskill_ids:
        sub_info = get_skill_info(sub_id, level=1)
        sub_config = subskill_configs.get(sub_id, {})

        # Get description template and args for dynamic formatting
        desc_key = sub_config.get('desc', f'{sub_id}_desc')
        description_template = localizations.get(desc_key, '')
        description_args = skill_args.get(desc_key, [])

        subskills_data.append({
            'id': sub_id,
            'name': sub_info['name'],
            'description_template': description_template,
            'description_args': description_args,
            'raw_data': sub_config,
            'icon': f'{sub_id}_icon',  # Subskill icons have _icon suffix
        })

    return JsonResponse({
        'skill': {
            'id': skill_id,
            'level': level,
            'name': skill_info['name'],
            'description': skill_info['description'],
            'icon': f'{skill_id}{icon_suffix}',
        },
        'subskills': subskills_data,
    })


def api_advanced_classes(request):
    """
    API endpoint to get available advanced classes.
    Query params: faction (required), class_type (required)
    """
    version = GameVersion.objects.filter(is_active=True).first()
    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    faction_slug = request.GET.get('faction')
    class_type = request.GET.get('class_type')

    if not faction_slug or not class_type:
        return JsonResponse({'error': 'faction and class_type required'}, status=400)

    # Import AdvancedClass from gamedata.models
    from gamedata.models import AdvancedClass

    # Get faction to look up base class name
    faction = Faction.objects.filter(version=version, slug=faction_slug).first()
    if not faction:
        return JsonResponse({'error': 'Faction not found'}, status=404)

    # Get base class name, description, and icon from localizations
    localizations = get_localizations()
    base_class_name_key = f"{class_type}_{faction.id_key}_name"
    base_class_desc_key = f"{class_type}_desc"  # Generic description for might/magic
    base_class_name = localizations.get(base_class_name_key, class_type.title())
    base_class_desc = localizations.get(base_class_desc_key, '')
    # Use generic might/magic icon (not faction-specific)
    base_class_icon_url = f"/media/gamedata/ui/{class_type}_icon.png"

    classes_qs = AdvancedClass.objects.filter(
        version=version,
        faction__slug=faction_slug,
        class_type=class_type
    ).select_related('faction')

    classes_data = []
    for adv_class in classes_qs:
        info = adv_class.display_info
        classes_data.append({
            'id': adv_class.id_key,
            'name': info['name'],
            'description': info['description'],
            'description_template': info.get('description_template', info['description']),
            'description_args': info.get('description_args', []),
            'icon_url': adv_class.icon_url,
            'required_skills': adv_class.required_skill_ids,
            'activation_conditions': adv_class.activation_conditions,
            'bonuses': adv_class.bonuses or [],
            'raw_data': adv_class.raw_data or {},
        })

    return JsonResponse({
        'base_class_name': base_class_name,
        'base_class_description': base_class_desc,
        'base_class_icon_url': base_class_icon_url,
        'advanced_classes': classes_data
    })


def api_advanced_class_skill_indicators(request):
    """
    API endpoint to get skill-to-advanced-class mapping.
    Query params: faction (required), class_type (required)
    Returns: {skill_indicators: {skill_id: [{class_id, icon_url}, ...]}}
    """
    version = GameVersion.objects.filter(is_active=True).first()
    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    faction_slug = request.GET.get('faction')
    class_type = request.GET.get('class_type')

    if not faction_slug or not class_type:
        return JsonResponse({'error': 'faction and class_type required'}, status=400)

    from gamedata.models import AdvancedClass

    classes_qs = AdvancedClass.objects.filter(
        version=version,
        faction__slug=faction_slug,
        class_type=class_type
    )

    # Build skill -> [advanced classes] mapping
    skill_indicators = {}
    for adv_class in classes_qs:
        for skill_id in adv_class.required_skill_ids:
            if skill_id not in skill_indicators:
                skill_indicators[skill_id] = []
            skill_indicators[skill_id].append({
                'class_id': adv_class.id_key,
                'icon_url': adv_class.icon_url,
            })

    return JsonResponse({'skill_indicators': skill_indicators})


def api_available_items(request):
    """
    API endpoint to get available items for equipment slots.
    Query params:
        slot (required): Equipment slot type (head, armor, weapon, etc.)
    Returns: {items: [...]}
    """
    version = GameVersion.objects.filter(is_active=True).first()
    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    slot_param = request.GET.get('slot', '')

    # Map frontend slot names to database slot names
    slot_mapping = {
        'head': 'head',
        'armor': 'armor',
        'back': 'back',
        'belt': 'belt',
        'boots': 'boots',
        'weapon': 'left_hand',
        'shield': 'right_hand',
        'ring': 'ring',
        'accessory': 'item_slot',
        'unique': 'unic_slot',
    }

    db_slot = slot_mapping.get(slot_param)
    if not db_slot:
        return JsonResponse({'error': f'Invalid slot type: {slot_param}'}, status=400)

    items = Item.objects.filter(version=version, slot=db_slot)

    items_data = []
    for item in items:
        # Get localized info including narrative description
        item_info = get_item_info(item.id_key)

        items_data.append({
            'id': item.id_key,
            'icon': item.icon,
            'rarity': item.rarity,
            'max_level': item.max_level,
            'cost_base': item.cost_base,
            'cost_per_level': item.cost_per_level,
            'item_set': item.item_set,
            'raw_data': item.raw_data,
            # Localized fields
            'name': item_info['name'],
            'description_template': item_info['description_template'],
            'description_args': item_info['description_args'],
            'upgrade_description_template': item_info['upgrade_description_template'],
            'upgrade_description_args': item_info['upgrade_description_args'],
            'narrative_description': item_info['narrative_description'],
        })

    return JsonResponse({'items': items_data})


@require_GET
def api_item_sets(request):
    """
    API endpoint to get all item sets with their metadata.
    Returns: {item_sets: [{id, name, items, bonuses}, ...]}
    """
    version = GameVersion.objects.filter(is_active=True).first()
    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    item_sets = ItemSet.objects.filter(version=version)

    sets_data = []
    for item_set in item_sets:
        raw = item_set.raw_data or {}
        bonuses = raw.get("bonuses", [])

        # Get localized info
        set_info = get_item_set_info(item_set.id_key, bonuses)

        sets_data.append({
            'id': item_set.id_key,
            'name': set_info['name'],
            'items': raw.get('itemsInSet', []),
            'bonuses': set_info['bonuses'],
            'raw_data': raw,
        })

    return JsonResponse({'item_sets': sets_data})


@require_GET
def api_available_spells(request):
    """
    API endpoint to get available spells with their metadata.
    Returns all spells grouped by school with full spell configuration.
    """
    version = GameVersion.objects.filter(is_active=True).first()
    if not version:
        return JsonResponse({'error': 'No game version found'}, status=404)

    spells = Spell.objects.filter(version=version).select_related('version')
    schools = MagicSchool.objects.filter(version=version)

    # Build school lookup
    school_names = {s.id_key: s.display_name for s in schools}

    spell_list = []
    bonus_spell_list = []  # Skill-granted spells (not learnable, but shown when skill acquired)

    for spell in spells:
        # Skip masterful variants - they're upgrades, not separate learnable spells
        if spell.id_key.endswith('_special'):
            continue

        raw = spell.raw_data or {}

        # Separate bonus spells - these are skill-granted effects, not learnable spells
        is_bonus_spell = spell.id_key.startswith('bonus_')

        # Extract spell type (combat vs global) from raw_data
        # Check usedOnMap field to determine if spell is used on adventure map
        spell_type = 'global' if raw.get('usedOnMap') else 'combat'

        # Extract max upgrade level from upgradeCost or manaCost arrays
        # upgradeCost has [cost_for_level_2, cost_for_level_3, cost_for_level_4] (3 entries = 4 levels)
        # manaCost has [level_1, level_2, level_3, level_4] (4 entries = 4 levels)
        # Max level = number of upgrades + 1 (starting level)
        upgrade_cost = raw.get('upgradeCost', [])
        mana_cost = raw.get('manaCost', [])
        max_upgrade_level = (len(upgrade_cost) + 1) if upgrade_cost else (len(mana_cost) if mana_cost else 1)

        # Get spell rank/tier from raw_data
        rank = raw.get('rank', spell.level)

        # Get localized spell info with description template and args
        # Pass raw_data so custom name keys (like skill_summoner_name_1) can be resolved
        spell_info = get_spell_info(spell.id_key, raw_data=raw)

        # Get descriptions for each upgrade level (spells can have different descriptions per level)
        description_keys = raw.get('description', [])
        descriptions_by_level = get_spell_descriptions_by_level(description_keys)

        spell_data = {
            'id': spell.id_key,
            'id_key': spell.id_key,
            'name': spell_info['name'],  # Localized spell name
            'icon': raw.get('icon', spell.id_key),  # Icon filename (without extension)
            'school': spell.school,
            'school_display': school_names.get(spell.school, spell.school.title() + ' Magic'),
            'level': rank,  # Use rank instead of database level field
            'spell_type': spell_type,
            'max_upgrade_level': max_upgrade_level,
            'raw_data': raw,
            # Descriptions per upgrade level (index 0 = level 1, etc.)
            'descriptions': descriptions_by_level,
            # Keep legacy fields for backwards compatibility (level 1 description)
            'description_template': spell_info['description_template'],
            'description_args': spell_info['description_args'],
        }

        if is_bonus_spell:
            bonus_spell_list.append(spell_data)
        else:
            spell_list.append(spell_data)

    schools_list = [{'id': s.id_key, 'name': s.display_name} for s in schools]

    return JsonResponse({
        'spells': spell_list,
        'bonus_spells': bonus_spell_list,  # Skill-granted spells
        'schools': schools_list
    })
