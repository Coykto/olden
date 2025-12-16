"""
Combat value extraction for Heroes of Might and Magic: Olden Era.

This module extracts combat-relevant values from unit, buff, and ability data files
for use in damage calculations.
"""
import json
import re
from pathlib import Path
from typing import Any, Optional


class CombatValueExtractor:
    """
    Extracts combat values from game data files.

    Handles:
    - Unit damage modifiers (inDmgMods, outDmgMods)
    - Unit abilities (passives, actives)
    - Buff effects
    - Attack type detection
    """

    def __init__(self, db_path: Path):
        """
        Initialize the extractor.

        Args:
            db_path: Path to the extracted DB directory (e.g., /tmp/DB)
        """
        self.db_path = db_path
        self._buffs = {}
        self._abilities = {}
        self._loaded = False

    def load(self):
        """Load all necessary data files."""
        if self._loaded:
            return

        self._load_buff_data()
        self._loaded = True

    def _load_buff_data(self):
        """Load buff data files for ability effect lookups."""
        buffs_dir = self.db_path / "buffs"
        if not buffs_dir.exists():
            return

        for json_file in buffs_dir.rglob("*.json"):
            try:
                with open(json_file, 'r', encoding='utf-8-sig') as f:
                    data = json.load(f)
                for item in data.get('array', []):
                    if 'sid' in item:
                        self._buffs[item['sid']] = item
                    elif 'id' in item:
                        self._buffs[item['id']] = item
            except Exception:
                continue

    def extract_unit_combat_data(self, unit_data: dict) -> dict:
        """
        Extract combat-relevant data from a unit's raw data.

        Args:
            unit_data: Raw unit data from JSON file

        Returns:
            Dict with attack_type, abilities, damage_modifiers
        """
        result = {
            'attack_type': 'melee',
            'abilities': [],
            'damage_modifiers': {
                'outDmgMods': [],
                'inDmgMods': [],
                'outAllDmgMod': 0.0,
                'inAllDmgMod': 0.0,
            }
        }

        # Detect attack type from default attacks
        default_attacks = unit_data.get('defaultAttacks', [])
        if default_attacks:
            first_attack = default_attacks[0]
            attack_type = first_attack.get('attackType_', 'melee')
            if attack_type == 'shoot':
                result['attack_type'] = 'ranged'
            elif attack_type == 'cast':
                result['attack_type'] = 'magic'
            else:
                result['attack_type'] = 'melee'

        # Extract damage modifiers from stats
        stats = unit_data.get('stats', {})

        # Process outDmgMods
        out_dmg_mods = stats.get('outDmgMods', {}).get('list', [])
        for mod in out_dmg_mods:
            if isinstance(mod, dict) and 't' in mod and 'v' in mod:
                result['damage_modifiers']['outDmgMods'].append({
                    'type': mod['t'],
                    'value': mod['v']
                })

        # Process inDmgMods
        in_dmg_mods = stats.get('inDmgMods', {}).get('list', [])
        for mod in in_dmg_mods:
            if isinstance(mod, dict) and 't' in mod and 'v' in mod:
                result['damage_modifiers']['inDmgMods'].append({
                    'type': mod['t'],
                    'value': mod['v']
                })

        # Extract global damage modifiers
        result['damage_modifiers']['outAllDmgMod'] = stats.get('outAllDmgMod', 0.0)
        result['damage_modifiers']['inAllDmgMod'] = stats.get('inAllDmgMod', 0.0)

        # Extract ability IDs
        abilities = unit_data.get('abilities', [])
        for i, ability in enumerate(abilities):
            ability_id = f"{unit_data.get('id', 'unknown')}_ability_{i}"
            damage_dealer = ability.get('damageDealer', {})
            buff = damage_dealer.get('buff', {})

            ability_info = {
                'id': ability_id,
                'type': 'active',
                'attack_type': ability.get('attackType_', 'cast'),
                'rank': ability.get('rank', 0),
                'cooldown': ability.get('cd', 0),
                'energy_level': ability.get('energyLevel', 0),
                'buff_sid': buff.get('sid', ''),
                'tags': damage_dealer.get('tags', []),
            }
            result['abilities'].append(ability_info)

        # Extract passive abilities
        passives = unit_data.get('passives', [])
        for i, passive in enumerate(passives):
            passive_id = f"{unit_data.get('id', 'unknown')}_passive_{i}"
            passive_info = {
                'id': passive_id,
                'type': 'passive',
            }

            # Check for aura-like effects
            if 'data' in passive:
                data = passive['data']
                if 'immunities' in data:
                    passive_info['immunities'] = data['immunities']
                if 'disablers' in data:
                    passive_info['disablers'] = data['disablers']
                if 'stats' in data:
                    passive_info['stat_mods'] = data['stats']

            # Check for triggered actions
            if 'actions' in passive:
                passive_info['triggers'] = []
                for action in passive['actions']:
                    trigger_info = {
                        'trigger': action.get('trigger', ''),
                        'conditions': action.get('triggerConditions', []),
                    }
                    damage_dealer = action.get('damageDealer', {})
                    if damage_dealer:
                        trigger_info['buff'] = damage_dealer.get('buff', {})
                        trigger_info['mechanics'] = damage_dealer.get('targetMechanics', [])
                    passive_info['triggers'].append(trigger_info)

            result['abilities'].append(passive_info)

        # Check for aura
        aura = unit_data.get('aura')
        if aura:
            aura_info = {
                'id': f"{unit_data.get('id', 'unknown')}_aura",
                'type': 'aura',
                'radius': aura.get('radius', 0),
                'target': aura.get('target', ''),
                'power': aura.get('power', 0),
            }
            aura_data = aura.get('data', {})
            if 'stats' in aura_data:
                aura_info['stat_mods'] = aura_data['stats']
            result['abilities'].append(aura_info)

        return result

    def extract_buff_effects(self, buff_sid: str) -> dict:
        """
        Extract combat effects from a buff.

        Args:
            buff_sid: The buff's string ID

        Returns:
            Dict with stat modifiers and effects
        """
        self.load()

        buff = self._buffs.get(buff_sid, {})
        if not buff:
            return {}

        result = {
            'stat_mods': {},
            'damage_mods': {
                'outDmgMods': [],
                'inDmgMods': [],
            },
            'effects': []
        }

        data = buff.get('data', {})
        stats = data.get('stats', {})

        # Extract flat stat modifiers
        for stat in ['offence', 'defence', 'damageMin', 'damageMax', 'hp',
                     'initiative', 'speed', 'luck', 'moral']:
            if stat in stats:
                result['stat_mods'][stat] = stats[stat]

        # Extract percentage stat modifiers
        for stat in ['offencePerc', 'defencePerc', 'hpPerc', 'damageMinPerc',
                     'damageMaxPerc', 'initiativePerc', 'speedPerc']:
            if stat in stats:
                result['stat_mods'][stat] = stats[stat]

        # Extract damage modifiers
        out_dmg_mods = stats.get('outDmgMods', {}).get('list', [])
        for mod in out_dmg_mods:
            if isinstance(mod, dict) and 't' in mod and 'v' in mod:
                result['damage_mods']['outDmgMods'].append({
                    'type': mod['t'],
                    'value': mod['v']
                })

        in_dmg_mods = stats.get('inDmgMods', {}).get('list', [])
        for mod in in_dmg_mods:
            if isinstance(mod, dict) and 't' in mod and 'v' in mod:
                result['damage_mods']['inDmgMods'].append({
                    'type': mod['t'],
                    'value': mod['v']
                })

        # Check for special effects
        if 'outAllDmgMod' in stats:
            result['stat_mods']['outAllDmgMod'] = stats['outAllDmgMod']
        if 'inAllDmgMod' in stats:
            result['stat_mods']['inAllDmgMod'] = stats['inAllDmgMod']

        return result

    def get_all_unit_abilities(self) -> list:
        """
        Get all unique unit abilities from the codebase.

        Returns:
            List of ability dictionaries with extracted effects
        """
        self.load()

        abilities = []
        units_dir = self.db_path / "units" / "units_logics"

        if not units_dir.exists():
            return abilities

        seen_abilities = set()

        for json_file in units_dir.rglob("*_l.json"):
            try:
                with open(json_file, 'r', encoding='utf-8-sig') as f:
                    data = json.load(f)

                for unit in data.get('array', []):
                    unit_id = unit.get('id', '')

                    # Process active abilities
                    for i, ability in enumerate(unit.get('abilities', [])):
                        ability_id = f"{unit_id}_ability_{i}"
                        if ability_id in seen_abilities:
                            continue
                        seen_abilities.add(ability_id)

                        damage_dealer = ability.get('damageDealer', {})
                        buff = damage_dealer.get('buff', {})
                        buff_effects = {}
                        if buff.get('sid'):
                            buff_effects = self.extract_buff_effects(buff['sid'])

                        abilities.append({
                            'id': ability_id,
                            'unit_id': unit_id,
                            'type': 'active',
                            'attack_type': ability.get('attackType_', 'cast'),
                            'rank': ability.get('rank', 0),
                            'cooldown': ability.get('cd', 0),
                            'energy_level': ability.get('energyLevel', 0),
                            'buff_sid': buff.get('sid', ''),
                            'buff_effects': buff_effects,
                            'tags': damage_dealer.get('tags', []),
                            'raw_data': ability
                        })

            except Exception:
                continue

        return abilities

    def extract_skill_combat_effects(self, skill_data: dict, skill_id: str) -> dict:
        """
        Extract combat-relevant effects from a hero skill.

        Args:
            skill_data: Raw skill data from database
            skill_id: The skill identifier

        Returns:
            Dict with combat modifiers per level
        """
        self.load()

        result = {}
        levels = skill_data.get('parametersPerLevel', [])

        for level_idx, level_data in enumerate(levels):
            level = level_idx + 1
            level_result = {
                'stat_mods': {},
                'damage_mods': {
                    'outDmgMods': [],
                    'inDmgMods': [],
                },
                'unit_bonuses': []
            }

            # Check bonuses for stat modifications
            bonuses = level_data.get('bonuses', [])
            for bonus in bonuses:
                bonus_type = bonus.get('bonusType', '')
                params = bonus.get('parameters', [])

                # Map common bonus types to stat mods
                if bonus_type == 'HeroStatBonus' and len(params) >= 2:
                    stat_name = params[0]
                    try:
                        stat_value = float(params[1])
                        level_result['stat_mods'][stat_name] = stat_value
                    except (ValueError, TypeError):
                        pass

                elif bonus_type == 'UnitStatBonus' and len(params) >= 2:
                    # Unit stat bonuses (applied to all units)
                    stat_name = params[0]
                    try:
                        stat_value = float(params[1])
                        level_result['unit_bonuses'].append({
                            'stat': stat_name,
                            'value': stat_value,
                            'conditions': bonus.get('conditions', [])
                        })
                    except (ValueError, TypeError):
                        pass

            result[level] = level_result

        return result


def get_combat_extractor(db_path: Optional[Path] = None) -> CombatValueExtractor:
    """
    Get a combat value extractor instance.

    Args:
        db_path: Path to extracted DB. Defaults to /tmp/DB.

    Returns:
        CombatValueExtractor instance
    """
    if db_path is None:
        db_path = Path("/tmp/DB")
    return CombatValueExtractor(db_path)
