"""
Utility functions for parsing item bonuses and getting item display names.

See /docs/item-description-system.md for documentation on how the game's
description placeholder system works.
"""
import json
import re
from functools import lru_cache
from pathlib import Path
from django.conf import settings
from core.localizations import get_localizations


@lru_cache(maxsize=1)
def _load_description_args() -> dict:
    """
    Load the description args mapping from game data.

    Returns:
        Dict mapping description SID to list of arg function names.
        Example: {"item_description": ["current_item_param_1"]}
    """
    args_file = settings.GAME_DATA_PATH / "StreamingAssets" / "Lang" / "args" / "artifacts.json"

    if not args_file.exists():
        return {}

    try:
        with open(args_file, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
            args_map = {}
            for token in data.get('tokensArgs', []):
                sid = token.get('sid', '')
                args = token.get('args', [])
                if sid and args:
                    args_map[sid] = args
            return args_map
    except (json.JSONDecodeError, IOError):
        return {}


# Hardcoded values for items that use special functions
# These are extracted from item.script where functions just return constant values
HARDCODED_ITEM_VALUES = {
    'excalibur_artifact_param': '1',
    'caduceus_artifact_param': '4',
    'seal_of_silence_artifact_param': '0',
    'ancient_idol_artifact_param_1': '40',
    'orb_of_destruction_artifact_param_1': '1',
    'current_item_chain_link_artifact_param_1': '1',
    'current_item_chain_link_artifact_param_2': '2',
    'current_item_ethereal_knowledge_vortex_dress_artifact_param_1': '50',
    'current_item_ethereal_knowledge_vortex_dress_artifact_param_2': '100',
    # Fallback constants (alt_text_constNumN_*)
    'alt_text_constNum3_radius': '3',
}


def _resolve_item_param(func_name: str, item_raw_data: dict, level: int = 1,
                        hero_view_radius: int = 6) -> str | None:
    """
    Resolve a single parameter function to its value.

    Args:
        func_name: Function name like "current_item_param_1" or "current_item_param_1_percent"
        item_raw_data: The item's raw_data dict containing bonuses
        level: Current upgrade level (1-based)
        hero_view_radius: Hero's view radius for hero-dependent calculations

    Returns:
        Resolved value as string, or None if cannot resolve
    """
    # Check hardcoded values first
    if func_name in HARDCODED_ITEM_VALUES:
        return HARDCODED_ITEM_VALUES[func_name]

    bonuses = item_raw_data.get('bonuses', [])
    item_id = item_raw_data.get('id', '')

    # Handle hero-dependent item: Sirin Mask (shamaniac_soul_gemwood_mask_artifact)
    if func_name == 'current_item_shamaniac_soul_gemwood_mask_artifact_param':
        # viewRadius * 3
        return str(hero_view_radius * 3)

    # Parse standard function patterns
    # current_item_param_N - bonuses[N-1].parameters[1] with upgrade
    # current_item_param_N_percent - same, as percent
    # current_item_param_N_int - bonuses[N-1].parameters[3]
    # current_item_param_N_modifier - bonuses[N-1].parameters[3] with upgrade from bonuses[N].parameters[3]
    # current_item_increment_param_N - bonuses[N-1].upgrade.increment

    # Match: current_item_param_N or current_item_param_N_suffix
    match = re.match(r'current_item_param_(\d+)(?:_(\w+))?$', func_name)
    if match:
        bonus_index = int(match.group(1)) - 1
        suffix = match.group(2)  # None, 'percent', 'int', 'modifier'

        if bonus_index < 0 or bonus_index >= len(bonuses):
            return None

        bonus = bonuses[bonus_index]
        params = bonus.get('parameters', [])
        upgrade = bonus.get('upgrade', {})

        if suffix == 'int':
            # Get parameters[3]
            if len(params) > 3:
                return str(int(float(params[3])))
            return None
        elif suffix == 'modifier' or suffix == 'int_modifier':
            # Get parameters[3] with upgrade from next bonus
            if len(params) > 3:
                base_value = float(params[3])
                # Upgrade increment comes from next bonus's parameters[3]
                if bonus_index + 1 < len(bonuses):
                    next_bonus = bonuses[bonus_index + 1]
                    next_params = next_bonus.get('parameters', [])
                    if len(next_params) > 3:
                        increment = float(next_params[3])
                        value = base_value + increment * (level - 1)
                        if suffix == 'int_modifier':
                            return str(int(value))
                        # For percent modifier, multiply by 100 if < 1
                        if abs(value) < 1:
                            return str(int(value * 100))
                        return str(int(value))
                return str(int(float(params[3])))
            return None
        else:
            # Standard param: parameters[1] with upgrade
            if len(params) > 1:
                try:
                    base_value = float(params[1])
                except (ValueError, TypeError):
                    return None

                increment = upgrade.get('increment', 0)
                level_step = upgrade.get('levelStep', 1)

                if level > 1 and increment and level_step > 0:
                    value = base_value + increment * ((level - 1) // level_step)
                else:
                    value = base_value

                if suffix == 'percent':
                    # Percent: multiply by 100 if < 1
                    if abs(value) < 1:
                        return str(int(value * 100))
                return str(int(value))
        return None

    # Match: current_item_increment_param_N or current_item_increment_param_N_percent
    match = re.match(r'current_item_increment_param_(\d+)(?:_(\w+))?$', func_name)
    if match:
        bonus_index = int(match.group(1)) - 1
        suffix = match.group(2)

        if bonus_index < 0 or bonus_index >= len(bonuses):
            return None

        bonus = bonuses[bonus_index]
        upgrade = bonus.get('upgrade', {})
        increment = upgrade.get('increment', 0)

        if suffix == 'percent' and abs(increment) < 1:
            return str(int(increment * 100))
        return str(int(increment))

    # Match: current_item_bonuses_parameters_2 (special case)
    if func_name == 'current_item_bonuses_parameters_2':
        if bonuses and len(bonuses[0].get('parameters', [])) > 2:
            return str(int(float(bonuses[0]['parameters'][2])))
        return None

    # Item-specific functions: current_item_{item_id}_param_N
    match = re.match(r'current_item_(\w+)_param(?:_(\d+))?$', func_name)
    if match:
        # These are usually special calculations - check hardcoded or return None
        return None

    return None


def get_description_value_info(func_name: str, item_raw_data: dict) -> dict | None:
    """
    Get metadata about how to calculate a description value.

    Returns dict with calculation info for client-side dynamic updates.
    Types:
        - static: Fixed value, no recalculation needed
        - item_param: Value from item's bonus data (may have upgrades)
        - hero_stat_multiplier: Hero stat * multiplier (e.g., viewRadius * 3)

    Returns None if cannot determine.
    """
    # Check hardcoded values first
    if func_name in HARDCODED_ITEM_VALUES:
        return {
            'type': 'static',
            'value': HARDCODED_ITEM_VALUES[func_name]
        }

    bonuses = item_raw_data.get('bonuses', [])

    # Handle hero-dependent item: Sirin Mask
    if func_name == 'current_item_shamaniac_soul_gemwood_mask_artifact_param':
        return {
            'type': 'hero_stat_multiplier',
            'stat': 'viewRadius',
            'multiplier': 3
        }

    # Parse standard function patterns
    match = re.match(r'current_item_param_(\d+)(?:_(\w+))?$', func_name)
    if match:
        bonus_index = int(match.group(1)) - 1
        suffix = match.group(2)

        if bonus_index < 0 or bonus_index >= len(bonuses):
            return None

        bonus = bonuses[bonus_index]
        params = bonus.get('parameters', [])
        upgrade = bonus.get('upgrade', {})

        if suffix == 'int' and len(params) > 3:
            return {
                'type': 'static',
                'value': str(int(float(params[3])))
            }

        if len(params) > 1:
            try:
                base_value = float(params[1])
            except (ValueError, TypeError):
                return None

            return {
                'type': 'item_param',
                'base': base_value,
                'increment': upgrade.get('increment', 0),
                'levelStep': upgrade.get('levelStep', 1),
                'isPercent': suffix == 'percent'
            }

    # Match increment patterns
    match = re.match(r'current_item_increment_param_(\d+)(?:_(\w+))?$', func_name)
    if match:
        bonus_index = int(match.group(1)) - 1
        suffix = match.group(2)

        if bonus_index < 0 or bonus_index >= len(bonuses):
            return None

        bonus = bonuses[bonus_index]
        upgrade = bonus.get('upgrade', {})
        increment = upgrade.get('increment', 0)

        return {
            'type': 'static',
            'value': str(int(increment * 100)) if suffix == 'percent' and abs(increment) < 1 else str(int(increment))
        }

    return None


def get_item_description_data(item_raw_data: dict) -> dict:
    """
    Get item description with metadata for client-side dynamic calculation.

    Returns:
        {
            'template': str,  # Description with {0}, {1} placeholders
            'values': [  # Value info for each placeholder
                {'type': 'static', 'value': '3'},
                {'type': 'hero_stat_multiplier', 'stat': 'viewRadius', 'multiplier': 3},
                ...
            ],
            'formatted': str,  # Pre-formatted with base hero stats
            'args': [],  # Function names for transpiled execution
            'upgrade_template': str,  # Upgrade description template
            'upgrade_args': [],  # Function names for upgrade description
            'upgrade_formatted': str,  # Pre-formatted upgrade description
        }
    """
    localizations = get_localizations()
    args_map = _load_description_args()

    result = {
        'template': '',
        'values': [],
        'formatted': '',
        'args': [],
        'upgrade_template': '',
        'upgrade_args': [],
        'upgrade_formatted': '',
    }

    # Process main description
    desc_key = item_raw_data.get('description', '')
    if desc_key:
        desc_text = localizations.get(desc_key, '')
        if desc_text:
            args = args_map.get(desc_key, [])
            value_infos = []
            base_values = []

            for arg in args:
                parts = arg.split('|')
                value_info = None
                base_value = '?'

                for part in parts:
                    part = part.strip()
                    info = get_description_value_info(part, item_raw_data)
                    if info:
                        value_info = info
                        if info['type'] == 'static':
                            base_value = info['value']
                        elif info['type'] == 'item_param':
                            base_value = str(int(info['base']))
                        elif info['type'] == 'hero_stat_multiplier':
                            default_stats = {'viewRadius': 6}
                            stat_value = default_stats.get(info['stat'], 1)
                            base_value = str(int(stat_value * info['multiplier']))
                        break

                value_infos.append(value_info or {'type': 'unknown'})
                base_values.append(base_value)

            try:
                formatted = desc_text.format(*base_values) if base_values else desc_text
            except (IndexError, KeyError):
                formatted = desc_text

            result['template'] = desc_text
            result['values'] = value_infos
            result['formatted'] = formatted
            result['args'] = args

    # Process upgrade description
    upgrade_key = item_raw_data.get('upgradeDescription', '')
    if upgrade_key:
        upgrade_text = localizations.get(upgrade_key, '')
        if upgrade_text:
            upgrade_args = args_map.get(upgrade_key, [])
            upgrade_base_values = []

            for arg in upgrade_args:
                parts = arg.split('|')
                base_value = '?'

                for part in parts:
                    part = part.strip()
                    info = get_description_value_info(part, item_raw_data)
                    if info:
                        if info['type'] == 'static':
                            base_value = info['value']
                        elif info['type'] == 'item_param':
                            base_value = str(int(info.get('increment', info.get('base', 0))))
                        break

                upgrade_base_values.append(base_value)

            try:
                upgrade_formatted = upgrade_text.format(*upgrade_base_values) if upgrade_base_values else upgrade_text
            except (IndexError, KeyError):
                upgrade_formatted = upgrade_text

            result['upgrade_template'] = upgrade_text
            result['upgrade_args'] = upgrade_args
            result['upgrade_formatted'] = upgrade_formatted

    return result


def format_item_description(item_raw_data: dict, level: int = 1,
                           hero_stats: dict | None = None) -> str:
    """
    Format an item's description with placeholder values filled in.

    Args:
        item_raw_data: The item's raw_data dict
        level: Current upgrade level (1-based)
        hero_stats: Dict of hero stats for hero-dependent calculations
                   e.g., {'viewRadius': 6, 'offence': 5, ...}

    Returns:
        Formatted description string with placeholders replaced by values
    """
    if hero_stats is None:
        hero_stats = {'viewRadius': 6}

    desc_data = get_item_description_data(item_raw_data)
    if not desc_data['template'] or not desc_data['values']:
        return desc_data['formatted']

    resolved_values = []
    for info in desc_data['values']:
        if info['type'] == 'static':
            resolved_values.append(info['value'])
        elif info['type'] == 'item_param':
            base = info['base']
            increment = info['increment']
            level_step = info.get('levelStep', 1)
            if level > 1 and increment and level_step > 0:
                value = base + increment * ((level - 1) // level_step)
            else:
                value = base
            if info.get('isPercent') and abs(value) < 1:
                value = value * 100
            resolved_values.append(str(int(value)))
        elif info['type'] == 'hero_stat_multiplier':
            stat = info['stat']
            multiplier = info['multiplier']
            stat_value = hero_stats.get(stat, 6)  # Default to 6 for viewRadius
            resolved_values.append(str(int(stat_value * multiplier)))
        else:
            resolved_values.append('?')

    try:
        return desc_data['template'].format(*resolved_values)
    except (IndexError, KeyError):
        return desc_data['formatted']


def _camel_to_title(text: str) -> str:
    """
    Convert camelCase to Title Case.

    Examples:
        spellPower -> Spell Power
        defence -> Defence
        maxHealthPercent -> Max Health Percent
    """
    # Insert space before uppercase letters
    spaced = re.sub(r'([A-Z])', r' \1', text)
    # Capitalize first letter of each word
    return spaced.strip().title()


def _calculate_bonus_value(base_value: float, upgrade_data: dict, level: int) -> float:
    """Calculate bonus value at a given level with upgrade scaling."""
    if upgrade_data and level > 1:
        increment = upgrade_data.get('increment', 0)
        level_step = upgrade_data.get('levelStep', 1)
        if level_step > 0:
            return base_value + (increment * ((level - 1) // level_step))
    return base_value


# Friendly names for boolean hero stats
BOOLEAN_STAT_NAMES = {
    'enableSquadReactionType': 'Shows Unit Initiative',
    'enableSquadCounts': 'Shows Unit Stack Counts',
    'enableEnemyHeroInfo': 'Shows Enemy Hero Info',
    'enableEnemyCityInfo': 'Shows Enemy City Info',
    'enableBansEvasion': 'Can Evade Bans',
    'enableBansEvasionBattle': 'Can Evade Bans in Battle',
    'enableSaveHeroByKill': 'Hero Survives Defeat',
    'enableSavePartyByEscape': 'Party Can Escape',
}

# Friendly names for complex stat types
STAT_DISPLAY_NAMES = {
    'finalHealingBonusPercent': 'Healing',
    'finalAbilityDamageBonusPercent': 'Ability Damage',
    'finalSummonBonusPercent': 'Summoning',
    'diplomacyEfficiencyPerBonus': 'Diplomacy',
    'landscapePenaltyPerBonus': 'Terrain Penalty',
    'flyMotionPerBonus': 'Flying Speed',
    'hp': 'HP',
    'offence': 'Offence',
    'defence': 'Defence',
}


def parse_item_bonuses(bonuses_data: list, level: int = 1) -> list[str]:
    """
    Parse item bonuses into human-readable strings.

    Args:
        bonuses_data: List of bonus dicts from item.raw_data['bonuses']
        level: Current upgrade level (1-based, default 1 = no upgrades)

    Returns:
        List of formatted bonus strings like "+3 Defence", "Shows Enemy Info"
    """
    formatted_bonuses = []

    for bonus in bonuses_data:
        bonus_type = bonus.get('type')
        parameters = bonus.get('parameters', [])
        upgrade_data = bonus.get('upgrade', {})

        # Check activation level - skip if not yet activated
        activation_level = bonus.get('activationLevel', 1)
        if level < activation_level:
            continue

        if bonus_type == 'heroStat':
            if len(parameters) < 2:
                continue

            stat_name = parameters[0]

            # Special handling for magicSchoolSet: [statName, school, "0", value]
            if stat_name == 'magicSchoolSet' and len(parameters) >= 4:
                school = parameters[1].capitalize()
                try:
                    base_value = float(parameters[3])
                except (ValueError, TypeError):
                    base_value = 1
                bonus_value = int(_calculate_bonus_value(base_value, upgrade_data, level))
                sign = '+' if bonus_value >= 0 else ''
                formatted_bonuses.append(f"{sign}{bonus_value} {school} Magic")
                continue

            base_value_str = parameters[1]

            # Handle boolean stats
            if base_value_str in ('true', 'false', True, False):
                if stat_name in BOOLEAN_STAT_NAMES:
                    formatted_bonuses.append(BOOLEAN_STAT_NAMES[stat_name])
                else:
                    # Fallback: convert stat name to readable form
                    display_name = _camel_to_title(stat_name.replace('enable', ''))
                    formatted_bonuses.append(f"Enables {display_name}")
                continue

            # Handle numeric stats
            try:
                base_value = float(base_value_str)
            except (ValueError, TypeError):
                continue

            bonus_value = _calculate_bonus_value(base_value, upgrade_data, level)
            # Use friendly name if available, otherwise convert camelCase
            display_name = STAT_DISPLAY_NAMES.get(stat_name, _camel_to_title(stat_name))

            # Detect percentage stats (includes "Percent", "PerBonus", etc.)
            is_percent = 'percent' in stat_name.lower() or 'perbonus' in stat_name.lower()

            # Format value
            if is_percent:
                int_value = int(bonus_value * 100) if abs(bonus_value) < 1 else int(bonus_value)
                sign = '+' if int_value >= 0 else ''
                formatted_bonuses.append(f"{sign}{int_value}% {display_name}")
            else:
                int_value = int(bonus_value)
                sign = '+' if int_value >= 0 else ''
                formatted_bonuses.append(f"{sign}{int_value} {display_name}")

        elif bonus_type == 'unitStat':
            if len(parameters) < 2:
                continue
            stat_name = parameters[0]
            try:
                base_value = float(parameters[1])
            except (ValueError, TypeError):
                continue

            bonus_value = _calculate_bonus_value(base_value, upgrade_data, level)
            # Use friendly name if available, otherwise convert camelCase
            display_name = STAT_DISPLAY_NAMES.get(stat_name, _camel_to_title(stat_name))

            # Check if it affects enemies or allies
            allegiance = bonus.get('receiverAllegiance', 'ally')
            prefix = "Enemy units: " if allegiance == 'enemy' else "Units: "

            is_percent = 'percent' in stat_name.lower()
            if is_percent:
                int_value = int(bonus_value * 100) if abs(bonus_value) < 1 else int(bonus_value)
                sign = '+' if int_value >= 0 else ''
                formatted_bonuses.append(f"{prefix}{sign}{int_value}% {display_name}")
            else:
                int_value = int(bonus_value)
                sign = '+' if int_value >= 0 else ''
                formatted_bonuses.append(f"{prefix}{sign}{int_value} {display_name}")

        elif bonus_type == 'sideRes':
            if len(parameters) < 2:
                continue
            resource = parameters[0].capitalize()
            try:
                base_value = float(parameters[1])
            except (ValueError, TypeError):
                continue
            bonus_value = int(_calculate_bonus_value(base_value, upgrade_data, level))
            formatted_bonuses.append(f"+{bonus_value} {resource}/day")

        elif bonus_type == 'heroMagicAdditionMass':
            if len(parameters) >= 3:
                tier = parameters[2]
                if tier == 'any' or tier is None:
                    formatted_bonuses.append("Unlocks all spells")
                else:
                    formatted_bonuses.append(f"Unlocks all Tier {tier} spells")

        elif bonus_type == 'heroMagicAddition':
            # Adds a specific spell
            formatted_bonuses.append("Grants spell")

        elif bonus_type == 'battleSubskillBonus':
            # Grants a skill in battle
            formatted_bonuses.append("Grants battle skill")

        elif bonus_type == 'unitBoolStat':
            if len(parameters) >= 1:
                stat_name = _camel_to_title(parameters[0])
                formatted_bonuses.append(f"Units: {stat_name}")

        elif bonus_type == 'magicSchoolSet':
            # Sets spell school level (e.g., +1 to Fire magic)
            if len(parameters) >= 2:
                school = parameters[0].capitalize()
                try:
                    base_value = int(float(parameters[1]))
                except (ValueError, TypeError):
                    base_value = 1
                bonus_value = int(_calculate_bonus_value(base_value, upgrade_data, level))
                sign = '+' if bonus_value >= 0 else ''
                formatted_bonuses.append(f"{sign}{bonus_value} {school} Magic")

        elif bonus_type == 'heroAbility':
            # Grants a hero ability
            if len(parameters) >= 1:
                ability_name = _camel_to_title(parameters[0])
                formatted_bonuses.append(f"Grants: {ability_name}")

    return formatted_bonuses


def calculate_dust_cost(cost_base: int, cost_per_level: int, level: int) -> int:
    """
    Calculate cumulative dust cost for upgrading an item to a given level.

    The first upgrade costs cost_base, subsequent upgrades cost cost_per_level each.

    Args:
        cost_base: Base cost for the first upgrade
        cost_per_level: Cost for each subsequent upgrade
        level: Current upgrade level (0 = no upgrades, 1 = first upgrade, etc.)

    Returns:
        Total dust cost to reach the given level

    Examples:
        >>> calculate_dust_cost(50, 50, 0)
        0
        >>> calculate_dust_cost(50, 50, 1)
        50
        >>> calculate_dust_cost(50, 50, 2)
        100
    """
    if level <= 0:
        return 0
    # First upgrade costs cost_base, each additional costs cost_per_level
    return cost_base + cost_per_level * (level - 1)


def get_item_display_name(item_raw_data: dict) -> str:
    """
    Get localized display name for an item.

    Args:
        item_raw_data: The item's raw_data dict

    Returns:
        Localized item name, or formatted id_key as fallback

    Examples:
        >>> raw_data = {"name": "chain_mail_artifact_name", "id": "chain_mail_artifact"}
        >>> # With localizations available: "Chain Mail"
        >>> # Without localizations: "Chain Mail Artifact"
        >>> get_item_display_name(raw_data)
        'Chain Mail'
    """
    localizations = get_localizations()

    # Get the localization key from raw_data
    name_key = item_raw_data.get('name', '')

    # Try to get the localized name
    if name_key and name_key in localizations:
        return localizations[name_key]

    # Fallback: format the item ID
    item_id = item_raw_data.get('id', '')
    if item_id:
        # Remove common suffixes and format
        formatted_id = item_id.replace('_artifact', '').replace('_item', '')
        # Convert underscores to spaces and capitalize
        return formatted_id.replace('_', ' ').title()

    return 'Unknown Item'
