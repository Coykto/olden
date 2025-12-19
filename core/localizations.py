"""
Utility for loading and accessing game localizations.
"""
import json
import re
from functools import lru_cache
from pathlib import Path
from django.conf import settings


def _parse_script_files() -> dict:
    """
    Parse game .script files to extract skill parameter mappings.

    Returns a dict mapping skill_id -> list of (path, format_type, post_op) tuples.
    """
    # Try multiple possible locations for script files
    possible_paths = [
        Path(settings.GAME_DATA_PATH) / "DB" / "info" / "info_hero_skills",
        Path("/tmp/DB/info/info_hero_skills"),  # Extracted game data
    ]

    script_dir = None
    for path in possible_paths:
        if path.exists():
            script_dir = path
            break

    if script_dir is None:
        return {}

    mappings = {}

    # Pattern to match function definitions
    # e.g., "modPercentNumeric current_skill_wisdom"
    func_pattern = re.compile(
        r'^(modPercentNumeric|modInt|modFloatPercentF1Numeric|string|int|Percent|ModPercent)\s+'
        r'(current_skill_[a-z0-9_]+|current_sub_skill_[a-z0-9_]+)\s*$',
        re.MULTILINE
    )

    # Pattern to extract parameter path from CurrentSkillParameter/CurrentSubSkill
    param_pattern = re.compile(r'CurrentSkillParameter\s*\(\s*\w+\s*,\s*"([^"]+)"')

    # Pattern to extract static value from Text( return, "value" )
    static_pattern = re.compile(r'Text\s*\(\s*return\s*,\s*"([^"]+)"\s*\)')

    # Pattern to detect Add operation: Add ( result, input, "value" )
    add_pattern = re.compile(r'Add\s*\(\s*\w+\s*,\s*\w+\s*,\s*"([^"]+)"\s*\)')

    for script_file in script_dir.glob("*.script"):
        try:
            content = script_file.read_text(encoding='utf-8-sig')

            # Split into function blocks
            blocks = re.split(r'\n(?=\w)', content)

            for block in blocks:
                # Find function signature
                func_match = func_pattern.search(block)
                if not func_match:
                    continue

                return_type = func_match.group(1)
                func_name = func_match.group(2)

                # Skip sub_skill functions for now (they're for sub-skills, not main skills)
                if 'sub_skill' in func_name:
                    continue

                # Extract skill_id from function name
                # current_skill_wisdom -> skill_wisdom
                # current_skill_wisdom_param -> skill_wisdom
                # current_skill_trainer_param_1 -> skill_trainer (with index 0)
                # current_skill_magic_2 -> skill_magic (with index 1)

                skill_match = re.match(
                    r'current_(skill_[a-z_]+?)(?:_param)?(?:_(\d+))?$',
                    func_name
                )
                if not skill_match:
                    continue

                skill_id = skill_match.group(1)
                param_index = int(skill_match.group(2)) - 1 if skill_match.group(2) else 0

                # Determine format type
                if return_type in ('modPercentNumeric', 'modFloatPercentF1Numeric', 'Percent', 'ModPercent'):
                    format_type = 'percent'
                elif return_type == 'string':
                    format_type = 'static'
                else:
                    format_type = 'int'

                # Check for Add operation (post-processing)
                add_match = add_pattern.search(block)
                post_op = None
                if add_match:
                    post_op = ('add', int(add_match.group(1)))

                # Extract parameter path or static value
                param_match = param_pattern.search(block)
                static_match = static_pattern.search(block)

                if param_match:
                    path = param_match.group(1)
                elif static_match and format_type == 'static':
                    path = f"static:{static_match.group(1)}"
                else:
                    continue

                # Add to mappings
                if skill_id not in mappings:
                    mappings[skill_id] = []

                # Ensure list is long enough for this index
                while len(mappings[skill_id]) <= param_index:
                    mappings[skill_id].append(None)

                mappings[skill_id][param_index] = (path, format_type, post_op)

        except Exception:
            continue

    # Clean up None entries
    for skill_id in mappings:
        mappings[skill_id] = [m for m in mappings[skill_id] if m is not None]

    return mappings


