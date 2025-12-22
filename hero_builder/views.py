"""
Views for the Hero Builder application.
"""
import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from gamedata.models import GameVersion, Hero, Faction, Item, ItemSet, Skill, Unit, Spell, MagicSchool
from core.localizations import get_skill_info, get_localizations, get_item_info, get_item_set_info, get_skill_args, get_subskill_configs, get_spell_info, get_spell_descriptions_by_level, get_unit_ability_args, get_ui_strings
from core.unit_type_mapping import ATTACK_TYPE_LOCALIZATION_KEYS, MOVE_TYPE_LOCALIZATION_KEYS
import re


def get_ability_display_name(ability_id: str, unit_raw_data: dict = None) -> str:
    """Convert ability ID to display name using localizations.

    Ability IDs use 0-based indexing (e.g., fairy_dragon_ability_0)
    but localizations use 1-based indexing (e.g., fairy_dragon_ability_1_name).

    For auras that are localized as passives (e.g., Aegis), pass unit_raw_data
    to correctly determine the passive index for localization lookup.
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

    # Some auras are localized as passives (e.g., Aegis uses esquire_passive_2)
    if ability_id.endswith('_aura'):
        base_unit_id = re.sub(r'_upg(_alt)?_aura$', '', ability_id)
        if base_unit_id == ability_id:  # No _upg suffix
            base_unit_id = ability_id.replace('_aura', '')

        # Calculate the correct passive index based on displayable passives count
        start_idx = 1
        if unit_raw_data:
            # Count displayable passives (those with effects other than just immunities)
            displayable_count = 0
            for passive in unit_raw_data.get('passives', []):
                data = passive.get('data', {})
                if data and list(data.keys()) == ['immunities']:
                    continue
                displayable_count += 1
            # Aura localized as passive uses the next index after displayable passives
            start_idx = displayable_count + 1

        # Try passive indices starting from the calculated index
        for idx in range(start_idx, start_idx + 5):
            passive_name_key = f"{base_unit_id}_passive_{idx}_name"
            if passive_name_key in localizations:
                return localizations[passive_name_key]

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


def get_ability_info(ability_id: str, unit_raw_data: dict = None) -> dict:
    """Get ability info including name, description template, args, and icon URL.

    Uses the same index conversion logic as get_ability_display_name.
    Returns dict with: name, description_template, description_args, icon_url

    For auras that are localized as passives (e.g., Aegis), pass unit_raw_data
    to correctly determine the passive index for localization lookup.
    """
    import os
    from django.conf import settings

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
    icon_key = localization_key  # Start with the 1-based key
    if not description_template:
        base_key = re.sub(r'_upg(_alt)?', '', localization_key)
        base_desc_key = f"{base_key}_description"
        description_template = localizations.get(base_desc_key, "")
        description_args = args_data.get(base_desc_key, [])
        icon_key = base_key  # Use base unit's icon for upgrades

    # Try aura suffix directly
    if not description_template and ability_id.endswith('_aura'):
        aura_desc_key = f"{ability_id}_description"
        description_template = localizations.get(aura_desc_key, "")
        description_args = args_data.get(aura_desc_key, [])

    # Some auras are localized as passives (e.g., Aegis uses esquire_passive_2)
    # Try passive localization keys if aura-specific keys not found
    if not description_template and ability_id.endswith('_aura'):
        base_unit_id = re.sub(r'_upg(_alt)?_aura$', '', ability_id)
        if base_unit_id == ability_id:  # No _upg suffix
            base_unit_id = ability_id.replace('_aura', '')

        # Calculate the correct passive index based on displayable passives count
        start_idx = 1
        if unit_raw_data:
            # Count displayable passives (those with effects other than just immunities)
            displayable_count = 0
            for passive in unit_raw_data.get('passives', []):
                data = passive.get('data', {})
                if data and list(data.keys()) == ['immunities']:
                    continue
                displayable_count += 1
            # Aura localized as passive uses the next index after displayable passives
            start_idx = displayable_count + 1

        # Try passive indices starting from the calculated index
        for idx in range(start_idx, start_idx + 5):
            passive_desc_key = f"{base_unit_id}_passive_{idx}_description"
            if passive_desc_key in localizations:
                description_template = localizations.get(passive_desc_key, "")
                description_args = args_data.get(passive_desc_key, [])
                icon_key = f"{base_unit_id}_passive_{idx}"
                break

    # Generate icon URL - icons are named {unit}_{passive|ability}_{n}_name.png
    icon_filename = f"{icon_key}_name.png"
    icon_path = os.path.join(settings.MEDIA_ROOT, 'gamedata', 'passives', icon_filename)
    icon_url = f"/media/gamedata/passives/{icon_filename}" if os.path.exists(icon_path) else None

    return {
        'name': get_ability_display_name(ability_id, unit_raw_data),
        'description_template': description_template,
        'description_args': description_args,
        'icon_url': icon_url,
    }


def get_raw_ability_data(ability_id: str, unit_raw_data: dict, unit_id: str = None) -> dict | None:
    """Extract raw ability data from unit's raw_data based on ability ID.

    Ability IDs are in format: {unit_id}_{type}_{index} where:
    - type is 'passive', 'ability', or 'aura'
    - index is 0-based and cumulative across the baseSid inheritance chain

    For units with baseSid inheritance (e.g., graverobber_upg_alt -> graverobber_upg):
    - Abilities are inherited from the base unit first
    - New abilities are added at higher indices
    - E.g., ability_0/ability_1 may be in the base unit, ability_2/ability_3 in the derived unit

    Returns the raw ability dict or None if not found.
    """
    if not ability_id:
        return None

    # Handle auras
    if ability_id.endswith('_aura'):
        aura_data = unit_raw_data.get('aura')
        if aura_data:
            return aura_data
        return None

    # Parse ability ID to get type and index
    passive_match = re.search(r'_passive_(\d+)$', ability_id)
    if passive_match:
        index = int(passive_match.group(1))
        return _find_ability_with_inheritance(unit_raw_data, 'passives', index)

    ability_match = re.search(r'_ability_(\d+)$', ability_id)
    if ability_match:
        index = int(ability_match.group(1))
        return _find_ability_with_inheritance(unit_raw_data, 'abilities', index)

    return None


def _find_ability_with_inheritance(unit_raw_data: dict, ability_type: str, index: int) -> dict | None:
    """Find ability data following the baseSid inheritance chain.

    Units can inherit abilities from their baseSid parent. The indices are cumulative:
    - Base unit abilities come first
    - Derived unit abilities are appended after

    For example, if baseSid unit has 2 abilities and this unit has 2 more:
    - index 0, 1 -> baseSid unit's abilities[0], [1]
    - index 2, 3 -> this unit's abilities[0], [1]
    """
    if not unit_raw_data:
        return None

    # Build the full ability list by following baseSid chain
    all_abilities = _collect_abilities_from_chain(unit_raw_data, ability_type)

    if index < len(all_abilities):
        return all_abilities[index]

    return None


def _collect_abilities_from_chain(unit_raw_data: dict, ability_type: str, visited: set = None) -> list:
    """Collect abilities from the entire baseSid inheritance chain.

    Returns a list where base unit abilities come first, followed by derived unit abilities.
    """
    if visited is None:
        visited = set()

    if not unit_raw_data:
        return []

    # Get baseSid and prevent infinite loops
    base_sid = unit_raw_data.get('baseSid')

    base_abilities = []
    if base_sid and base_sid not in visited:
        visited.add(base_sid)
        try:
            base_unit = Unit.objects.filter(id_key=base_sid).first()
            if base_unit and base_unit.raw_data:
                base_abilities = _collect_abilities_from_chain(base_unit.raw_data, ability_type, visited)
        except Exception:
            pass

    # Append this unit's abilities after base abilities
    own_abilities = unit_raw_data.get(ability_type, [])

    return base_abilities + own_abilities


def _find_ability_in_upgrades(unit_id: str, ability_type: str, index: int) -> dict | None:
    """Find ability data in upgrade variants when base unit doesn't have it.

    Some abilities are defined in localization but only have raw data in
    upgraded unit variants (e.g., crossbowman_ability_1 exists in crossbowman_upg_alt).
    """
    if not unit_id:
        return None

    # Get base unit ID (remove _upg, _upg_alt suffixes if present)
    base_unit_id = re.sub(r'_upg(_alt)?$', '', unit_id)

    # Try upgrade variants in order of likelihood
    upgrade_suffixes = ['_upg_alt', '_upg']
    for suffix in upgrade_suffixes:
        upgrade_id = f"{base_unit_id}{suffix}"
        try:
            upgrade_unit = Unit.objects.filter(id_key=upgrade_id).first()
            if upgrade_unit and upgrade_unit.raw_data:
                abilities_list = upgrade_unit.raw_data.get(ability_type, [])
                if index < len(abilities_list):
                    return abilities_list[index]
        except Exception:
            pass

    return None


def get_creature_type(unit_raw_data: dict) -> str:
    """Extract creature type from unit's raw_data based on immunity tags.

    Returns one of: living, undead, dragon, magic_creature, construct, embodiment, demon
    """
    passives = unit_raw_data.get('passives', [])
    for p in passives:
        if 'data' in p and 'immunities' in p['data']:
            for imm in p['data']['immunities']:
                for tag in imm.get('tags', []):
                    if tag.endswith('_immunities'):
                        return tag.replace('_immunities', '')
    return 'living'  # Default fallback


def get_base_passives(unit_raw_data: dict, attack_type: str) -> list:
    """Generate base passive info (creature type and attack type) for a unit.

    Returns list of passive dicts with id, name, description, icon_url.

    DEPRECATED: Use get_passives_from_view() instead when view data is available.
    """
    localizations = get_localizations()
    args_data = get_unit_ability_args()
    base_passives = []

    # Get creature type passive
    creature_type = get_creature_type(unit_raw_data)
    creature_key = f'base_class_{creature_type}'
    creature_desc_key = f'{creature_key}_description'
    creature_name = localizations.get(creature_key, creature_type.replace('_', ' ').title())
    creature_desc = localizations.get(creature_desc_key, '')

    base_passives.append({
        'id': creature_key,
        'name': creature_name,
        'description_template': creature_desc,
        'description_args': args_data.get(creature_desc_key, []),
        'icon_url': f'/media/gamedata/passives/{creature_key}.png',
        'is_base_passive': True,
    })

    # Get attack type passive
    attack_type_map = {
        'melee': 'base_passive_melee_attack',
        'ranged': 'base_passive_ranged_attack',
        'long_reach': 'base_passive_remote_attack',
    }
    attack_key = attack_type_map.get(attack_type, 'base_passive_melee_attack')
    attack_desc_key = f'{attack_key}_description'
    attack_name = localizations.get(f'{attack_key}_name', 'Attack')
    attack_desc = localizations.get(attack_desc_key, '')

    base_passives.append({
        'id': attack_key,
        'name': attack_name,
        'description_template': attack_desc,
        'description_args': args_data.get(attack_desc_key, []),
        'icon_url': f'/media/gamedata/passives/{attack_key}_name.png',
        'is_base_passive': True,
    })

    return base_passives


def get_passives_from_view(unit_raw_data: dict) -> tuple[dict | None, list]:
    """Get creature type and passives from unit's view file data.

    The view file contains pre-computed localization keys for all display data:
    - baseClass: creature type (e.g., {"name": "base_class_living"})
    - passives: all passives including attack type, Double Strike, Flying, Defence, etc.

    Returns:
        Tuple of (creature_type_passive, passives_list)
        Returns (None, []) if view data is not available.
    """
    import os
    from django.conf import settings

    view_data = unit_raw_data.get('view')
    if not view_data:
        return None, []

    localizations = get_localizations()
    args_data = get_unit_ability_args()

    # Get creature type from baseClass
    creature_type_passive = None
    base_class = view_data.get('baseClass', {})
    # Handle both list and dict format (some units have baseClass as a list with one element)
    if isinstance(base_class, list) and base_class:
        base_class = base_class[0]
    if base_class:
        creature_key = base_class.get('name', '')  # e.g., "base_class_living"
        creature_desc_key = base_class.get('description', f'{creature_key}_description')

        creature_name = localizations.get(creature_key, '')
        creature_desc = localizations.get(creature_desc_key, '')

        icon_path = os.path.join(settings.MEDIA_ROOT, 'gamedata', 'passives', f'{creature_key}.png')
        icon_url = f'/media/gamedata/passives/{creature_key}.png' if os.path.exists(icon_path) else None

        creature_type_passive = {
            'id': creature_key,
            'name': creature_name,
            'description_template': creature_desc,
            'description_args': args_data.get(creature_desc_key, []),
            'icon_url': icon_url,
            'is_base_passive': True,
        }

    # Get all passives from view file
    passives = []
    for passive_data in view_data.get('passives', []):
        name_key = passive_data.get('name', '')  # e.g., "base_passive_melee_attack_name"
        desc_key = passive_data.get('description', '')  # e.g., "base_passive_melee_attack_description"

        # Get localized name and description
        name = localizations.get(name_key, '')
        description_template = localizations.get(desc_key, '')
        description_args = args_data.get(desc_key, [])

        # Generate icon URL - icons use the name key (e.g., base_passive_melee_attack_name.png)
        icon_filename = f"{name_key}.png"
        icon_path = os.path.join(settings.MEDIA_ROOT, 'gamedata', 'passives', icon_filename)
        icon_url = f"/media/gamedata/passives/{icon_filename}" if os.path.exists(icon_path) else None

        passives.append({
            'id': name_key.replace('_name', ''),  # Remove _name suffix for ID
            'name': name,
            'description_template': description_template,
            'description_args': description_args,
            'icon_url': icon_url,
            'is_base_passive': True,
        })

    return creature_type_passive, passives


def get_abilities_from_view(unit_raw_data: dict) -> list:
    """Get abilities from unit's view file data.

    The view file contains pre-computed localization keys for abilities:
    - abilities: list of {name, description} with correct localization keys

    The view file abilities are matched to raw_data abilities by array index,
    not by the ability ID number (which refers to the base unit's naming scheme).

    Returns:
        List of ability dicts with id, name, description_template, description_args, icon_url, raw_data
        Returns [] if view data is not available.
    """
    import os
    from django.conf import settings

    view_data = unit_raw_data.get('view')
    if not view_data:
        return []

    localizations = get_localizations()
    args_data = get_unit_ability_args()
    raw_abilities = unit_raw_data.get('abilities', [])

    abilities = []
    for idx, ability_data in enumerate(view_data.get('abilities', [])):
        name_key = ability_data.get('name', '')  # e.g., "lightweaver_ability_4_name"
        desc_key = ability_data.get('description', '')  # e.g., "lightweaver_ability_4_description"

        # Get localized name and description
        name = localizations.get(name_key, '')
        description_template = localizations.get(desc_key, '')
        description_args = args_data.get(desc_key, [])

        # Generate icon URL - icons use the name key
        icon_filename = f"{name_key}.png"
        icon_path = os.path.join(settings.MEDIA_ROOT, 'gamedata', 'passives', icon_filename)
        icon_url = f"/media/gamedata/passives/{icon_filename}" if os.path.exists(icon_path) else None

        # Get ability ID (for display) and raw data (for description resolution)
        # Raw data is matched by index, not by the number in the localization key
        ability_id = name_key.replace('_name', '')  # Remove _name suffix for ID
        raw_ability = raw_abilities[idx] if idx < len(raw_abilities) else None

        abilities.append({
            'id': ability_id,
            'name': name,
            'description_template': description_template,
            'description_args': description_args,
            'icon_url': icon_url,
            'raw_data': raw_ability,
        })

    return abilities


def index(request):
    """Combined faction and hero selection page."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return render(request, 'hero_builder/no_data.html')

    factions = Faction.objects.filter(version=version).exclude(id_key='neutral')

    # Check for faction query param, otherwise default to first faction (Temple)
    faction_slug = request.GET.get('faction')
    if faction_slug:
        selected_faction = factions.filter(slug=faction_slug).first() or factions.first()
    else:
        selected_faction = factions.first()

    heroes = Hero.objects.filter(version=version, faction=selected_faction).order_by('sort_order') if selected_faction else []

    # Get localizations
    localizations = get_localizations()

    # Add localized names to factions
    for faction in factions:
        # Faction names use pattern: {id_key}_name (e.g., human_name, undead_name)
        faction_key = f"{faction.id_key}_name"
        faction.localized_name = localizations.get(faction_key)

    # Add localized names to heroes
    for hero in heroes:
        # Hero names use the hero's id_key as localization key
        hero.localized_name = localizations.get(hero.id_key, hero.display_name)
        # Specialization names use pattern: {hero_id}_spec_name
        spec_key = f"{hero.id_key}_spec_name"
        hero.localized_spec_name = localizations.get(spec_key, hero.specialization_name)

    # Get UI strings (non-game strings like button labels, modal titles, etc.)
    ui_strings = get_ui_strings()

    context = {
        'version': version,
        'factions': factions,
        'selected_faction': selected_faction,
        'heroes': heroes,
        'ui': ui_strings,
    }
    return render(request, 'hero_builder/index.html', context)


def faction_heroes(request, faction_slug):
    """Hero selection partial for a specific faction (HTMX endpoint)."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return render(request, 'hero_builder/no_data.html')

    faction = get_object_or_404(Faction, version=version, slug=faction_slug)
    heroes = Hero.objects.filter(version=version, faction=faction).order_by('sort_order')

    # Get localizations
    localizations = get_localizations()

    # Add localized name to faction
    faction_key = f"{faction.id_key}_name"
    faction.localized_name = localizations.get(faction_key)

    # Add localized names to heroes
    for hero in heroes:
        # Hero names use the hero's id_key as localization key
        hero.localized_name = localizations.get(hero.id_key, hero.display_name)
        # Specialization names use pattern: {hero_id}_spec_name
        spec_key = f"{hero.id_key}_spec_name"
        hero.localized_spec_name = localizations.get(spec_key, hero.specialization_name)

    # Get UI strings (non-game strings like button labels, modal titles, etc.)
    ui_strings = get_ui_strings()

    context = {
        'version': version,
        'faction': faction,
        'heroes': heroes,
        'ui': ui_strings,
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

    # Add localized hero name and specialization
    localizations = get_localizations()
    hero.localized_name = localizations.get(hero.id_key, hero.display_name)
    spec_key = f"{hero.id_key}_spec_name"
    hero.localized_spec_name = localizations.get(spec_key, hero.specialization_name)
    spec_desc_key = f"{hero.id_key}_spec_description"
    hero.localized_spec_desc = localizations.get(spec_desc_key, hero.specialization_desc)

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

    # Get rarity translations for JavaScript
    rarity_translations = {
        'common': localizations.get('world_cheat_dropdown_common', 'Common'),
        'uncommon': localizations.get('world_cheat_dropdown_uncommon', 'Uncommon'),
        'rare': localizations.get('world_cheat_dropdown_rare', 'Rare'),
        'epic': localizations.get('world_cheat_dropdown_epic', 'Epic'),
        'legendary': localizations.get('world_cheat_dropdown_legendary', 'Legendary'),
        'mythic': localizations.get('world_cheat_dropdown_mythic', 'Mythic'),
    }

    # Get UI strings (non-game strings like button labels, modal titles, etc.)
    ui_strings = get_ui_strings()

    # Get slot name translations from game files
    slot_name_translations = {
        'armor': localizations.get('armor'),
        'back': localizations.get('back'),
        'belt': localizations.get('belt'),
        'boots': localizations.get('boots'),
        'head': localizations.get('head'),
        'item_slot': localizations.get('item_slot'),
        'left_hand': localizations.get('left_hand'),
        'right_hand': localizations.get('right_hand'),
        'ring': localizations.get('ring'),
        'unic_slot': localizations.get('unic_slot'),
    }

    # Get unit type translations from game files
    # Mappings are defined in core.unit_type_mapping
    # To add new types: update ATTACK_TYPE_LOCALIZATION_KEYS or MOVE_TYPE_LOCALIZATION_KEYS
    attack_type_translations = {
        attack_type: localizations.get(key)
        for attack_type, key in ATTACK_TYPE_LOCALIZATION_KEYS.items()
    }

    move_type_translations = {
        move_type: localizations.get(key) if key else None
        for move_type, key in MOVE_TYPE_LOCALIZATION_KEYS.items()
    }

    # Combine all unit-related translations
    unit_type_translations = {
        'tier': localizations.get('tier'),
        **attack_type_translations,
        **move_type_translations,
    }

    # Get unit stat translations from game files
    unit_stat_translations = {
        'hp': localizations.get('unit_health', 'Health'),
        'damage': localizations.get('unitStat_damage', 'Damage'),
        'offence': localizations.get('unitStat_offence', 'Attack'),
        'defence': localizations.get('unitStat_defence', 'Defence'),
        'luck': localizations.get('unitStat_luck', 'Luck'),
        'morale': localizations.get('unitStat_moral', 'Morale'),  # Note: game uses "moral" not "morale"
        'speed': localizations.get('unitStat_speed', 'Speed'),
        'initiative': localizations.get('unitStat_initiative', 'Initiative'),
        # Descriptions
        'hp_desc': ui_strings.get('unit_hp_desc', 'Hit points per creature'),
        'damage_desc': localizations.get('unitStat_damage_description', 'Base damage dealt per attack'),
        'offence_desc': localizations.get('unitStat_offence_description', 'Increases damage dealt'),
        'defence_desc': localizations.get('unitStat_defence_description', 'Reduces damage taken'),
        'luck_desc': localizations.get('unitStat_luck_description', 'Chance for critical hits'),
        'morale_desc': localizations.get('unitStat_moral_description', 'Chance for extra actions'),
        'speed_desc': ui_strings.get('unit_speed_desc', 'Movement range in combat'),
        'initiative_desc': ui_strings.get('unit_initiative_desc', 'Determines turn order'),
    }

    context = {
        'version': version,
        'hero': hero,
        'items_by_slot': items_by_slot,
        'skills': skills,
        'units': units,
        'rarity_translations': rarity_translations,
        'slot_names': slot_name_translations,
        'unit_types': unit_type_translations,
        'unit_stats': unit_stat_translations,
        'ui': ui_strings,
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

    # Get localizations for unit names
    localizations = get_localizations()

    units_data = []
    for unit in units_qs.order_by('faction', 'tier', 'id_key'):
        # Unit names use pattern: {unit_id}_name
        unit_name_key = f"{unit.id_key}_name"
        localized_name = localizations.get(unit_name_key, unit.display_name)

        units_data.append({
            'id': unit.id_key,
            'name': localized_name,
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

        # Try to get passives and abilities from view file data (preferred)
        creature_type_passive, view_passives = get_passives_from_view(unit.raw_data)
        view_abilities = get_abilities_from_view(unit.raw_data)

        if view_passives:
            # Use view file data (includes all passives: attack type, Double Strike, Defence, etc.)
            passives = []
            if creature_type_passive:
                passives.append(creature_type_passive)
            passives.extend(view_passives)
            actives = view_abilities
        else:
            # Fallback to legacy derivation if view data not available
            base_passives = get_base_passives(unit.raw_data, unit.attack_type)
            passives = list(base_passives)
            actives = []
            for ability_id in (unit.abilities or []):
                ability_info = get_ability_info(ability_id, unit.raw_data)
                if not ability_info['description_template'] and not ability_info.get('icon_url'):
                    continue
                raw_ability = get_raw_ability_data(ability_id, unit.raw_data, unit.id_key)
                ability_data = {
                    'id': ability_id,
                    'name': ability_info['name'],
                    'description_template': ability_info['description_template'],
                    'description_args': ability_info['description_args'],
                    'icon_url': ability_info.get('icon_url'),
                    'raw_data': raw_ability,
                }
                if '_passive_' in ability_id or ability_id.endswith('_aura'):
                    passives.append(ability_data)
                else:
                    actives.append(ability_data)

        units_by_tier[tier].append({
            'id': unit.id_key,
            'name': unit.display_name,
            'description': unit.description,
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
            'creature_type': get_creature_type(unit.raw_data),
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

    # Get localizations for unit names and descriptions
    localizations = get_localizations()

    # Group units by faction, then by tier
    factions_data = []
    for faction in factions:
        faction_units = [u for u in units if u.faction_id == faction.id]

        units_by_tier = {}
        for unit in faction_units:
            tier = str(unit.tier)
            if tier not in units_by_tier:
                units_by_tier[tier] = []

            # Try to get passives and abilities from view file data (preferred)
            creature_type_passive, view_passives = get_passives_from_view(unit.raw_data)
            view_abilities = get_abilities_from_view(unit.raw_data)

            if view_passives:
                # Use view file data (includes all passives: attack type, Double Strike, Defence, etc.)
                passives = []
                if creature_type_passive:
                    passives.append(creature_type_passive)
                passives.extend(view_passives)
                actives = view_abilities
            else:
                # Fallback to legacy derivation if view data not available
                base_passives = get_base_passives(unit.raw_data, unit.attack_type)
                passives = list(base_passives)
                actives = []
                for ability_id in (unit.abilities or []):
                    ability_info = get_ability_info(ability_id, unit.raw_data)
                    if not ability_info['description_template'] and not ability_info.get('icon_url'):
                        continue
                    raw_ability = get_raw_ability_data(ability_id, unit.raw_data, unit.id_key)
                    ability_data = {
                        'id': ability_id,
                        'name': ability_info['name'],
                        'description_template': ability_info['description_template'],
                        'description_args': ability_info['description_args'],
                        'icon_url': ability_info.get('icon_url'),
                        'raw_data': raw_ability,
                    }
                    if '_passive_' in ability_id or ability_id.endswith('_aura'):
                        passives.append(ability_data)
                    else:
                        actives.append(ability_data)

            # Get localized unit name and description
            unit_name_key = f"{unit.id_key}_name"
            localized_name = localizations.get(unit_name_key, unit.display_name)
            unit_desc_key = f"{unit.id_key}_narrativeDescription"
            localized_desc = localizations.get(unit_desc_key, unit.description)

            units_by_tier[tier].append({
                'id': unit.id_key,
                'name': localized_name,
                'description': localized_desc,
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
                'creature_type': get_creature_type(unit.raw_data),
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

    # Build school lookup with localized names
    localizations = get_localizations()
    school_names = {}
    for s in schools:
        # Magic school names use pattern: skill_magic_{school}_name
        # Exception: Neutral Magic uses world_cheat_dropdown_neutral
        if s.id_key == 'neutral':
            school_name_key = 'world_cheat_dropdown_neutral'
        else:
            school_name_key = f"skill_magic_{s.id_key}_name"
        school_names[s.id_key] = localizations.get(school_name_key, s.display_name)

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

    # Use localized school names
    schools_list = [{'id': s.id_key, 'name': school_names[s.id_key]} for s in schools]

    return JsonResponse({
        'spells': spell_list,
        'bonus_spells': bonus_spell_list,  # Skill-granted spells
        'schools': schools_list
    })
