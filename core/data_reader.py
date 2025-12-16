"""
Utility to extract and read game data from Heroes of Might and Magic: Olden Era installation.
"""
import json
import zipfile
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Tuple
from django.conf import settings


class GameDataReader:
    """Reads and extracts game data from the Core.zip file."""

    def __init__(self, extract_to: Path = None):
        """
        Initialize the reader.

        Args:
            extract_to: Directory to extract game data to. Defaults to /tmp/DB
        """
        self.core_zip_path = settings.GAME_DATA_CORE_ZIP
        self.extract_to = extract_to or Path("/tmp/DB")
        self._extracted = False

    def extract(self, force: bool = False) -> Path:
        """
        Extract the Core.zip file if not already extracted.

        Args:
            force: Force re-extraction even if already extracted

        Returns:
            Path to the extracted DB directory
        """
        if not self.core_zip_path.exists():
            raise FileNotFoundError(f"Core.zip not found at {self.core_zip_path}")

        if force or not self.extract_to.exists():
            print(f"Extracting game data from {self.core_zip_path} to {self.extract_to}")
            with zipfile.ZipFile(self.core_zip_path, 'r') as zip_ref:
                # Extract, ignoring encoding errors for some filenames
                for member in zip_ref.namelist():
                    try:
                        zip_ref.extract(member, self.extract_to.parent)
                    except Exception as e:
                        # Some filenames have encoding issues, skip them
                        print(f"Warning: Could not extract {member}: {e}")
            self._extracted = True

        return self.extract_to

    def read_json(self, relative_path: str) -> Dict[str, Any]:
        """
        Read a JSON file from the extracted game data.

        Args:
            relative_path: Path relative to DB directory (e.g., "units/units_logics/dragon_l.json")

        Returns:
            Parsed JSON data
        """
        if not self._extracted and not self.extract_to.exists():
            self.extract()

        file_path = self.extract_to / relative_path

        if not file_path.exists():
            raise FileNotFoundError(f"Game data file not found: {file_path}")

        with open(file_path, 'r', encoding='utf-8-sig') as f:  # utf-8-sig to handle BOM
            return json.load(f)

    def list_files(self, pattern: str = "*.json") -> List[Path]:
        """
        List all files matching a pattern in the extracted data.

        Args:
            pattern: Glob pattern to match files

        Returns:
            List of matching file paths
        """
        if not self._extracted and not self.extract_to.exists():
            self.extract()

        return list(self.extract_to.rglob(pattern))

    def get_all_units(self) -> List[Dict[str, Any]]:
        """Get all unit data from units_logics directory."""
        units = []
        units_dir = self.extract_to / "units" / "units_logics"

        for json_file in units_dir.rglob("*.json"):
            data = self.read_json(json_file.relative_to(self.extract_to))
            if "array" in data:
                units.extend(data["array"])

        return units

    def get_all_heroes(self) -> List[Dict[str, Any]]:
        """Get all hero data from heroes directory."""
        heroes = []
        heroes_dir = self.extract_to / "heroes"

        for json_file in heroes_dir.rglob("*.json"):
            if json_file.name == "heroes.json":  # Skip if there's a summary file
                continue
            data = self.read_json(json_file.relative_to(self.extract_to))
            if "array" in data:
                heroes.extend(data["array"])

        return heroes

    def get_all_items(self) -> List[Dict[str, Any]]:
        """Get all item data from items directory."""
        items = []
        items_dir = self.extract_to / "items" / "items"

        for json_file in items_dir.rglob("*.json"):
            data = self.read_json(json_file.relative_to(self.extract_to))
            if "array" in data:
                items.extend(data["array"])

        return items

    def get_all_skills(self) -> List[Dict[str, Any]]:
        """Get all skill data from heroes_skills directory."""
        data = self.read_json("heroes_skills/skills/skills.json")
        return data.get("array", [])

    def get_all_advanced_classes(self) -> List[Dict[str, Any]]:
        """Get all advanced class data from heroes_sub_classes directory."""
        advanced_classes = []
        sub_classes_dir = self.extract_to / "heroes_sub_classes"

        for json_file in sub_classes_dir.rglob("sub_classes_*.json"):
            data = self.read_json(json_file.relative_to(self.extract_to))
            if "array" in data:
                advanced_classes.extend(data["array"])

        return advanced_classes

    def get_all_spells(self) -> List[Dict[str, Any]]:
        """Get all magic/spell data from magics directory."""
        spells = []
        magics_dir = self.extract_to / "magics"

        for json_file in magics_dir.rglob("*.json"):
            data = self.read_json(json_file.relative_to(self.extract_to))
            if "array" in data:
                spells.extend(data["array"])

        return spells

    def get_version_info(self) -> Tuple[str, datetime]:
        """
        Extract game version information from Steam manifest.

        Returns:
            Tuple of (build_id, last_updated_datetime)
        """
        # Find the Steam manifest for Heroes of Might and Magic: Olden Era
        # AppID: 3241970
        steam_dir = settings.GAME_DATA_PATH.parent.parent.parent
        manifest_path = steam_dir / "appmanifest_3241970.acf"

        if not manifest_path.exists():
            raise FileNotFoundError(f"Steam manifest not found at {manifest_path}")

        with open(manifest_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract buildid and LastUpdated timestamp
        build_match = re.search(r'"buildid"\s+"(\d+)"', content)
        updated_match = re.search(r'"LastUpdated"\s+"(\d+)"', content)

        if not build_match or not updated_match:
            raise ValueError("Could not extract version info from Steam manifest")

        build_id = build_match.group(1)
        timestamp = int(updated_match.group(1))
        last_updated = datetime.fromtimestamp(timestamp)

        return build_id, last_updated

    def get_localizations(self, lang: str = "english") -> Dict[str, str]:
        """
        Get localization strings for hero/unit/item names.

        Args:
            lang: Language to load (default: english)

        Returns:
            Dictionary mapping SID to localized text
        """
        lang_dir = settings.GAME_DATA_PATH / "StreamingAssets" / "Lang" / lang / "texts"

        localizations = {}

        # Read all localization files
        for json_file in lang_dir.glob("*.json"):
            with open(json_file, 'r', encoding='utf-8-sig') as f:
                data = json.load(f)
                tokens = data.get("tokens", [])
                for token in tokens:
                    sid = token.get("sid")
                    text = token.get("text")
                    if sid and text:
                        localizations[sid] = text

        return localizations