# Manual overrides for skills with complex lookup chains (DbSideBuff, DbBuff, etc.)
# that can't be automatically parsed from script files.
# Format: skill_id -> list of (path, format_type, post_op) tuples
COMPLEX_SKILL_OVERRIDES = {
    # skill_formation (Battlecraft) requires 4-level buff lookup chain
    # The actual values are in buffs/sub_skills_battle_hero_skill_formation.json
    # Level 1: offencePerc = 0.20 (20%)
    "skill_formation": [("static:20", "static", None)],

    # skill_faction_humans requires DbSideBuff lookup
    # The actual value is in the buff's hpPerc stat
    "skill_faction_humans": [("static:10", "static", None)],

    # skill_faction_demons requires DbAbility + DbObstacle lookup chain
    "skill_faction_demons": [("static:25", "static", None)],
}


@lru_cache(maxsize=1)
def get_skill_param_mappings() -> dict:
    """Get skill parameter mappings, cached for performance."""
    mappings = _parse_script_files()

    # Apply manual overrides for complex skills
    for skill_id, params in COMPLEX_SKILL_OVERRIDES.items():
        mappings[skill_id] = params

    return mappings


@lru_cache(maxsize=1)
def get_subskill_configs() -> dict:
    """
    Load subskill configurations from game files.
    Returns a dict mapping subskill_id -> subskill config data.
    """
    # Try multiple possible locations for subskill data
    possible_paths = [
        Path("/tmp/DB/heroes_skills/sub_skills/sub_skills.json"),
        Path(settings.GAME_DATA_PATH) / "DB" / "heroes_skills" / "sub_skills" / "sub_skills.json",
    ]

    for path in possible_paths:
        if path.exists():
            try:
                with open(path, 'r', encoding='utf-8-sig') as f:
                    data = json.load(f)
                    # Convert array to dict keyed by id
                    return {item['id']: item for item in data.get('array', [])}
            except Exception:
                continue

    return {}


def _extract_subskill_values(subskill_config: dict) -> list:
    """Extract numeric values from subskill bonuses."""
    values = []

    for bonus in subskill_config.get('bonuses', []):
        params = bonus.get('parameters', [])
        # Look for numeric values in parameters
        for param in params:
            if isinstance(param, str):
                try:
                    num = float(param)
                    # Convert percentages (values < 1) to whole numbers
                    if 0 < abs(num) < 1:
                        values.append(int(abs(num) * 100))
                    elif num != 0:
                        values.append(int(abs(num)))
                except ValueError:
                    pass

    return values if values else [10]  # Fallback default


