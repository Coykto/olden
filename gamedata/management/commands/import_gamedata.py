"""
Django management command to import game data from Heroes of Might and Magic: Olden Era.

Usage:
    python manage.py import_gamedata
    python manage.py import_gamedata --force  # Force re-import even if version exists
"""
import re
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify
from gamedata.models import GameVersion, Faction, Unit, Hero, Skill, Item, ItemSet, Spell, MagicSchool, UnitAbility, CombatModifier, AdvancedClass
from core.data_reader import GameDataReader
from core.asset_extractor import AssetExtractor
from core.skill_value_extractor import SkillValueExtractor
from core.localizations import get_localized_name
from core.combat_value_extractor import CombatValueExtractor


class Command(BaseCommand):
    help = 'Import game data from Heroes of Might and Magic: Olden Era installation'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force re-import even if this version already exists',
        )

    def handle(self, *args, **options):
        force = options['force']

        self.stdout.write("Starting game data import...")

        # Initialize data reader
        reader = GameDataReader()

        # Get version info
        self.stdout.write("Extracting version information...")
        build_id, last_updated = reader.get_version_info()
        self.stdout.write(f"Found game version: Build {build_id} (updated {last_updated})")

        # Check if this version already exists
        version, created = GameVersion.objects.get_or_create(
            build_id=build_id,
            defaults={
                'game_updated_at': last_updated,
                'is_active': True,
            }
        )

        if not created and not force:
            self.stdout.write(self.style.WARNING(
                f"Version {build_id} already exists. Use --force to re-import."
            ))
            return

        if not created and force:
            self.stdout.write(self.style.WARNING(
                f"Re-importing version {build_id} (deleting existing data)..."
            ))
            # Delete all related data (cascades due to FK)
            version.factions.all().delete()
            version.units.all().delete()
            version.heroes.all().delete()
            version.skills.all().delete()
            version.items.all().delete()
            version.item_sets.all().delete()
            version.spells.all().delete()
            version.magic_schools.all().delete()
            version.advanced_classes.all().delete()

        # Extract game data
        self.stdout.write("Extracting Core.zip...")
        reader.extract()

        # Load localizations
        self.stdout.write("Loading localizations...")
        localizations = reader.get_localizations()
        self.stdout.write(f"  Loaded {len(localizations)} localization strings")

        # Import data within a transaction
        try:
            with transaction.atomic():
                self._import_factions(reader, version, localizations)
                self._import_units(reader, version, localizations)
                self._import_heroes(reader, version, localizations)
                self._import_skills(reader, version)
                self._import_advanced_classes(reader, version)
                self._import_items(reader, version)
                self._import_item_sets(reader, version)
                self._import_magic_schools(reader, version, localizations)
                self._import_spells(reader, version)

            self.stdout.write(self.style.SUCCESS(
                f"Successfully imported game data for version {build_id}"
            ))

            # Extract game assets (images)
            self.stdout.write("Extracting game assets...")
            extractor = AssetExtractor()
            results = extractor.extract_all(force=force)
            for category, count in results.items():
                self.stdout.write(f"  Extracted {count} {category}")

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Import failed: {e}"))
            raise

    def _import_factions(self, reader: GameDataReader, version: GameVersion, localizations: dict):
        """Import faction data."""
        self.stdout.write("Importing factions...")

        data = reader.read_json("data.json")
        factions_data = data.get("availableFractions", [])

        # Map internal faction IDs to skill IDs
        faction_skill_map = {
            'human': 'skill_faction_humans',
            'undead': 'skill_faction_undead',
            'dungeon': 'skill_faction_dungeon',
            'unfrozen': 'skill_faction_unfrozen',
        }

        faction_objects = []
        for sort_order, faction_id in enumerate(factions_data):
            # Get localized faction name (e.g., "human_name" -> "Temple")
            name_key = f"{faction_id}_name"
            faction_name = localizations.get(name_key, faction_id.capitalize())

            # Get faction description
            desc_key = f"{faction_id}_desc"
            faction_desc = localizations.get(desc_key, "")

            faction_objects.append(Faction(
                version=version,
                id_key=faction_id,
                slug=slugify(faction_name),
                name=faction_name,
                description=faction_desc,
                faction_skill=faction_skill_map.get(faction_id, ""),
                sort_order=sort_order
            ))

        # Add neutral faction for neutral units (after playable factions)
        neutral_sort_order = len(factions_data)
        faction_objects.append(Faction(
            version=version,
            id_key='neutral',
            slug='neutral',
            name='Neutral',
            description='Neutral creatures that can be found throughout the world.',
            faction_skill='',
            sort_order=neutral_sort_order
        ))

        Faction.objects.bulk_create(faction_objects)
        self.stdout.write(f"  Created {len(faction_objects)} factions")

    def _get_unit_displayable_abilities(self, unit_id: str, localizations: dict, has_aura: bool = False) -> list:
        """
        Derive displayable ability IDs from localization keys.

        The localization files define which passives/abilities should be displayed.
        We scan for {unit_id}_{passive|ability}_{n}_name keys (1-based in localization)
        and generate 0-based ability IDs for storage.

        For upgraded units (_upg, _upg_alt), we also check the base unit's abilities
        since upgrades often share ability descriptions with their base.
        """
        abilities = []

        # Get base unit ID for upgrades (e.g., griffin_upg -> griffin)
        base_unit_id = re.sub(r'_upg(_alt)?$', '', unit_id)

        # Scan for passives (passive_1, passive_2, etc.)
        for n in range(1, 10):  # Check up to 9 passives
            loc_key = f"{unit_id}_passive_{n}_name"
            base_loc_key = f"{base_unit_id}_passive_{n}_name"
            if loc_key in localizations or (unit_id != base_unit_id and base_loc_key in localizations):
                # Store as 0-based ID
                abilities.append({
                    'id': f"{unit_id}_passive_{n - 1}",
                    'type': 'passive',
                })

        # Scan for abilities (ability_1, ability_2, etc.)
        for n in range(1, 10):  # Check up to 9 abilities
            loc_key = f"{unit_id}_ability_{n}_name"
            base_loc_key = f"{base_unit_id}_ability_{n}_name"
            if loc_key in localizations or (unit_id != base_unit_id and base_loc_key in localizations):
                # Store as 0-based ID
                abilities.append({
                    'id': f"{unit_id}_ability_{n - 1}",
                    'type': 'active',
                })

        # Add aura if present (auras are detected from raw data)
        if has_aura:
            aura_loc_key = f"{unit_id}_aura_name"
            base_aura_key = f"{base_unit_id}_aura_name"
            if aura_loc_key in localizations or base_aura_key in localizations:
                abilities.append({
                    'id': f"{unit_id}_aura",
                    'type': 'aura',
                })

        return abilities

    def _import_units(self, reader: GameDataReader, version: GameVersion, localizations: dict):
        """Import unit data with combat extraction."""
        self.stdout.write("Importing units...")

        units_data = reader.get_all_units()
        faction_map = {f.id_key: f for f in version.factions.all()}

        # Initialize combat extractor
        combat_extractor = CombatValueExtractor(reader.extract_to)
        combat_extractor.load()

        unit_objects = []
        combat_extracted = 0

        for unit_data in units_data:
            faction_id = unit_data.get("fraction")
            if faction_id not in faction_map:
                self.stdout.write(f"  Warning: Skipping unit with unknown faction '{faction_id}'")
                continue

            # Extract costs
            costs = unit_data.get("unitCost", {}).get("costResArray", [])
            cost_dict = {c["name"]: c["cost"] for c in costs}

            # Extract stats
            stats = unit_data.get("stats", {})
            unit_id = unit_data["id"]

            # Get display name using general localization lookup
            display_name = get_localized_name(unit_id, 'unit')

            # Extract combat data (for attack_type and damage_modifiers)
            combat_data = combat_extractor.extract_unit_combat_data(unit_data)
            if combat_data['damage_modifiers']['outDmgMods'] or combat_data['damage_modifiers']['inDmgMods']:
                combat_extracted += 1

            # Derive displayable abilities from localization (not from raw data array indices)
            has_aura = unit_data.get('aura') is not None
            displayable_abilities = self._get_unit_displayable_abilities(unit_id, localizations, has_aura)

            unit_objects.append(Unit(
                version=version,
                id_key=unit_id,
                display_name=display_name,
                faction=faction_map[faction_id],
                tier=unit_data.get("tier", 1),
                squad_value=unit_data.get("squadValue", 0),
                exp_bonus=unit_data.get("expBonus", 0),
                cost_gold=cost_dict.get("gold", 0),
                cost_wood=cost_dict.get("wood", 0),
                cost_ore=cost_dict.get("ore", 0),
                cost_gemstones=cost_dict.get("gemstones", 0),
                cost_crystals=cost_dict.get("crystals", 0),
                cost_mercury=cost_dict.get("mercury", 0),
                hp=stats.get("hp", 1),
                offence=stats.get("offence", 0),
                defence=stats.get("defence", 0),
                damage_min=stats.get("damageMin", 1),
                damage_max=stats.get("damageMax", 1),
                initiative=stats.get("initiative", 0),
                speed=stats.get("speed", 1),
                luck=stats.get("luck", 0),
                moral=stats.get("moral", 0),
                move_type=stats.get("moveType", "ground"),
                attack_type=combat_data['attack_type'],
                abilities=[a['id'] for a in displayable_abilities],
                damage_modifiers=combat_data['damage_modifiers'],
                raw_data=unit_data
            ))

        Unit.objects.bulk_create(unit_objects)
        self.stdout.write(f"  Created {len(unit_objects)} units ({combat_extracted} with damage modifiers)")

    def _import_heroes(self, reader: GameDataReader, version: GameVersion, localizations: dict):
        """Import hero data."""
        self.stdout.write("Importing heroes...")

        heroes_data = reader.get_all_heroes()
        faction_map = {f.id_key: f for f in version.factions.all()}

        # Get campaign/tutorial heroes to exclude
        game_data = reader.read_json("data.json")
        campaign_heroes = set(game_data.get("campaignHeroes", []))
        banned_heroes = set(game_data.get("bannedHeroes", []))
        excluded_heroes = campaign_heroes | banned_heroes

        hero_objects = []
        skipped_count = 0
        for hero_data in heroes_data:
            hero_id = hero_data["id"]

            # Skip campaign/tutorial/banned heroes
            if hero_id in excluded_heroes:
                skipped_count += 1
                continue

            faction_id = hero_data.get("fraction")
            if faction_id not in faction_map:
                continue

            stats = hero_data.get("stats", {})

            # Get display name from localizations
            display_name = localizations.get(hero_id, hero_id.replace("_", " ").title())

            # Generate URL-friendly slug from display name
            hero_slug = slugify(display_name)

            # Get specialization name and description
            spec_name = localizations.get(f"{hero_id}_spec_name", "")
            spec_desc = localizations.get(f"{hero_id}_spec_description", "")

            # Extract sort order from id_key (e.g., "human_hero_1" -> 1)
            sort_match = re.search(r'_(\d+)$', hero_id)
            sort_order = int(sort_match.group(1)) if sort_match else 0

            # Get starting skills
            starting_skills = [s['sid'] for s in hero_data.get('startSkills', [])]

            # Get starting spells (from startMagics)
            starting_spells = hero_data.get('startMagics', [])

            hero_objects.append(Hero(
                version=version,
                id_key=hero_id,
                slug=hero_slug,
                display_name=display_name,
                faction=faction_map[faction_id],
                icon=hero_data.get("icon", ""),
                mesh=hero_data.get("mesh", ""),
                class_type=hero_data.get("classType", "might"),
                specialization_name=spec_name,
                specialization_desc=spec_desc,
                sort_order=sort_order,
                starting_skills=starting_skills,
                starting_spells=starting_spells,
                cost_gold=hero_data.get("costGold", 0),
                start_level=hero_data.get("startLevel", 1),
                start_offence=stats.get("offence", 0),
                start_defence=stats.get("defence", 0),
                start_spell_power=stats.get("spellPower", 0),
                start_intelligence=stats.get("intelligence", 0),
                start_luck=stats.get("luck", 0),
                start_moral=stats.get("moral", 0),
                start_view_radius=hero_data.get("viewRadius", 6),
                raw_data=hero_data
            ))

        Hero.objects.bulk_create(hero_objects)
        self.stdout.write(f"  Created {len(hero_objects)} heroes (skipped {skipped_count} campaign/tutorial heroes)")

    def _import_skills(self, reader: GameDataReader, version: GameVersion):
        """Import skill data with pre-extracted parameter values."""
        self.stdout.write("Importing skills...")

        skills_data = reader.get_all_skills()

        # Initialize the skill value extractor
        extractor = SkillValueExtractor(reader.extract_to)
        extractor.load()
        self.stdout.write(f"  Loaded {len(extractor.get_extraction_rules())} skill extraction rules")

        skill_objects = []
        extracted_count = 0

        for skill_data in skills_data:
            skill_id = skill_data["id"]

            # Extract parameter values for all levels
            extracted_values = extractor.extract_skill_values(skill_id, skill_data)

            # Convert keys to strings for JSON storage
            extracted_values_str = {str(k): v for k, v in extracted_values.items()}

            if extracted_values_str:
                extracted_count += 1

            skill_objects.append(Skill(
                version=version,
                id_key=skill_id,
                skill_type=skill_data.get("skillType", "Common"),
                raw_data=skill_data,
                extracted_values=extracted_values_str
            ))

        Skill.objects.bulk_create(skill_objects)
        self.stdout.write(f"  Created {len(skill_objects)} skills ({extracted_count} with extracted values)")

    def _import_items(self, reader: GameDataReader, version: GameVersion):
        """Import item data.
        
        Note: Campaign items (IDs starting with 'campaign_') are excluded.
        These are story-specific artifacts not meant for the hero builder.
        If needed in the future, remove the startswith check below.
        """
        self.stdout.write("Importing items...")

        items_data = reader.get_all_items()

        item_objects = []
        skipped_campaign = 0
        for item_data in items_data:
            # Skip campaign-specific items (e.g., campaign_M5_friend_item)
            if item_data["id"].startswith("campaign_"):
                skipped_campaign += 1
                continue
                
            item_objects.append(Item(
                version=version,
                id_key=item_data["id"],
                slot=item_data.get("slot_", "item_slot"),
                rarity=item_data.get("rarity", "common"),
                icon=item_data.get("icon", ""),
                goods_value=item_data.get("goodsValue", 0),
                cost_base=item_data.get("costBase", 0),
                cost_per_level=item_data.get("costPerLevel", 0),
                max_level=item_data.get("maxLevel", 1),
                item_set=item_data.get("itemSet", ""),
                raw_data=item_data
            ))

        Item.objects.bulk_create(item_objects)
        self.stdout.write(f"  Created {len(item_objects)} items (skipped {skipped_campaign} campaign items)")

    def _import_item_sets(self, reader: GameDataReader, version: GameVersion):
        """Import item set data."""
        self.stdout.write("Importing item sets...")

        item_sets_data = reader.get_all_item_sets()

        item_set_objects = []
        for set_data in item_sets_data:
            item_set_objects.append(ItemSet(
                version=version,
                id_key=set_data["id"],
                raw_data=set_data
            ))

        ItemSet.objects.bulk_create(item_set_objects)
        self.stdout.write(f"  Created {len(item_set_objects)} item sets")

    def _import_advanced_classes(self, reader: GameDataReader, version: GameVersion):
        """Import advanced class data."""
        self.stdout.write("Importing advanced classes...")

        advanced_classes_data = reader.get_all_advanced_classes()
        faction_map = {f.id_key: f for f in version.factions.all()}

        advanced_class_objects = []
        for ac_data in advanced_classes_data:
            faction_id = ac_data.get("faction")
            if faction_id not in faction_map:
                continue

            # Extract required skill IDs from activation conditions
            required_skill_ids = [
                condition.get("skillSid")
                for condition in ac_data.get("activationConditions", [])
                if condition.get("skillSid")
            ]

            advanced_class_objects.append(AdvancedClass(
                version=version,
                id_key=ac_data["id"],
                faction=faction_map[faction_id],
                class_type=ac_data.get("classType", "might"),
                icon=ac_data.get("icon", ""),
                activation_conditions=ac_data.get("activationConditions", []),
                required_skill_ids=required_skill_ids,
                bonuses=ac_data.get("bonuses", []),
                raw_data=ac_data
            ))

        AdvancedClass.objects.bulk_create(advanced_class_objects)
        self.stdout.write(f"  Created {len(advanced_class_objects)} advanced classes")

    def _import_magic_schools(self, reader: GameDataReader, version: GameVersion, localizations: dict):
        """Import magic school display names."""
        self.stdout.write("Importing magic schools...")

        # Map school IDs to localization keys
        school_localization_keys = {
            'day': 'skill_magic_day_name',
            'night': 'skill_magic_night_name',
            'space': 'skill_magic_space_name',
            'primal': 'skill_magic_primal_name',
            'neutral': 'skill_magic_neutral_name',
        }

        # Default names in case localizations are missing
        default_names = {
            'day': 'Daylight Magic',
            'night': 'Nightshade Magic',
            'space': 'Arcane Magic',
            'primal': 'Primal Magic',
            'neutral': 'Neutral Magic',
        }

        school_objects = []
        for school_id, loc_key in school_localization_keys.items():
            display_name = localizations.get(loc_key, default_names[school_id])
            school_objects.append(MagicSchool(
                version=version,
                id_key=school_id,
                display_name=display_name
            ))

        MagicSchool.objects.bulk_create(school_objects)
        self.stdout.write(f"  Created {len(school_objects)} magic schools")

    def _import_spells(self, reader: GameDataReader, version: GameVersion):
        """Import spell data."""
        self.stdout.write("Importing spells...")

        spells_data = reader.get_all_spells()

        spell_objects = []
        for spell_data in spells_data:
            # Try to determine school from various fields
            school = ""
            spell_id = spell_data.get("id", "")

            if "day" in spell_id or spell_data.get("school") == "day":
                school = "day"
            elif "night" in spell_id or spell_data.get("school") == "night":
                school = "night"
            elif "space" in spell_id or spell_data.get("school") == "space":
                school = "space"
            elif "primal" in spell_id or spell_data.get("school") == "primal":
                school = "primal"
            else:
                school = "neutral"

            spell_objects.append(Spell(
                version=version,
                id_key=spell_data["id"],
                school=school,
                level=spell_data.get("level", 1),
                raw_data=spell_data
            ))

        Spell.objects.bulk_create(spell_objects)
        self.stdout.write(f"  Created {len(spell_objects)} spells")
