"""
Django management command to import game data from Heroes of Might and Magic: Olden Era.

Usage:
    python manage.py import_gamedata
    python manage.py import_gamedata --force  # Force re-import even if version exists
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify
from gamedata.models import GameVersion, Faction, Unit, Hero, Skill, Item, Spell
from core.data_reader import GameDataReader


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
            version.spells.all().delete()

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
                self._import_items(reader, version)
                self._import_spells(reader, version)

            self.stdout.write(self.style.SUCCESS(
                f"Successfully imported game data for version {build_id}"
            ))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Import failed: {e}"))
            raise

    def _import_factions(self, reader: GameDataReader, version: GameVersion, localizations: dict):
        """Import faction data."""
        self.stdout.write("Importing factions...")

        data = reader.read_json("data.json")
        factions_data = data.get("availableFractions", [])

        faction_objects = []
        for faction_id in factions_data:
            # Get localized faction name (e.g., "human_name" -> "Temple")
            name_key = f"{faction_id}_name"
            faction_name = localizations.get(name_key, faction_id.capitalize())

            faction_objects.append(Faction(
                version=version,
                id_key=faction_id,
                name=faction_name
            ))

        Faction.objects.bulk_create(faction_objects)
        self.stdout.write(f"  Created {len(faction_objects)} factions")

    def _import_units(self, reader: GameDataReader, version: GameVersion, localizations: dict):
        """Import unit data."""
        self.stdout.write("Importing units...")

        units_data = reader.get_all_units()
        faction_map = {f.id_key: f for f in version.factions.all()}

        unit_objects = []
        for unit_data in units_data:
            faction_id = unit_data.get("fraction")
            if faction_id not in faction_map:
                continue  # Skip neutral/invalid factions for now

            # Extract costs
            costs = unit_data.get("unitCost", {}).get("costResArray", [])
            cost_dict = {c["name"]: c["cost"] for c in costs}

            # Extract stats
            stats = unit_data.get("stats", {})
            unit_id = unit_data["id"]

            # Get display name from localizations
            display_name = localizations.get(unit_id, unit_id.replace("_", " ").title())

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
                raw_data=unit_data
            ))

        Unit.objects.bulk_create(unit_objects)
        self.stdout.write(f"  Created {len(unit_objects)} units")

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

            hero_objects.append(Hero(
                version=version,
                id_key=hero_id,
                slug=hero_slug,
                display_name=display_name,
                faction=faction_map[faction_id],
                icon=hero_data.get("icon", ""),
                mesh=hero_data.get("mesh", ""),
                class_type=hero_data.get("classType", "might"),
                cost_gold=hero_data.get("costGold", 0),
                start_level=hero_data.get("startLevel", 1),
                start_offence=stats.get("offence", 0),
                start_defence=stats.get("defence", 0),
                start_spell_power=stats.get("spellPower", 0),
                start_intelligence=stats.get("intelligence", 0),
                start_luck=stats.get("luck", 0),
                start_moral=stats.get("moral", 0),
                raw_data=hero_data
            ))

        Hero.objects.bulk_create(hero_objects)
        self.stdout.write(f"  Created {len(hero_objects)} heroes (skipped {skipped_count} campaign/tutorial heroes)")

    def _import_skills(self, reader: GameDataReader, version: GameVersion):
        """Import skill data."""
        self.stdout.write("Importing skills...")

        skills_data = reader.get_all_skills()

        skill_objects = []
        for skill_data in skills_data:
            skill_objects.append(Skill(
                version=version,
                id_key=skill_data["id"],
                skill_type=skill_data.get("skillType", "Common"),
                raw_data=skill_data
            ))

        Skill.objects.bulk_create(skill_objects)
        self.stdout.write(f"  Created {len(skill_objects)} skills")

    def _import_items(self, reader: GameDataReader, version: GameVersion):
        """Import item data."""
        self.stdout.write("Importing items...")

        items_data = reader.get_all_items()

        item_objects = []
        for item_data in items_data:
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
        self.stdout.write(f"  Created {len(item_objects)} items")

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