@lru_cache(maxsize=1)
def get_localizations(lang: str = "english") -> dict:
    """
    Load localization strings from game files.
    Results are cached for performance.
    """
    lang_dir = settings.GAME_DATA_PATH / "StreamingAssets" / "Lang" / lang / "texts"

    if not lang_dir.exists():
        return {}

    localizations = {}

    for json_file in lang_dir.glob("*.json"):
        try:
            with open(json_file, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
                tokens = data.get("tokens", [])
                for token in tokens:
                    sid = token.get("sid")
                    text = token.get("text", "")
                    if sid:
                        localizations[sid] = text
        except Exception:
            continue

    return localizations


def get_localized_name(entity_id: str, entity_type: str, fallback: str = None) -> str:
    """
    Get localized display name for any game entity.
    
    This is the GENERAL solution for looking up entity names - each entity type
    has a specific localization key pattern in the game files.
    
    Args:
        entity_id: The entity's id_key (e.g., 'trogl', 'angel_sword_artifact')
        entity_type: One of 'unit', 'hero', 'item', 'spell', 'skill'
        fallback: Optional fallback if not found (defaults to titlecased id)
    
    Returns:
        Localized display name
    
    Localization key patterns by entity type:
        - unit: {id}_name (e.g., trogl_name -> "Troglodyte")
        - hero: {id}_name (e.g., human_hero_1_name -> "Roland")
        - item: {id}_artifact_name (e.g., angel_sword_artifact_name -> "Angel Sword")
        - spell: {id}_name (e.g., fireball_name -> "Fireball")
        - skill: {id}_name (e.g., archery_name -> "Archery")
    """
    localizations = get_localizations()
    
    # Define the localization key pattern for each entity type
    key_patterns = {
        'unit': f"{entity_id}_name",
        'hero': f"{entity_id}_name",
        'item': f"{entity_id}_artifact_name",
        'spell': f"{entity_id}_name",
        'skill': f"{entity_id}_name",
    }
    
    key = key_patterns.get(entity_type, f"{entity_id}_name")
    
    if key in localizations:
        return localizations[key]
    
    # Fallback: try without suffix pattern (some entities use raw id)
    if entity_id in localizations:
        return localizations[entity_id]
    
    # Final fallback: generate from id
    if fallback:
        return fallback
    return entity_id.replace("_", " ").title()


def _get_nested_value(data: dict, path: str):
    """
    Get a value from nested dict/list using path like 'bonuses[1].parameters[3]'.
    Returns None if path is invalid.
    """
    try:
        parts = re.split(r'\.|\[(\d+)\]', path)
        parts = [p for p in parts if p]  # Remove empty strings

        current = data
        for part in parts:
            if part.isdigit():
                current = current[int(part)]
            else:
                current = current[part]
        return current
    except (KeyError, IndexError, TypeError):
        return None


def _extract_skill_values(skill_data: dict, skill_id: str, level: int = 1) -> list:
    """Extract numeric values from skill bonuses using parsed script mappings."""
    values = []
    mappings = get_skill_param_mappings()

    # Check if we have a parsed mapping for this skill
    if skill_id in mappings:
        try:
            level_data = skill_data.get("parametersPerLevel", [])[level - 1]
            for mapping in mappings[skill_id]:
                path, format_type, post_op = mapping

                if format_type == "static" or path.startswith("static:"):
                    # Static/hardcoded value
                    static_val = path.split(":")[1] if ":" in path else "0"
                    values.append(int(static_val))
                else:
                    raw_value = _get_nested_value(level_data, path)
                    if raw_value is not None:
                        try:
                            num = float(raw_value)
                            if format_type == "percent":
                                num = int(num * 100)
                            else:  # "int" or default
                                num = int(num)

                            # Apply post-processing operation
                            if post_op:
                                op_type, op_value = post_op
                                if op_type == 'add':
                                    num += op_value

                            values.append(num)
                        except (ValueError, TypeError):
                            values.append(0)
        except (IndexError, KeyError, TypeError):
            pass

        if values:
            return values

    # Fallback: try to extract values heuristically
    try:
        level_data = skill_data.get("parametersPerLevel", [])[level - 1]
        for bonus in level_data.get("bonuses", []):
            params = bonus.get("parameters", [])
            for param in params:
                if isinstance(param, str):
                    try:
                        num = float(param)
                        if num != 0:
                            values.append(int(abs(num) * 100) if abs(num) < 1 else int(abs(num)))
                    except ValueError:
                        pass
    except (IndexError, KeyError, TypeError):
        pass

    return values if values else [10, 5, 2]  # Fallback defaults


def get_skill_info(skill_id: str, level: int = 1) -> dict:
    """
    Get display info for a skill or subskill.

    For regular skills: Uses pre-extracted values from the database.
    For subskills: Loads data from subskill config files.
    """
    from gamedata.models import Skill

    localizations = get_localizations()

    # Handle subskills specially - they're stored in a separate config file
    if skill_id.startswith('sub_skill_'):
        subskill_configs = get_subskill_configs()
        subskill_config = subskill_configs.get(skill_id, {})

        # Extract values from subskill bonuses
        skill_values = _extract_subskill_values(subskill_config) if subskill_config else [10]

        # Get localized name and description
        name = (
            localizations.get(f"{skill_id}_name") or
            localizations.get(skill_id) or
            subskill_config.get('name', skill_id.replace("sub_skill_", "").replace("_", " ").title())
        )

        desc_key = subskill_config.get('desc', f"{skill_id}_desc")
        description = localizations.get(desc_key) or localizations.get(f"{skill_id}_desc") or ""

        # Replace placeholders with values
        def replace_placeholder(match):
            index = int(match.group(1))
            return str(skill_values[index] if index < len(skill_values) else "?")

        description = re.sub(r'\{(\d+)\}', replace_placeholder, description)

        return {
            "id": skill_id,
            "name": name,
            "description": description,
        }

    # Regular skill handling
    skill = None
    skill_data = None
    skill_values = []

    try:
        skill = Skill.objects.filter(id_key=skill_id).first()
        if skill:
            skill_data = skill.raw_data
            # Use pre-extracted values from database
            skill_values = skill.get_values(level)
    except Exception:
        pass

    # Fallback to runtime extraction if no pre-extracted values
    if not skill_values and skill_data:
        skill_values = _extract_skill_values(skill_data, skill_id, level)

    # Final fallback
    if not skill_values:
        skill_values = [10, 5, 2]

    # Get the actual desc key from skill data if available
    desc_key = None
    if skill_data:
        try:
            level_data = skill_data.get("parametersPerLevel", [])[level - 1]
            desc_key = level_data.get("desc")
        except (IndexError, KeyError):
            pass

    # Skill names - try generic name, then level-specific, then fallback
    name = (
        localizations.get(skill_id) or
        localizations.get(f"{skill_id}_name") or
        localizations.get(f"{skill_id}_name_{level}") or
        skill_id.replace("skill_", "").replace("_", " ").title()
    )

    # Descriptions - use the key from skill data, or fallback to patterns
    description = ""
    if desc_key:
        description = localizations.get(desc_key, "")
    if not description:
        description = (
            localizations.get(f"{skill_id}_desc") or
            localizations.get(f"{skill_id}_desc_{level}") or
            ""
        )

    # Replace placeholders like {0}, {1} with actual skill values
    def replace_placeholder(match):
        index = int(match.group(1))
        return str(skill_values[index] if index < len(skill_values) else "?")

    description = re.sub(r'\{(\d+)\}', replace_placeholder, description)

    return {
        "id": skill_id,
        "name": name,
        "description": description,
    }


def get_advanced_class_info(class_id: str) -> dict:
    """Get display info for an advanced class with template and args for dynamic descriptions."""
    localizations = get_localizations()
    args_data = get_skill_args()  # Advanced class args are in heroSkills.json

    name = localizations.get(f"{class_id}_name", class_id.replace("_", " ").title())
    desc_key = f"{class_id}_desc"
    description_template = localizations.get(desc_key, "")
    description_args = args_data.get(desc_key, [])

    return {
        "id": class_id,
        "name": name,
        "description": description_template,  # Raw template with placeholders
        "description_template": description_template,
        "description_args": description_args,
    }


@lru_cache(maxsize=1)
def get_item_args(lang: str = "english") -> dict:
    """
    Load item description args from game files.
    Returns a dict mapping sid -> list of function names.
    """
    args_file = settings.GAME_DATA_PATH / "StreamingAssets" / "Lang" / "args" / "artifacts.json"

    if not args_file.exists():
        return {}

    try:
        with open(args_file, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
            tokens_args = data.get("tokensArgs", [])
            return {item["sid"]: item.get("args", []) for item in tokens_args}
    except Exception:
        return {}


@lru_cache(maxsize=1)
def get_hero_spec_args(lang: str = "english") -> dict:
    """
    Load hero specialization description args from game files.
    Returns a dict mapping sid -> list of function names.
    """
    args_file = settings.GAME_DATA_PATH / "StreamingAssets" / "Lang" / "args" / "heroInfo.json"

    if not args_file.exists():
        return {}

    try:
        with open(args_file, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
            tokens_args = data.get("tokensArgs", [])
            return {item["sid"]: item.get("args", []) for item in tokens_args}
    except Exception:
        return {}


@lru_cache(maxsize=1)
def get_skill_args(lang: str = "english") -> dict:
    """
    Load skill description args from game files.
    Returns a dict mapping sid -> list of function names.
    """
    args_file = settings.GAME_DATA_PATH / "StreamingAssets" / "Lang" / "args" / "heroSkills.json"

    if not args_file.exists():
        return {}

    try:
        with open(args_file, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
            tokens_args = data.get("tokensArgs", [])
            return {item["sid"]: item.get("args", []) for item in tokens_args}
    except Exception:
        return {}


def get_item_info(item_id: str) -> dict:
    """
    Get display info for an item including name, descriptions, and narrative.

    Args:
        item_id: The item's id_key (e.g., 'shamaniac_soul_gemwood_mask_artifact')
                 Note: id_key already contains '_artifact' suffix

    Returns:
        dict with name, description_template, description_args,
        upgrade_description_template, upgrade_description_args, narrative_description
    """
    localizations = get_localizations()
    args_data = get_item_args()

    # Item localization keys follow pattern: {item_id}_{field}
    # Note: item_id already contains '_artifact' suffix
    name_key = f"{item_id}_name"
    desc_key = f"{item_id}_description"
    upgrade_desc_key = f"{item_id}_upgradeDescription"
    narrative_key = f"{item_id}_narrativeDescription"

    name = localizations.get(name_key, item_id.replace("_", " ").title())
    description_template = localizations.get(desc_key, "")
    upgrade_description_template = localizations.get(upgrade_desc_key, "")
    narrative_description = localizations.get(narrative_key, "")

    # Get args for description and upgrade description
    description_args = args_data.get(desc_key, [])
    upgrade_description_args = args_data.get(upgrade_desc_key, [])

    return {
        "name": name,
        "description_template": description_template,
        "description_args": description_args,
        "upgrade_description_template": upgrade_description_template,
        "upgrade_description_args": upgrade_description_args,
        "narrative_description": narrative_description,
    }


def get_item_set_info(set_id: str, bonuses: list) -> dict:
    """
    Get display info for an item set including name and bonus descriptions.

    Args:
        set_id: The item set's id_key (e.g., 'knights_honor_item_set')
        bonuses: List of bonus objects from raw_data containing desc keys

    Returns:
        dict with name and bonuses array containing localized descriptions
    """
    localizations = get_localizations()
    args_data = get_item_args()

    # Set name key is just the set_id
    name = localizations.get(set_id, set_id.replace("_", " ").title())

    # Process each bonus to add localized description
    localized_bonuses = []
    for bonus in bonuses:
        desc_key = bonus.get("desc", "")
        description_template = localizations.get(desc_key, "")
        description_args = args_data.get(desc_key, [])

        localized_bonuses.append({
            "requiredItemsAmount": int(bonus.get("requiredItemsAmount", 0)),
            "description_template": description_template,
            "description_args": description_args,
            "heroBonuses": bonus.get("heroBonuses", []),
            "unitBonuses": bonus.get("unitBonuses", []),
        })

    return {
        "name": name,
        "bonuses": localized_bonuses,
    }


@lru_cache(maxsize=1)
def get_specialization_data() -> dict:
    """
    Load all hero specialization data from game files.
    Returns a dict mapping specialization_id -> specialization data (with bonuses).
    """
    possible_paths = [
        Path("/tmp/DB/heroes_specializations"),
        Path(settings.GAME_DATA_PATH) / "DB" / "heroes_specializations",
    ]

    spec_dir = None
    for path in possible_paths:
        if path.exists():
            spec_dir = path
            break

    if spec_dir is None:
        return {}

    specializations = {}
    for json_file in spec_dir.glob("specializations_*.json"):
        try:
            with open(json_file, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
                for spec in data.get('array', []):
                    spec_id = spec.get('id')
                    if spec_id:
                        specializations[spec_id] = spec
        except Exception:
            continue

    return specializations


def get_hero_specialization_info(hero_id: str) -> dict:
    """
    Get display info for a hero's specialization including name, description template, args, and raw data.

    Args:
        hero_id: The hero's id_key (e.g., 'human_hero_1')

    Returns:
        dict with name, description_template, description_args, raw_data
    """
    localizations = get_localizations()
    args_data = get_hero_spec_args()
    spec_data = get_specialization_data()

    # Hero specialization localization keys follow pattern: {hero_id}_spec_{field}
    name_key = f"{hero_id}_spec_name"
    desc_key = f"{hero_id}_spec_description"
    spec_id = f"{hero_id}_specialization"

    name = localizations.get(name_key, "")
    description_template = localizations.get(desc_key, "")

    # Get args for description
    description_args = args_data.get(desc_key, [])

    # Get raw specialization data with bonuses
    raw_data = spec_data.get(spec_id, {})

    return {
        "name": name,
        "description_template": description_template,
        "description_args": description_args,
        "raw_data": raw_data,
    }


@lru_cache(maxsize=1)
def get_spell_args(lang: str = "english") -> dict:
    """
    Load spell description args from game files.
    Returns a dict mapping sid -> list of function names.
    """
    args_file = settings.GAME_DATA_PATH / "StreamingAssets" / "Lang" / "args" / "magic.json"

    if not args_file.exists():
        return {}

    try:
        with open(args_file, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
            tokens_args = data.get("tokensArgs", [])
            return {item["sid"]: item.get("args", []) for item in tokens_args}
    except Exception:
        return {}


@lru_cache(maxsize=1)
def get_unit_ability_args(lang: str = "english") -> dict:
    """
    Load unit ability description args from game files.
    Returns a dict mapping sid -> list of function names.
    """
    args_file = settings.GAME_DATA_PATH / "StreamingAssets" / "Lang" / "args" / "unitsAbility.json"

    if not args_file.exists():
        return {}

    try:
        with open(args_file, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
            tokens_args = data.get("tokensArgs", [])
            return {item["sid"]: item.get("args", []) for item in tokens_args}
    except Exception:
        return {}


def get_spell_info(spell_id: str, raw_data: dict | None = None) -> dict:
    """
    Get display info for a spell including name and description template/args.

    Args:
        spell_id: The spell's id_key (e.g., 'day_10_magic_second_song')
        raw_data: Optional raw spell data containing a 'name' field with
                  a custom localization key (e.g., 'skill_summoner_name_1')

    Returns:
        dict with name, description_template, description_args
    """
    localizations = get_localizations()
    args_data = get_spell_args()

    # Check if raw_data has a custom name localization key
    # This is used by bonus spells like Summon Avatar which have names like
    # "Basic Summon Avatar", "Advanced Summon Avatar", etc.
    if raw_data and "name" in raw_data:
        custom_name_key = raw_data["name"]
        name = localizations.get(custom_name_key)
        if name:
            # Found custom name, use it
            pass
        else:
            # Fallback to default pattern
            name_key = f"{spell_id}_name"
            name = localizations.get(name_key, spell_id.replace("_", " ").title())
    else:
        # Spell localization keys follow pattern: {spell_id}_{field}
        name_key = f"{spell_id}_name"
        name = localizations.get(name_key, spell_id.replace("_", " ").title())

    desc_key = f"{spell_id}_description"
    description_template = localizations.get(desc_key, "")

    # Get args for description
    description_args = args_data.get(desc_key, [])

    return {
        "name": name,
        "description_template": description_template,
        "description_args": description_args,
    }


def get_spell_descriptions_by_level(description_keys: list) -> list:
    """
    Get description templates and args for each upgrade level.

    Spells have different descriptions at different levels (e.g., Haste gains
    "Dispels Web effect" at level 3). The description_keys array contains
    one key per level.

    Args:
        description_keys: Array of description keys from raw_data.description
                         e.g., ["spell_desc", "spell_desc", "spell_desc_1", "spell_desc_1"]

    Returns:
        List of dicts with description_template and description_args per level
    """
    if not description_keys:
        return []

    localizations = get_localizations()
    args_data = get_spell_args()

    result = []
    for desc_key in description_keys:
        template = localizations.get(desc_key, "")
        args = args_data.get(desc_key, [])
        result.append({
            "description_template": template,
            "description_args": args,
        })

    return result
