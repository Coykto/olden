"""
Utility to extract images from Unity asset bundles for Heroes of Might and Magic: Olden Era.
"""
import re
from pathlib import Path
from typing import Dict, List, Optional
from django.conf import settings

import UnityPy


class AssetExtractor:
    """Extracts textures from Unity asset files."""

    # Patterns for different asset types
    PATTERNS = {
        'hero_portraits': re.compile(r'^hero_(human|necromancer|dungeon|unfrozen)_\d+_\w+$'),
        'hero_portraits_large': re.compile(r'^hero_(human|necromancer|dungeon|unfrozen)_\d+_\w+_large$'),
        'unit_icons': re.compile(r'^[a-z_]+_(icon|diffuse)$'),
        'skill_icons': re.compile(r'^(skill_|sub_skill_)'),
        'advanced_class_icons': re.compile(r'^sub_class_'),
        'item_icons': re.compile(r'_artifact$'),
        'faction_icons': re.compile(r'^fraction_(human|undead|dungeon|unfrozen|demon|nature)'),
    }

    def __init__(self, output_dir: Optional[Path] = None):
        """
        Initialize the extractor.

        Args:
            output_dir: Directory to save extracted images. Defaults to MEDIA_ROOT/gamedata
        """
        self.game_data_path = settings.GAME_DATA_PATH
        self.output_dir = output_dir or Path(settings.BASE_DIR) / "media" / "gamedata"

    # Specific icons to extract by exact name
    FACTION_ICONS = ['human_icon', 'undead_icon', 'dungeon_icon', 'unfrozen_icon']
    CLASS_ICONS = [
        'might_human_icon', 'magic_human_icon',
        'might_undead_icon', 'magic_undead_icon',
        'might_dungeon_icon', 'magic_dungeon_icon',
        'might_unfrozen_icon', 'magic_unfrozen_icon',
    ]
    # Generic class type icons (source name -> destination name)
    GENERIC_CLASS_ICONS = {
        'wip_might_specialization_icon': 'might_icon',
        'wip_mage_specialization_icon': 'magic_icon',
    }
    # Unit stat icons (40x40)
    STAT_ICONS = [
        'unit_attack', 'unit_damage', 'unit_defence', 'unit_health',
        'unit_init', 'unit_luck', 'unit_moral', 'unit_speed',
    ]

    def extract_all(self, force: bool = False) -> Dict[str, int]:
        """
        Extract all game assets.

        Args:
            force: Force re-extraction even if files exist

        Returns:
            Dict with counts of extracted assets by type
        """
        results = {}

        # Extract hero portraits
        results['hero_portraits'] = self._extract_hero_portraits(force)

        # Extract unit textures
        results['units'] = self._extract_units(force)

        # Extract skill icons
        results['skills'] = self._extract_skill_icons(force)

        # Extract advanced class icons
        results['advanced_classes'] = self._extract_advanced_class_icons(force)

        # Extract item icons (512x512 only, skip minimap icons)
        results['items'] = self._extract_item_icons(force)

        # Extract resource icons (256x256 clean icons)
        results['resources'] = self._extract_resource_icons(force)

        # Extract UI icons (factions, classes)
        results['ui_icons'] = self._extract_ui_icons(force)

        # Extract spell icons
        results['spells'] = self._extract_spell_icons(force)

        # Extract stat icons
        results['stat_icons'] = self._extract_stat_icons(force)

        # Extract passive/ability icons (creature types, attack types, unit abilities)
        results['passives'] = self._extract_passive_icons(force)

        return results

    def _extract_hero_portraits(self, force: bool = False) -> int:
        """Extract hero portrait images."""
        output_path = self.output_dir / "heroes"
        output_path.mkdir(parents=True, exist_ok=True)

        count = 0
        resources_path = self.game_data_path / "resources.assets"

        if not resources_path.exists():
            print(f"Warning: resources.assets not found at {resources_path}")
            return 0

        env = UnityPy.load(str(resources_path))

        for obj in env.objects:
            if obj.type.name != 'Texture2D':
                continue

            try:
                data = obj.read()
                name = data.m_Name

                # Match hero portrait pattern (skip _large versions for now)
                if self.PATTERNS['hero_portraits'].match(name):
                    out_file = output_path / f"{name}.png"

                    if not force and out_file.exists():
                        continue

                    image = data.image
                    image.save(str(out_file))
                    count += 1

                # Also extract large versions to a subfolder
                elif self.PATTERNS['hero_portraits_large'].match(name):
                    large_path = output_path / "large"
                    large_path.mkdir(parents=True, exist_ok=True)

                    # Remove _large suffix for filename
                    base_name = name.replace('_large', '')
                    out_file = large_path / f"{base_name}.png"

                    if not force and out_file.exists():
                        continue

                    image = data.image
                    image.save(str(out_file))
                    count += 1

            except Exception as e:
                print(f"Warning: Could not extract {data.m_Name if data else 'unknown'}: {e}")

        return count

    # Only map full names that differ from id_keys (e.g., troglodyte -> trogl)
    # Most units use their id_key directly as asset name, so we only need exceptions
    UNIT_FULL_NAME_TO_ID = {
        'troglodyte': 'trogl',
        'minotaur': 'minos',
        'bonedragon': 'bone_dragon',
        'blackdragon': 'black_dragon',
        'iceguard': 'ice_guard',
        'frostgiant': 'frost_giant',
    }

    def _get_all_unit_ids(self) -> set:
        """
        GENERAL SOLUTION: Dynamically get all unit IDs from game data.
        This ensures we match any unit without hardcoding the full list.
        """
        import json
        import zipfile

        unit_ids = set()
        core_zip = self.game_data_path / "StreamingAssets" / "Core.zip"

        if not core_zip.exists():
            return unit_ids

        try:
            with zipfile.ZipFile(core_zip, 'r') as zf:
                # Find all unit logic files
                for name in zf.namelist():
                    if name.startswith('DB/units/units_logics/') and name.endswith('_l.json'):
                        try:
                            content = zf.read(name).decode('utf-8-sig')
                            data = json.loads(content)
                            for unit in data.get('array', []):
                                unit_id = unit.get('id')
                                if unit_id:
                                    unit_ids.add(unit_id)
                        except:
                            pass
        except Exception as e:
            print(f"Warning: Could not read unit IDs from Core.zip: {e}")

        return unit_ids

    def _extract_units(self, force: bool = False) -> int:
        """
        Extract unit portrait sprites.

        GENERAL SOLUTION: Dynamically discovers all unit IDs from game data,
        then extracts Sprite objects (not Texture2D) which are properly cropped
        portrait images rather than raw 3D model diffuse textures.
        """
        output_path = self.output_dir / "units"
        output_path.mkdir(parents=True, exist_ok=True)

        count = 0
        extracted_ids = set()

        # Get all unit IDs from game data (GENERAL - not hardcoded)
        all_unit_ids = self._get_all_unit_ids()

        # Build name-to-id mapping: includes id_keys directly + full name exceptions
        name_to_id = {}
        for unit_id in all_unit_ids:
            name_to_id[unit_id.lower()] = unit_id
        for full_name, unit_id in self.UNIT_FULL_NAME_TO_ID.items():
            name_to_id[full_name.lower()] = unit_id

        # Patterns to skip (not unit portraits)
        skip_patterns = ['ability', 'passive', 'aura', 'buff', 'debuff',
                        'icon', 'name', 'build', 'campaign', 'selfbuff']

        # Extract from all asset files
        for asset_file in self.game_data_path.glob("*.assets"):
            try:
                env = UnityPy.load(str(asset_file))

                for obj in env.objects:
                    # Use Sprite objects for proper portrait images
                    if obj.type.name != 'Sprite':
                        continue

                    try:
                        data = obj.read()
                        name = data.m_Name
                        name_lower = name.lower()

                        # Skip non-portrait sprites (abilities, passives, etc.)
                        if any(p in name_lower for p in skip_patterns):
                            continue

                        # Try to match to a unit id_key
                        matched_id = None

                        # Check for exact match (most common case)
                        if name_lower in name_to_id:
                            matched_id = name_to_id[name_lower]
                        else:
                            # Check for upgrade variants (e.g., medusa_upg)
                            for asset_name, unit_id in name_to_id.items():
                                if name_lower.startswith(asset_name):
                                    # Determine the full id (base, _upg, or _upg_alt)
                                    suffix = name_lower[len(asset_name):]
                                    if suffix == '' or suffix.startswith('_upg'):
                                        matched_id = unit_id
                                        if '_upg_alt' in name_lower:
                                            matched_id = f"{unit_id}_upg_alt"
                                        elif '_upg' in name_lower:
                                            matched_id = f"{unit_id}_upg"
                                        break

                        if matched_id and matched_id not in extracted_ids:
                            out_file = output_path / f"{matched_id}.png"

                            if not force and out_file.exists():
                                extracted_ids.add(matched_id)
                                continue

                            image = data.image
                            image.save(str(out_file))
                            extracted_ids.add(matched_id)
                            count += 1

                    except Exception:
                        pass

            except Exception as e:
                print(f"Warning: Could not process {asset_file}: {e}")

        return count

    def _extract_by_pattern(self, category: str, pattern: re.Pattern, force: bool = False) -> int:
        """Extract textures matching a pattern."""
        output_path = self.output_dir / category
        output_path.mkdir(parents=True, exist_ok=True)

        count = 0

        for asset_file in self.game_data_path.glob("*.assets"):
            try:
                env = UnityPy.load(str(asset_file))

                for obj in env.objects:
                    if obj.type.name != 'Texture2D':
                        continue

                    try:
                        data = obj.read()
                        name = data.m_Name

                        if pattern.search(name):
                            out_file = output_path / f"{name}.png"

                            if not force and out_file.exists():
                                continue

                            image = data.image
                            image.save(str(out_file))
                            count += 1

                    except Exception:
                        pass

            except Exception:
                pass

        return count

    def _extract_skill_icons(self, force: bool = False) -> int:
        """Extract skill icons (256x256 skill_* textures)."""
        output_path = self.output_dir / "skills"
        output_path.mkdir(parents=True, exist_ok=True)

        count = 0
        # Skills are in resources.assets
        resources_path = self.game_data_path / "resources.assets"

        if not resources_path.exists():
            return 0

        env = UnityPy.load(str(resources_path))

        for obj in env.objects:
            if obj.type.name != 'Texture2D':
                continue

            try:
                data = obj.read()
                name = data.m_Name

                # Match skill icons (skill_* but not effects/abilities, and not sub_class_)
                if name.startswith('skill_') and data.m_Width == 256:
                    if 'effect' not in name.lower() and 'ability' not in name.lower() and not name.startswith('sub_class_'):
                        out_file = output_path / f"{name}.png"

                        if not force and out_file.exists():
                            continue

                        image = data.image
                        image.save(str(out_file))
                        count += 1

            except Exception:
                pass

        return count

    def _extract_advanced_class_icons(self, force: bool = False) -> int:
        """Extract advanced class icons (sub_class_* textures)."""
        output_path = self.output_dir / "advanced_classes"
        output_path.mkdir(parents=True, exist_ok=True)

        count = 0
        # Advanced class icons are in resources.assets
        resources_path = self.game_data_path / "resources.assets"

        if not resources_path.exists():
            return 0

        env = UnityPy.load(str(resources_path))

        for obj in env.objects:
            if obj.type.name != 'Texture2D':
                continue

            try:
                data = obj.read()
                name = data.m_Name

                # Match advanced class icons (sub_class_* icons)
                if name.startswith('sub_class_') and '_icon' in name:
                    out_file = output_path / f"{name}.png"

                    if not force and out_file.exists():
                        continue

                    image = data.image
                    image.save(str(out_file))
                    count += 1

            except Exception:
                pass

        return count

    def _extract_item_icons(self, force: bool = False) -> int:
        """Extract item icons (512x512 artifact textures only, skip minimap icons)."""
        output_path = self.output_dir / "items"
        output_path.mkdir(parents=True, exist_ok=True)

        count = 0
        pattern = self.PATTERNS['item_icons']

        for asset_file in self.game_data_path.glob("*.assets"):
            try:
                env = UnityPy.load(str(asset_file))

                for obj in env.objects:
                    if obj.type.name != 'Texture2D':
                        continue

                    try:
                        data = obj.read()
                        name = data.m_Name

                        # Match artifact pattern AND filter for 512x512 (skip 64x64 minimap icons)
                        if pattern.search(name) and data.m_Width == 512:
                            out_file = output_path / f"{name}.png"

                            if not force and out_file.exists():
                                continue

                            image = data.image
                            image.save(str(out_file))
                            count += 1

                    except Exception:
                        pass

            except Exception:
                pass

        return count

    def _extract_resource_icons(self, force: bool = False) -> int:
        """Extract clean resource icons (256x256 versions without map background)."""
        output_path = self.output_dir / "resources"
        output_path.mkdir(parents=True, exist_ok=True)

        # Map of texture name -> output filename
        # These are the clean 256x256 resource icons (not the 64x64 map versions)
        resource_icons = {
            'dust': 'dust.png',
            'gold': 'gold.png',
            'ore': 'ore.png',
            'mercury': 'mercury.png',
            'wood': 'wood.png',
            'crystals': 'crystals.png',
            'gemstones': 'gemstones.png',
        }

        count = 0

        for asset_file in self.game_data_path.glob("*.assets"):
            try:
                env = UnityPy.load(str(asset_file))

                for obj in env.objects:
                    if obj.type.name != 'Texture2D':
                        continue

                    try:
                        data = obj.read()
                        name = data.m_Name

                        # Only extract exact matches for clean 256x256 icons
                        if name in resource_icons and data.m_Width == 256:
                            out_file = output_path / resource_icons[name]

                            if not force and out_file.exists():
                                continue

                            image = data.image
                            image.save(str(out_file))
                            count += 1

                    except Exception:
                        pass

            except Exception:
                pass

        return count

    def _extract_ui_icons(self, force: bool = False) -> int:
        """Extract UI icons (faction icons, class icons, generic class type icons)."""
        output_path = self.output_dir / "ui"
        output_path.mkdir(parents=True, exist_ok=True)

        icons_to_find = set(self.FACTION_ICONS + self.CLASS_ICONS)
        generic_icons = self.GENERIC_CLASS_ICONS  # source_name -> dest_name mapping
        count = 0

        for asset_file in self.game_data_path.glob("*.assets"):
            try:
                env = UnityPy.load(str(asset_file))

                for obj in env.objects:
                    if obj.type.name != 'Texture2D':
                        continue

                    try:
                        data = obj.read()
                        name = data.m_Name

                        # Check for exact match icons
                        if name in icons_to_find:
                            out_file = output_path / f"{name}.png"

                            if not force and out_file.exists():
                                continue

                            image = data.image
                            image.save(str(out_file))
                            count += 1

                        # Check for generic class icons (with name mapping)
                        elif name in generic_icons:
                            dest_name = generic_icons[name]
                            out_file = output_path / f"{dest_name}.png"

                            if not force and out_file.exists():
                                continue

                            image = data.image
                            image.save(str(out_file))
                            count += 1

                    except Exception:
                        pass

            except Exception:
                pass

        return count

    def _extract_spell_icons(self, force: bool = False) -> int:
        """Extract spell icons (256x256 magic spell textures)."""
        output_path = self.output_dir / "spells"
        output_path.mkdir(parents=True, exist_ok=True)

        count = 0
        # Spell icons are in resources.assets
        resources_path = self.game_data_path / "resources.assets"

        if not resources_path.exists():
            return 0

        env = UnityPy.load(str(resources_path))

        # Spell icon naming patterns:
        # - day_01_magic_blessing, day_02_magic_*, etc.
        # - night_01_magic_*, night_02_magic_*, etc.
        # - space_01_magic_*, space_02_magic_*, etc.
        # - primal_01_magic_*, primal_02_magic_*, etc.
        # - neutral_01_magic_*, neutral_02_magic_*, etc.
        # - bonus_magic_* (special abilities)
        # - kara_* (hero-specific spells)
        spell_prefixes = ('day_', 'night_', 'space_', 'primal_', 'neutral_', 'bonus_magic_', 'kara_')

        for obj in env.objects:
            if obj.type.name != 'Texture2D':
                continue

            try:
                data = obj.read()
                name = data.m_Name

                # Match spell icons by prefix and ensure they're 256x256
                if name.startswith(spell_prefixes) and data.m_Width == 256:
                    # Skip non-magic textures (make sure it contains 'magic' for school prefixes)
                    if name.startswith(('day_', 'night_', 'space_', 'primal_', 'neutral_')) and '_magic_' not in name:
                        continue

                    out_file = output_path / f"{name}.png"

                    if not force and out_file.exists():
                        continue

                    image = data.image
                    image.save(str(out_file))
                    count += 1

            except Exception:
                pass

        return count

    def _extract_stat_icons(self, force: bool = False) -> int:
        """Extract unit stat icons (40x40 textures)."""
        output_path = self.output_dir / "ui"
        output_path.mkdir(parents=True, exist_ok=True)

        count = 0
        # Stat icons are in resources.assets
        resources_path = self.game_data_path / "resources.assets"

        if not resources_path.exists():
            return 0

        env = UnityPy.load(str(resources_path))

        for obj in env.objects:
            if obj.type.name != 'Texture2D':
                continue

            try:
                data = obj.read()
                name = data.m_Name

                # Match stat icons by exact name
                if name in self.STAT_ICONS:
                    out_file = output_path / f"{name}.png"

                    if not force and out_file.exists():
                        continue

                    image = data.image
                    image.save(str(out_file))
                    count += 1

            except Exception:
                pass

        return count

    def _extract_passive_icons(self, force: bool = False) -> int:
        """Extract passive/ability icons (creature types, attack types, unit abilities).

        These are 200x200 circular icons used for unit passives and abilities.
        Includes:
        - base_class_* (creature types: living, undead, dragon, etc.)
        - base_passive_* (attack types: melee_attack, ranged_attack, etc.)
        - {unit}_passive_*_name and {unit}_ability_*_name (unit-specific abilities)
        """
        output_path = self.output_dir / "passives"
        output_path.mkdir(parents=True, exist_ok=True)

        count = 0
        # Passive icons are in resources.assets
        resources_path = self.game_data_path / "resources.assets"

        if not resources_path.exists():
            return 0

        env = UnityPy.load(str(resources_path))

        for obj in env.objects:
            if obj.type.name != 'Texture2D':
                continue

            try:
                data = obj.read()
                name = data.m_Name

                # Match passive/ability icons:
                # - base_class_* (creature type icons, 200x200)
                # - base_passive_* (base passive icons like attack types)
                # - *_passive_*_name (unit-specific passive icons)
                # - *_ability_*_name (unit-specific ability icons)
                is_passive_icon = (
                    name.startswith('base_class_') or
                    name.startswith('base_passive_') or
                    name.startswith('base_demon_') or
                    name.startswith('base_magical_') or
                    ('_passive_' in name and name.endswith('_name')) or
                    ('_ability_' in name and name.endswith('_name'))
                )

                if is_passive_icon:
                    out_file = output_path / f"{name}.png"

                    if not force and out_file.exists():
                        continue

                    image = data.image
                    image.save(str(out_file))
                    count += 1

            except Exception:
                pass

        return count

    def get_hero_portrait_path(self, icon_key: str) -> Optional[str]:
        """
        Get the relative path to a hero portrait image.

        Args:
            icon_key: The icon key from hero data (e.g., "hero_human_1_ister")

        Returns:
            Relative path from MEDIA_URL or None if not found
        """
        portrait_file = self.output_dir / "heroes" / f"{icon_key}.png"
        if portrait_file.exists():
            return f"gamedata/heroes/{icon_key}.png"
        return None
