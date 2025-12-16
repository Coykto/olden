"""
Skill value extraction pipeline for Heroes of Might and Magic: Olden Era.

This module parses the game's .script files to understand how skill parameter values
should be extracted, then follows lookup chains through buff/sidebuff data to get
the actual numeric values.

The extraction happens at import time, and values are stored in the database
for efficient runtime access.
"""
import json
import re
from pathlib import Path
from typing import Any


class SkillValueExtractor:
    """
    Extracts skill parameter values by parsing game script files and following
    data lookup chains.
    """

    def __init__(self, db_path: Path):
        """
        Initialize the extractor.

        Args:
            db_path: Path to the extracted DB directory (e.g., /tmp/DB)
        """
        self.db_path = db_path
        self._script_rules = {}
        self._buffs = {}
        self._side_buffs = {}
        self._side_buff_infos = {}
        self._loaded = False

    def load(self):
        """Load all necessary data files."""
        if self._loaded:
            return

        self._parse_script_files()
        self._load_buff_data()
        self._loaded = True

    def _parse_script_files(self):
        """Parse .script files to extract parameter mapping rules."""
        script_dir = self.db_path / "info" / "info_hero_skills"

        if not script_dir.exists():
            return

        # Pattern to match function definitions
        func_pattern = re.compile(
            r'^(modPercentNumeric|modInt|modFloatPercentF1Numeric|string|int|Percent|ModPercent)\s+'
            r'(current_skill_[a-z0-9_]+)\s*$',
            re.MULTILINE
        )

        # Patterns for different extraction methods
        current_skill_param_pattern = re.compile(
            r'CurrentSkillParameter\s*\(\s*\w+\s*,\s*"([^"]+)"'
        )
        db_side_buff_pattern = re.compile(
            r'DbSideBuff\s*\(\s*\w+\s*,\s*\w+\s*,\s*"([^"]+)"'
        )
        db_buff_pattern = re.compile(
            r'DbBuff\s*\(\s*\w+\s*,\s*\w+\s*,\s*"([^"]+)"'
        )
        static_pattern = re.compile(r'Text\s*\(\s*return\s*,\s*"([^"]+)"\s*\)')
        add_pattern = re.compile(r'Add\s*\(\s*\w+\s*,\s*\w+\s*,\s*"([^"]+)"\s*\)')

        for script_file in script_dir.glob("*.script"):
            try:
                content = script_file.read_text(encoding='utf-8-sig')
                blocks = re.split(r'\n(?=\w)', content)

                for block in blocks:
                    func_match = func_pattern.search(block)
                    if not func_match:
                        continue

                    return_type = func_match.group(1)
                    func_name = func_match.group(2)

                    # Skip sub_skill functions
                    if 'sub_skill' in func_name:
                        continue

                    # Extract skill_id and param index
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

                    # Check for Add operation
                    add_match = add_pattern.search(block)
                    post_op = ('add', int(add_match.group(1))) if add_match else None

                    # Determine extraction method
                    current_param_match = current_skill_param_pattern.search(block)
                    db_side_buff_match = db_side_buff_pattern.search(block)
                    db_buff_match = db_buff_pattern.search(block)
                    static_match = static_pattern.search(block)

                    rule = {
                        'format_type': format_type,
                        'post_op': post_op,
                        'method': 'unknown',
                    }

                    if db_side_buff_match and db_buff_match:
                        # Complex lookup chain
                        rule['method'] = 'buff_chain'
                        rule['skill_param_path'] = current_param_match.group(1) if current_param_match else None
                        rule['side_buff_path'] = db_side_buff_match.group(1)
                        rule['buff_path'] = db_buff_match.group(1)
                    elif current_param_match:
                        # Simple parameter extraction
                        rule['method'] = 'direct'
                        rule['path'] = current_param_match.group(1)
                    elif static_match and format_type == 'static':
                        # Static value
                        rule['method'] = 'static'
                        rule['value'] = static_match.group(1)

                    # Store the rule
                    if skill_id not in self._script_rules:
                        self._script_rules[skill_id] = []

                    while len(self._script_rules[skill_id]) <= param_index:
                        self._script_rules[skill_id].append(None)

                    self._script_rules[skill_id][param_index] = rule

            except Exception as e:
                print(f"Warning: Error parsing {script_file}: {e}")
                continue

        # Clean up None entries
        for skill_id in self._script_rules:
            self._script_rules[skill_id] = [r for r in self._script_rules[skill_id] if r]

    def _load_buff_data(self):
        """Load buff and side buff data files."""
        # Load all buff files
        buffs_dir = self.db_path / "buffs"
        if buffs_dir.exists():
            for json_file in buffs_dir.rglob("*.json"):
                try:
                    with open(json_file, 'r', encoding='utf-8-sig') as f:
                        data = json.load(f)
                    for item in data.get('array', []):
                        if 'id' in item:
                            self._buffs[item['id']] = item
                except Exception:
                    continue

        # Load side buff base files
        side_buffs_dir = self.db_path / "side_buffs" / "side_buff_base"
        if side_buffs_dir.exists():
            for json_file in side_buffs_dir.rglob("*.json"):
                try:
                    with open(json_file, 'r', encoding='utf-8-sig') as f:
                        data = json.load(f)
                    for item in data.get('array', []):
                        if 'id' in item:
                            self._side_buffs[item['id']] = item
                except Exception:
                    continue

        # Load side buff info files
        side_buff_infos_dir = self.db_path / "side_buffs" / "bonus_buff_infos"
        if side_buff_infos_dir.exists():
            for json_file in side_buff_infos_dir.rglob("*.json"):
                try:
                    with open(json_file, 'r', encoding='utf-8-sig') as f:
                        data = json.load(f)
                    for item in data.get('data', data.get('array', [])):
                        if 'id' in item:
                            self._side_buff_infos[item['id']] = item
                except Exception:
                    continue

    def _get_nested_value(self, data: dict, path: str) -> Any:
        """Get a value from nested dict/list using path like 'bonuses[1].parameters[3]'."""
        try:
            parts = re.split(r'\.|\[(\d+)\]', path)
            parts = [p for p in parts if p]

            current = data
            for part in parts:
                if part.isdigit():
                    current = current[int(part)]
                else:
                    current = current[part]
            return current
        except (KeyError, IndexError, TypeError):
            return None

    def _resolve_buff_chain(self, skill_data: dict, level: int, rule: dict) -> Any:
        """
        Resolve a buff chain lookup.

        The chain can be:
        1. Get sideBuff ID from skill data using skill_param_path
        2. Look up the sideBuff info to get intermediate buff via 'sid' field
        3. Look up intermediate buff and follow side_buff_path to get final buff sid
        4. Look up final buff and extract value using buff_path
        """
        try:
            level_data = skill_data.get('parametersPerLevel', [])[level - 1]

            # Step 1: Get side buff ID from skill parameters
            if rule.get('skill_param_path'):
                side_buff_id = self._get_nested_value(level_data, rule['skill_param_path'])
            else:
                return None

            if not side_buff_id:
                return None

            # Step 2: Look up side buff info
            side_buff_info = self._side_buff_infos.get(side_buff_id)
            if not side_buff_info:
                side_buff_info = self._side_buffs.get(side_buff_id)

            if not side_buff_info:
                return None

            # Step 3: Get the intermediate buff using 'sid' field
            intermediate_buff_id = side_buff_info.get('sid')
            if intermediate_buff_id:
                intermediate_buff = self._buffs.get(intermediate_buff_id)
                if intermediate_buff:
                    # Follow side_buff_path to get final buff sid
                    final_buff_sid = self._get_nested_value(intermediate_buff, rule['side_buff_path'])
                    if final_buff_sid:
                        # Step 4: Look up final buff and extract value
                        final_buff = self._buffs.get(final_buff_sid)
                        if final_buff:
                            return self._get_nested_value(final_buff, rule['buff_path'])

            # Fallback: Try direct path on side_buff_info
            buff_sid = self._get_nested_value(side_buff_info, rule['side_buff_path'])
            if not buff_sid:
                buff_sid = side_buff_info.get('sid')

            if buff_sid:
                buff_data = self._buffs.get(buff_sid)
                if buff_data:
                    return self._get_nested_value(buff_data, rule['buff_path'])

            return None

        except Exception:
            return None

    def extract_skill_values(self, skill_id: str, skill_data: dict) -> dict:
        """
        Extract parameter values for a skill at all levels.

        Args:
            skill_id: The skill identifier (e.g., "skill_wisdom")
            skill_data: The raw skill data from the JSON file

        Returns:
            Dict with level -> list of parameter values
            e.g., {1: [300], 2: [200], 3: [100]}
        """
        self.load()

        result = {}
        levels = skill_data.get('parametersPerLevel', [])

        if not levels:
            return result

        rules = self._script_rules.get(skill_id, [])

        for level_idx, level_data in enumerate(levels):
            level = level_idx + 1
            values = []

            for rule in rules:
                if not rule:
                    continue

                value = None

                if rule['method'] == 'static':
                    value = rule['value']
                    try:
                        value = float(value)
                    except ValueError:
                        pass

                elif rule['method'] == 'direct':
                    value = self._get_nested_value(level_data, rule['path'])
                    if value is not None:
                        try:
                            value = float(value)
                        except (ValueError, TypeError):
                            pass

                elif rule['method'] == 'buff_chain':
                    value = self._resolve_buff_chain(skill_data, level, rule)
                    if value is not None:
                        try:
                            value = float(value)
                        except (ValueError, TypeError):
                            pass

                # Apply formatting
                if value is not None and isinstance(value, (int, float)):
                    if rule['format_type'] == 'percent':
                        value = int(value * 100)
                    else:
                        value = int(value)

                    # Apply post-op
                    if rule['post_op']:
                        op_type, op_value = rule['post_op']
                        if op_type == 'add':
                            value += op_value

                if value is not None:
                    values.append(value)

            if values:
                result[level] = values

        # If no rules found, try heuristic extraction as fallback
        if not result:
            result = self._heuristic_extract(skill_data)

        return result

    def _heuristic_extract(self, skill_data: dict) -> dict:
        """Fallback heuristic extraction when no script rules are found."""
        result = {}
        levels = skill_data.get('parametersPerLevel', [])

        for level_idx, level_data in enumerate(levels):
            level = level_idx + 1
            values = []

            for bonus in level_data.get('bonuses', []):
                params = bonus.get('parameters', [])
                for param in params:
                    if isinstance(param, str):
                        try:
                            num = float(param)
                            if num != 0:
                                # Assume values < 1 are percentages
                                if abs(num) < 1:
                                    values.append(int(abs(num) * 100))
                                else:
                                    values.append(int(abs(num)))
                        except ValueError:
                            pass

            if values:
                result[level] = values

        return result

    def get_extraction_rules(self) -> dict:
        """Get all parsed extraction rules (for debugging)."""
        self.load()
        return self._script_rules
