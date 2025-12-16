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
    Get display info for a skill.

    Uses pre-extracted values from the database (populated at import time).
    Falls back to runtime extraction only if database values are not available.
    """
    from gamedata.models import Skill

    localizations = get_localizations()

    # Get skill from database
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
