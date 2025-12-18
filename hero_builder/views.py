"""
Views for the Hero Builder application.
"""
import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from gamedata.models import GameVersion, Hero, Faction, Item, Skill, Unit
from core.damage_calculator import (
    DamageCalculator, create_unit_stack_from_db, create_hero_build_from_db
)
from core.localizations import get_skill_info, get_localizations, get_item_info, get_skill_args, get_subskill_configs


def index(request):
    """Faction selection page."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return render(request, 'hero_builder/no_data.html')

    factions = Faction.objects.filter(version=version)

    context = {
        'version': version,
        'factions': factions,
    }
    return render(request, 'hero_builder/index.html', context)


def faction_heroes(request, faction_slug):
    """Hero selection page for a specific faction."""
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
    return render(request, 'hero_builder/heroes.html', context)


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


# =============================================================================
# Calculator Views
# =============================================================================

def calculator(request):
    """Combat calculator page."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return render(request, 'hero_builder/no_data.html')

    factions = Faction.objects.filter(version=version)
    heroes = Hero.objects.filter(version=version).order_by('faction', 'sort_order')
    units = Unit.objects.filter(version=version).order_by('faction', 'tier', 'id_key')

    context = {
        'version': version,
        'factions': factions,
        'heroes': heroes,
        'units': units,
    }
    return render(request, 'hero_builder/calculator.html', context)


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


@csrf_exempt
@require_http_methods(["POST"])
def api_calculate_damage(request):
    """
    API endpoint to calculate damage between two unit stacks.

    Request body:
    {
        "attacker": {
            "unit_id": "angel",
            "count": 10
        },
        "defender": {
            "unit_id": "black_dragon",
            "count": 5
        },
        "attacker_hero": {  // Optional
            "hero_id": "human_hero_1",
            "level": 10,
            "skills": [["skill_offence", 2], ["skill_archery", 1]]
        },
        "defender_hero": {  // Optional
            "hero_id": "dungeon_hero_1",
            "level": 8
        }
    }
    """
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    # Validate required fields
    if 'attacker' not in data or 'defender' not in data:
        return JsonResponse({'error': 'Missing attacker or defender'}, status=400)

    attacker_data = data['attacker']
    defender_data = data['defender']

    # Get units
    try:
        attacker_unit = Unit.objects.get(version=version, id_key=attacker_data['unit_id'])
        defender_unit = Unit.objects.get(version=version, id_key=defender_data['unit_id'])
    except Unit.DoesNotExist as e:
        return JsonResponse({'error': f'Unit not found: {e}'}, status=404)

    # Create unit stacks
    attacker_stack = create_unit_stack_from_db(
        attacker_unit,
        attacker_data.get('count', 1)
    )
    defender_stack = create_unit_stack_from_db(
        defender_unit,
        defender_data.get('count', 1)
    )

    # Get heroes if provided
    attacker_hero = None
    defender_hero = None

    if 'attacker_hero' in data and data['attacker_hero']:
        hero_data = data['attacker_hero']
        try:
            hero = Hero.objects.get(version=version, id_key=hero_data['hero_id'])
            attacker_hero = create_hero_build_from_db(
                hero,
                hero_data.get('level', 1),
                hero_data.get('skills', [])
            )
        except Hero.DoesNotExist:
            pass

    if 'defender_hero' in data and data['defender_hero']:
        hero_data = data['defender_hero']
        try:
            hero = Hero.objects.get(version=version, id_key=hero_data['hero_id'])
            defender_hero = create_hero_build_from_db(
                hero,
                hero_data.get('level', 1),
                hero_data.get('skills', [])
            )
        except Hero.DoesNotExist:
            pass

    # Calculate damage
    calculator = DamageCalculator()
    result = calculator.calculate_expected_damage(
        attacker_stack,
        defender_stack,
        attacker_hero,
        defender_hero
    )

    # Format response
    response = {
        'attacker': {
            'unit_id': attacker_stack.unit_id,
            'unit_name': attacker_stack.unit_name,
            'count': attacker_stack.count,
            'effective_offence': attacker_stack.stats.offence + (attacker_hero.computed_stats.offence if attacker_hero else 0),
        },
        'defender': {
            'unit_id': defender_stack.unit_id,
            'unit_name': defender_stack.unit_name,
            'count': defender_stack.count,
            'effective_defence': defender_stack.stats.defence + (defender_hero.computed_stats.defence if defender_hero else 0),
            'hp_per_unit': defender_stack.stats.hp,
        },
        'base_result': {
            'min_damage': result.base_result.min_damage,
            'max_damage': result.base_result.max_damage,
            'avg_damage': result.base_result.avg_damage,
            'kills_min': result.base_result.kills_min,
            'kills_max': result.base_result.kills_max,
            'kills_avg': result.base_result.kills_avg,
        },
        'modifiers': [
            {
                'source': m.source,
                'type': m.modifier_type,
                'value': m.value,
                'description': m.description,
            }
            for m in result.base_result.modifiers_applied
        ],
        'luck_chance': result.luck_trigger_chance,
        'morale_chance': result.morale_trigger_chance,
        'expected_avg_damage': result.expected_avg_damage,
        'expected_avg_kills': result.expected_avg_kills,
    }

    return JsonResponse(response)


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
            'icon_url': adv_class.icon_url,
            'required_skills': adv_class.required_skill_ids,
            'activation_conditions': adv_class.activation_conditions,
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
