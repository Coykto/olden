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
        'skill_icons': re.compile(r'^(skill_|sub_skill_|sub_class_)'),
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

        # Extract item icons
        results['items'] = self._extract_by_pattern('items', self.PATTERNS['item_icons'], force)

        # Extract UI icons (factions, classes)
        results['ui_icons'] = self._extract_ui_icons(force)

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

    def _extract_units(self, force: bool = False) -> int:
        """Extract unit-related textures."""
        output_path = self.output_dir / "units"
        output_path.mkdir(parents=True, exist_ok=True)

        count = 0

        # Units can be in multiple asset files
        for asset_file in self.game_data_path.glob("*.assets"):
            try:
                env = UnityPy.load(str(asset_file))

                for obj in env.objects:
                    if obj.type.name != 'Texture2D':
                        continue

                    try:
                        data = obj.read()
                        name = data.m_Name

                        # Look for unit-related textures
                        # Common unit names from the game
                        unit_keywords = [
                            'esquire', 'crossbowman', 'griffin', 'knight', 'angel',
                            'skeleton', 'zombie', 'vampire', 'lich', 'ghost',
                            'troglodyte', 'medusa', 'assassin', 'hydra',
                            'pixie', 'ent', 'druid', 'phoenix',
                        ]

                        name_lower = name.lower()
                        if any(kw in name_lower for kw in unit_keywords):
                            # Skip non-icon textures (diffuse maps, etc.)
                            if 'diffuse' in name_lower or 'emissive' in name_lower:
                                continue

                            out_file = output_path / f"{name}.png"

                            if not force and out_file.exists():
                                continue

                            image = data.image
                            image.save(str(out_file))
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

                # Match skill icons (skill_* but not effects/abilities)
                if name.startswith('skill_') and data.m_Width == 256:
                    if 'effect' not in name.lower() and 'ability' not in name.lower():
                        out_file = output_path / f"{name}.png"

                        if not force and out_file.exists():
                            continue

                        image = data.image
                        image.save(str(out_file))
                        count += 1

            except Exception:
                pass

        return count

    def _extract_ui_icons(self, force: bool = False) -> int:
        """Extract UI icons (faction icons, class icons)."""
        output_path = self.output_dir / "ui"
        output_path.mkdir(parents=True, exist_ok=True)

        icons_to_find = set(self.FACTION_ICONS + self.CLASS_ICONS)
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

                        if name in icons_to_find:
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
