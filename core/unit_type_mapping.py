"""
Unit type translation mappings.

This module provides mappings from unit attack/movement types to their
localization keys in the game files.

When adding new unit types:
1. Add the type to the appropriate mapping below
2. The localization key should point to a key in the game's localization files
3. If unsure of the key, search the Localization table for relevant keys
"""

# Attack type -> localization key mapping
ATTACK_TYPE_LOCALIZATION_KEYS = {
    'melee': 'base_passive_melee_attack_name',
    'ranged': 'base_passive_ranged_attack_name',
    'long_reach': 'base_passive_remote_attack_name',
    'magic': 'base_passive_magic_attack_name',
}

# Movement type -> localization key mapping
# Note: 'ground' is the default and doesn't display a label
# 'teleport' displays the same as 'fly' in the game UI
MOVE_TYPE_LOCALIZATION_KEYS = {
    'fly': 'base_passive_flyer_name',
    'teleport': 'base_passive_flyer_name',  # Uses same UI label as fly
    'ground': None,  # Default movement, no label
}


def get_attack_type_translation_key(attack_type: str) -> str | None:
    """
    Get the localization key for an attack type.

    Args:
        attack_type: The attack type from unit data (e.g., 'melee', 'ranged')

    Returns:
        The localization key to use, or None if not found
    """
    key = ATTACK_TYPE_LOCALIZATION_KEYS.get(attack_type)
    if key is None and attack_type is not None:
        # Log unknown attack types so we can add them
        print(f"WARNING: Unknown attack_type '{attack_type}' - please add to ATTACK_TYPE_LOCALIZATION_KEYS")
    return key


def get_move_type_translation_key(move_type: str) -> str | None:
    """
    Get the localization key for a movement type.

    Args:
        move_type: The movement type from unit data (e.g., 'fly', 'ground', 'teleport')

    Returns:
        The localization key to use, or None if not found or if it shouldn't display
    """
    key = MOVE_TYPE_LOCALIZATION_KEYS.get(move_type)
    if key is None and move_type not in ['ground', None]:
        # Log unknown movement types (except 'ground' which is default)
        print(f"WARNING: Unknown move_type '{move_type}' - please add to MOVE_TYPE_LOCALIZATION_KEYS")
    return key
