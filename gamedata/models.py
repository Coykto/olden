"""
Django models for Heroes of Might and Magic: Olden Era game data.

All game data is versioned to track changes across game updates.
"""
from django.db import models
from django.utils import timezone


class GameVersion(models.Model):
    """Represents a specific version/build of the game."""
    build_id = models.CharField(max_length=50, unique=True, help_text="Steam build ID")
    game_updated_at = models.DateTimeField(help_text="When the game was last updated (from Steam)")
    imported_at = models.DateTimeField(default=timezone.now, help_text="When this data was imported")
    is_active = models.BooleanField(default=True, help_text="Use this version by default")
    notes = models.TextField(blank=True, help_text="Optional notes about this version")

    class Meta:
        ordering = ['-game_updated_at']

    def __str__(self):
        return f"Build {self.build_id} ({self.game_updated_at.strftime('%Y-%m-%d')})"


class Faction(models.Model):
    """Represents a faction/race in the game."""
    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='factions')
    id_key = models.CharField(max_length=50, help_text="Faction identifier (e.g., 'human', 'undead')")
    slug = models.SlugField(max_length=100, default="")
    name = models.CharField(max_length=100)
    description = models.TextField(default="", blank=True)
    faction_skill = models.CharField(max_length=100, default="", blank=True, help_text="Faction-specific skill ID")
    sort_order = models.IntegerField(default=0, help_text="Display order from availableFractions in data.json")

    class Meta:
        ordering = ['version', 'sort_order', 'name']
        unique_together = [['version', 'id_key'], ['version', 'slug']]

    def __str__(self):
        return f"{self.name} (v{self.version.build_id})"

    @property
    def icon_url(self):
        """Get the URL to this faction's icon."""
        return f"/media/gamedata/ui/{self.id_key}_icon.png"

    @property
    def skill_icon_url(self):
        """Get the URL to this faction's skill icon."""
        if self.faction_skill:
            return f"/media/gamedata/skills/{self.faction_skill}.png"
        return ""

    @property
    def skill_info(self):
        """Get display info for the faction skill including name and description."""
        if self.faction_skill:
            from core.localizations import get_skill_info, get_localizations, get_skill_args

            info = get_skill_info(self.faction_skill)

            # Add fields for dynamic description pipeline
            localizations = get_localizations()
            skill_args = get_skill_args()
            skill = Skill.objects.filter(id_key=self.faction_skill).first()

            if skill and skill.raw_data:
                desc_key = skill.raw_data.get('parametersPerLevel', [{}])[0].get('desc', f"{self.faction_skill}_desc")
                info['description_template'] = localizations.get(desc_key, '')
                info['description_args'] = skill_args.get(desc_key, [])
                info['raw_data'] = skill.raw_data

            return info
        return None


class Unit(models.Model):
    """Represents a unit/creature in the game."""
    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='units')
    id_key = models.CharField(max_length=100, help_text="Unit identifier from game files")
    display_name = models.CharField(max_length=200, default="", help_text="Localized display name")
    faction = models.ForeignKey(Faction, on_delete=models.CASCADE, related_name='units')
    tier = models.IntegerField()
    squad_value = models.IntegerField(help_text="AI value of the unit")
    exp_bonus = models.IntegerField(help_text="Experience gained for killing this unit")

    # Cost
    cost_gold = models.IntegerField(default=0)
    cost_wood = models.IntegerField(default=0)
    cost_ore = models.IntegerField(default=0)
    cost_gemstones = models.IntegerField(default=0)
    cost_crystals = models.IntegerField(default=0)
    cost_mercury = models.IntegerField(default=0)

    # Base stats
    hp = models.IntegerField()
    offence = models.IntegerField()
    defence = models.IntegerField()
    damage_min = models.IntegerField()
    damage_max = models.IntegerField()
    initiative = models.IntegerField()
    speed = models.IntegerField()

    # Special stats
    luck = models.IntegerField(default=0)
    moral = models.IntegerField(default=0)
    move_type = models.CharField(max_length=20, default="ground")  # ground, fly, etc.

    # Combat-related fields
    attack_type = models.CharField(
        max_length=20,
        default="melee",
        help_text="Attack type: melee, ranged, magic"
    )
    abilities = models.JSONField(
        default=list,
        blank=True,
        help_text="List of ability IDs this unit has"
    )
    damage_modifiers = models.JSONField(
        default=dict,
        blank=True,
        help_text="Damage modifiers (outDmgMods, inDmgMods, etc.)"
    )

    # Raw JSON data for abilities, passives, etc.
    raw_data = models.JSONField(help_text="Complete raw unit data from game files")

    class Meta:
        ordering = ['version', 'faction', 'tier', 'id_key']
        unique_together = [['version', 'id_key']]

    def __str__(self):
        return f"{self.id_key} (T{self.tier}, v{self.version.build_id})"

    @property
    def icon_url(self):
        """Get the URL to this unit's icon."""
        import os
        from django.conf import settings

        icon_path = f"/media/gamedata/units/{self.id_key}.png"
        full_path = os.path.join(settings.MEDIA_ROOT, 'gamedata', 'units', f'{self.id_key}.png')

        if os.path.exists(full_path):
            return icon_path
        return "/media/gamedata/ui/unit_placeholder.png"


class Hero(models.Model):
    """Represents a hero in the game."""
    CLASS_TYPE_CHOICES = [
        ('might', 'Might'),
        ('magic', 'Magic'),
    ]

    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='heroes')
    id_key = models.CharField(max_length=100, help_text="Hero identifier from game files")
    slug = models.SlugField(max_length=200, default="", help_text="URL-friendly slug from display name")
    display_name = models.CharField(max_length=200, default="", help_text="Localized display name")
    faction = models.ForeignKey(Faction, on_delete=models.CASCADE, related_name='heroes')
    icon = models.CharField(max_length=100, blank=True)
    mesh = models.CharField(max_length=100, blank=True)
    class_type = models.CharField(max_length=20, choices=CLASS_TYPE_CHOICES)

    @property
    def portrait_url(self):
        """Get the URL to this hero's portrait image."""
        if self.icon:
            return f"/media/gamedata/heroes/{self.icon}.png"
        return ""

    @property
    def portrait_large_url(self):
        """Get the URL to this hero's large portrait image."""
        if self.icon:
            return f"/media/gamedata/heroes/{self.icon}_large.png"
        return ""

    @property
    def class_icon_url(self):
        """Get the URL to this hero's generic class icon (might/magic)."""
        return f"/media/gamedata/ui/{self.class_type}_icon.png"

    # Specialization
    specialization_name = models.CharField(max_length=200, default="", blank=True)
    specialization_desc = models.TextField(default="", blank=True)

    @property
    def specialization_info(self):
        """Get specialization info with description template and args for JS rendering."""
        from core.localizations import get_hero_specialization_info
        return get_hero_specialization_info(self.id_key)

    @property
    def advanced_classes_info(self):
        """Get advanced class info for this hero's faction and class type."""
        from core.localizations import get_localizations
        localizations = get_localizations()

        # Get base class name and icon
        base_class_name_key = f"{self.class_type}_{self.faction.id_key}_name"
        base_class_name = localizations.get(base_class_name_key, self.class_type.title())
        base_class_icon_url = f"/media/gamedata/ui/{self.class_type}_icon.png"

        # Get advanced classes for this faction and class type
        advanced_classes = AdvancedClass.objects.filter(
            version=self.version,
            faction=self.faction,
            class_type=self.class_type
        )

        classes_data = []
        for adv_class in advanced_classes:
            info = adv_class.display_info
            classes_data.append({
                'id': adv_class.id_key,
                'name': info.get('name', adv_class.id_key),
                'description': info.get('description', ''),
                'description_template': info.get('description_template', ''),
                'description_args': info.get('description_args', []),
                'icon_url': adv_class.icon_url,
                'activation_conditions': adv_class.activation_conditions,
            })

        return {
            'base_class_name': base_class_name,
            'base_class_icon_url': base_class_icon_url,
            'advanced_classes': classes_data,
        }

    # Sort order (extracted from id_key number, e.g., human_hero_1 -> 1)
    sort_order = models.IntegerField(default=0)

    # Starting skills (JSON array of skill IDs)
    starting_skills = models.JSONField(default=list, blank=True)

    # Starting spells (JSON array of spell data from startMagics)
    starting_spells = models.JSONField(default=list, blank=True)

    @property
    def non_faction_skills(self):
        """Get starting skills excluding the faction-specific skill."""
        faction_skill = self.faction.faction_skill if self.faction else None
        return [s for s in self.starting_skills if s != faction_skill]

    @property
    def display_skills(self):
        """Get skills to display on hero card - non-faction skills, or faction skill if it's the only one."""
        non_faction = self.non_faction_skills
        if non_faction:
            return non_faction
        # If only faction skill, show it
        if self.starting_skills:
            return self.starting_skills
        return []

    @property
    def display_skills_info(self):
        """Get display info for skills including names and descriptions."""
        from core.localizations import get_skill_info
        return [get_skill_info(skill_id) for skill_id in self.display_skills]

    @property
    def all_starting_skills_info(self):
        """Get ALL starting skills info (including faction skill) for hero builder."""
        from core.localizations import get_skill_info
        return [get_skill_info(skill_id) for skill_id in self.starting_skills]

    @property
    def starting_skills_with_levels(self):
        """Get starting skills with their levels from raw_data for hero builder."""
        from core.localizations import get_skill_info, get_localizations, get_skill_args
        skills = []
        raw_skills = self.raw_data.get('startSkills', []) if self.raw_data else []
        
        localizations = get_localizations()
        skill_args = get_skill_args()
        
        for skill_data in raw_skills:
            skill_id = skill_data.get('sid', '')
            level = skill_data.get('skillLevel', 1)
            info = get_skill_info(skill_id, level=level)
            info['level'] = level
            # Icon suffix: level 1 = no suffix, level 2 = _2, level 3 = _3
            info['icon_suffix'] = '' if level == 1 else f'_{level}'
            # Level prefix for display: Basic (1), Advanced (2), Expert (3)
            info['level_prefix'] = {1: '', 2: 'Advanced ', 3: 'Expert '}.get(level, '')
            
            # Add description pipeline fields for dynamic descriptions
            skill_obj = Skill.objects.filter(id_key=skill_id).first()
            if skill_obj and skill_obj.raw_data:
                params = skill_obj.raw_data.get('parametersPerLevel', [])
                if len(params) >= level:
                    desc_key = params[level - 1].get('desc', f"{skill_id}_desc")
                    info['description_template'] = localizations.get(desc_key, '')
                    info['description_args'] = skill_args.get(desc_key, [])
                    info['raw_data'] = skill_obj.raw_data
            
            skills.append(info)
        return skills

    @property
    def starting_spells_info(self):
        """Get starting spells with full info for the hero builder spellbook."""
        from core.localizations import get_spell_info, get_spell_descriptions_by_level
        spells = []

        # Build spell replacement mapping from specialization bonuses
        # heroMagicReplace bonuses have parameters: [base_spell_id, special_spell_id]
        spell_replacements = {}
        spec_info = self.specialization_info
        for bonus in spec_info.get('raw_data', {}).get('bonuses', []):
            if bonus.get('type') == 'heroMagicReplace':
                params = bonus.get('parameters', [])
                if len(params) >= 2:
                    spell_replacements[params[0]] = params[1]

        # Get spell data from raw_data.startMagics or from the starting_spells field
        raw_spells = self.raw_data.get('startMagics', []) if self.raw_data else []
        if not raw_spells:
            raw_spells = self.starting_spells or []

        for spell_data in raw_spells:
            # Handle both formats: from raw_data (dict with sidConfig) or from starting_spells field
            if isinstance(spell_data, dict):
                spell_id = spell_data.get('sidConfig', '')
                level = spell_data.get('level', 1)
            else:
                spell_id = spell_data
                level = 1

            if not spell_id:
                continue

            # Check if this spell should be replaced with a Masterful variant
            actual_spell_id = spell_replacements.get(spell_id, spell_id)

            # Get spell from database for full info
            spell_obj = Spell.objects.filter(id_key=actual_spell_id).first()
            if not spell_obj:
                # Fallback to original spell_id if special not found
                spell_obj = Spell.objects.filter(id_key=spell_id).first()
                if not spell_obj:
                    continue
                actual_spell_id = spell_id

            raw = spell_obj.raw_data or {}
            spell_info = get_spell_info(actual_spell_id)

            # Check if this is a masterful (special) variant
            is_special = actual_spell_id.endswith('_special')

            # Extract school from spell_id (e.g., 'day_17_magic_clear_view' -> 'day')
            school = spell_obj.school or actual_spell_id.split('_')[0]

            # Get spell type
            spell_type = 'global' if raw.get('usedOnMap') else 'combat'

            # Get descriptions by level
            description_keys = raw.get('description', [])
            descriptions_by_level = get_spell_descriptions_by_level(description_keys)

            # Get max upgrade level
            upgrade_cost = raw.get('upgradeCost', [])
            mana_cost = raw.get('manaCost', [])
            max_upgrade_level = (len(upgrade_cost) + 1) if upgrade_cost else (len(mana_cost) if mana_cost else 1)

            # Get rank/tier
            rank = raw.get('rank', spell_obj.level)

            # For special spells, get the base spell name and add "Masterful" prefix
            if is_special:
                base_spell_info = get_spell_info(spell_id)  # Get name from base spell
                spell_name = f"Masterful {base_spell_info['name']}"
            else:
                spell_name = spell_info['name']

            spells.append({
                'id': actual_spell_id,
                'id_key': actual_spell_id,
                'name': spell_name,
                'icon': raw.get('icon', actual_spell_id.replace('_special', '')),  # Use base icon
                'school': school,
                'school_display': school.title() + ' Magic',
                'level': rank,  # tier
                'upgrade_level': level,  # starting upgrade level
                'spell_type': spell_type,
                'max_upgrade_level': max_upgrade_level,
                'raw_data': raw,
                'descriptions': descriptions_by_level,
                'description_template': spell_info['description_template'],
                'description_args': spell_info['description_args'],
                'is_masterful': is_special,
            })

        return spells

    @property
    def hero_card_skill(self):
        """Get the skill to display on hero card - specialty faction skill OR first non-faction skill."""
        from core.localizations import get_skill_info, get_localizations, get_skill_args
        faction_skill_id = self.faction.faction_skill if self.faction else None
        raw_skills = self.raw_data.get('startSkills', []) if self.raw_data else []

        def add_description_fields(info, skill_id, level):
            """Add description pipeline fields to skill info."""
            localizations = get_localizations()
            skill_args = get_skill_args()
            skill_obj = Skill.objects.filter(id_key=skill_id).first()

            if skill_obj and skill_obj.raw_data:
                params = skill_obj.raw_data.get('parametersPerLevel', [])
                if len(params) >= level:
                    desc_key = params[level - 1].get('desc', f"{skill_id}_desc")
                    info['description_template'] = localizations.get(desc_key, '')
                    info['description_args'] = skill_args.get(desc_key, [])
                    info['raw_data'] = skill_obj.raw_data

            return info

        # First check if faction skill is a specialty (level 2+)
        for skill_data in raw_skills:
            skill_id = skill_data.get('sid', '')
            level = skill_data.get('skillLevel', 1)
            if skill_id == faction_skill_id and level >= 2:
                info = get_skill_info(skill_id, level=level)
                info['level'] = level
                info['icon_suffix'] = f'_{level}'
                info['level_prefix'] = {2: 'Advanced ', 3: 'Expert '}.get(level, '')
                return add_description_fields(info, skill_id, level)

        # Otherwise, return first non-faction skill
        for skill_data in raw_skills:
            skill_id = skill_data.get('sid', '')
            level = skill_data.get('skillLevel', 1)
            if skill_id != faction_skill_id:
                info = get_skill_info(skill_id, level=level)
                info['level'] = level
                info['icon_suffix'] = '' if level == 1 else f'_{level}'
                info['level_prefix'] = {1: '', 2: 'Advanced ', 3: 'Expert '}.get(level, '')
                return add_description_fields(info, skill_id, level)

        return None

    # Starting attributes
    cost_gold = models.IntegerField()
    start_level = models.IntegerField(default=1)
    start_offence = models.IntegerField(default=0)
    start_defence = models.IntegerField(default=0)
    start_spell_power = models.IntegerField(default=0)
    start_intelligence = models.IntegerField(default=0)
    start_luck = models.IntegerField(default=0)
    start_moral = models.IntegerField(default=0)
    start_view_radius = models.IntegerField(default=6, help_text="Hero's sight radius on the map")

    # Raw JSON data for specialization, starting squad, etc.
    raw_data = models.JSONField(help_text="Complete raw hero data from game files")

    class Meta:
        ordering = ['version', 'faction', 'id_key']
        unique_together = [['version', 'id_key'], ['version', 'slug']]
        verbose_name_plural = 'Heroes'

    def __str__(self):
        return f"{self.id_key} (v{self.version.build_id})"


class Skill(models.Model):
    """Represents a hero skill in the game."""
    SKILL_TYPE_CHOICES = [
        ('Common', 'Common'),
        ('Rare', 'Rare'),
        ('Faction', 'Faction'),
        ('Class', 'Class'),
    ]

    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='skills')
    id_key = models.CharField(max_length=100, help_text="Skill identifier from game files")
    skill_type = models.CharField(max_length=20, choices=SKILL_TYPE_CHOICES)

    # Each skill has 3 levels with different bonuses
    raw_data = models.JSONField(help_text="Complete raw skill data with all levels")

    # Pre-extracted parameter values for each level
    # Format: {1: [value1, value2], 2: [value1, value2], 3: [value1, value2]}
    extracted_values = models.JSONField(
        default=dict,
        blank=True,
        help_text="Pre-extracted parameter values keyed by level"
    )

    class Meta:
        ordering = ['version', 'skill_type', 'id_key']
        unique_together = [['version', 'id_key']]

    def __str__(self):
        return f"{self.id_key} (v{self.version.build_id})"

    def get_values(self, level: int = 1) -> list:
        """Get extracted parameter values for a specific level."""
        return self.extracted_values.get(str(level), [])


class Item(models.Model):
    """Represents an equipment item/artifact in the game."""
    SLOT_CHOICES = [
        ('left_hand', 'Left Hand'),
        ('right_hand', 'Right Hand'),
        ('armor', 'Armor'),
        ('head', 'Head'),
        ('boots', 'Boots'),
        ('back', 'Back/Cloak'),
        ('belt', 'Belt'),
        ('ring', 'Ring'),
        ('item_slot', 'Item Slot'),
        ('unic_slot', 'Unique Slot'),
    ]

    RARITY_CHOICES = [
        ('common', 'Common'),
        ('uncommon', 'Uncommon'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]

    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='items')
    id_key = models.CharField(max_length=100, help_text="Item identifier from game files")
    slot = models.CharField(max_length=20, choices=SLOT_CHOICES)
    rarity = models.CharField(max_length=20, choices=RARITY_CHOICES)
    icon = models.CharField(max_length=100, blank=True)

    goods_value = models.IntegerField(default=0)
    cost_base = models.IntegerField(default=0)
    cost_per_level = models.IntegerField(default=0)
    max_level = models.IntegerField(default=1)

    item_set = models.CharField(max_length=100, blank=True, help_text="Item set this belongs to")

    # Raw JSON data for bonuses, upgrade info, etc.
    raw_data = models.JSONField(help_text="Complete raw item data from game files")

    class Meta:
        ordering = ['version', 'slot', 'rarity', 'id_key']
        unique_together = [['version', 'id_key']]

    def __str__(self):
        return f"{self.id_key} ({self.slot}, v{self.version.build_id})"


class ItemSet(models.Model):
    """Represents an item set (collection of items with set bonuses)."""
    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='item_sets')
    id_key = models.CharField(max_length=100, help_text="Set identifier from game files")

    # Raw JSON data containing items list and bonuses
    raw_data = models.JSONField(help_text="Complete raw set data from game files")

    class Meta:
        ordering = ['version', 'id_key']
        unique_together = [['version', 'id_key']]

    def __str__(self):
        return f"{self.id_key} (v{self.version.build_id})"


class MagicSchool(models.Model):
    """Stores localized names for magic schools."""
    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='magic_schools')
    id_key = models.CharField(max_length=20)  # day, night, space, primal, neutral
    display_name = models.CharField(max_length=100)  # Daylight Magic, etc.

    class Meta:
        unique_together = [['version', 'id_key']]

    def __str__(self):
        return f"{self.display_name} ({self.id_key})"


class Spell(models.Model):
    """Represents a magic spell in the game."""
    SCHOOL_CHOICES = [
        ('day', 'Day Magic'),
        ('night', 'Night Magic'),
        ('space', 'Space Magic'),
        ('primal', 'Primal Magic'),
        ('neutral', 'Neutral Magic'),
    ]

    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='spells')
    id_key = models.CharField(max_length=100, help_text="Spell identifier from game files")
    school = models.CharField(max_length=20, choices=SCHOOL_CHOICES, blank=True)
    level = models.IntegerField(default=1)

    # Raw JSON data for spell effects, costs, etc.
    raw_data = models.JSONField(help_text="Complete raw spell data from game files")

    class Meta:
        ordering = ['version', 'school', 'level', 'id_key']
        unique_together = [['version', 'id_key']]

    def __str__(self):
        return f"{self.id_key} ({self.school} L{self.level}, v{self.version.build_id})"


class UnitAbility(models.Model):
    """Represents a unit's combat ability (passive or active)."""
    ABILITY_TYPE_CHOICES = [
        ('passive', 'Passive'),
        ('active', 'Active'),
        ('triggered', 'Triggered'),
    ]

    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='unit_abilities')
    id_key = models.CharField(max_length=100, help_text="Ability identifier from game files")
    ability_type = models.CharField(max_length=20, choices=ABILITY_TYPE_CHOICES, default='passive')

    # Raw JSON data for ability effects
    raw_data = models.JSONField(help_text="Complete raw ability data from game files")

    # Pre-computed effects for quick access during calculations
    extracted_effects = models.JSONField(
        default=dict,
        blank=True,
        help_text="Pre-extracted combat effects (damage mods, stat bonuses, etc.)"
    )

    class Meta:
        ordering = ['version', 'ability_type', 'id_key']
        unique_together = [['version', 'id_key']]
        verbose_name_plural = 'Unit abilities'

    def __str__(self):
        return f"{self.id_key} ({self.ability_type}, v{self.version.build_id})"


class CombatModifier(models.Model):
    """
    Stores extracted combat modifiers for quick lookup during damage calculations.

    Sources can be skills, unit abilities, spells, or items.
    """
    SOURCE_TYPE_CHOICES = [
        ('skill', 'Hero Skill'),
        ('ability', 'Unit Ability'),
        ('spell', 'Spell'),
        ('item', 'Item'),
        ('specialization', 'Hero Specialization'),
    ]

    MODIFIER_TYPE_CHOICES = [
        ('outDmgMod', 'Outgoing Damage Modifier'),
        ('inDmgMod', 'Incoming Damage Modifier'),
        ('outAllDmgMod', 'Global Outgoing Damage'),
        ('inAllDmgMod', 'Global Incoming Damage'),
        ('offence', 'Offence Bonus'),
        ('defence', 'Defence Bonus'),
        ('offencePerc', 'Offence Percentage'),
        ('defencePerc', 'Defence Percentage'),
        ('damageMin', 'Minimum Damage'),
        ('damageMax', 'Maximum Damage'),
        ('crit', 'Critical Chance'),
        ('critDmg', 'Critical Damage'),
    ]

    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='combat_modifiers')
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPE_CHOICES)
    source_id = models.CharField(max_length=100, help_text="ID of the source (skill_id, ability_id, etc.)")
    modifier_type = models.CharField(max_length=50, choices=MODIFIER_TYPE_CHOICES)
    value = models.FloatField(help_text="Modifier value (percentage as decimal, e.g., 0.10 for 10%)")
    level = models.IntegerField(default=1, help_text="Level at which this modifier applies")

    # Optional conditions for when this modifier applies
    conditions = models.JSONField(
        default=dict,
        blank=True,
        help_text="Conditions for modifier (target_tags, damage_type, etc.)"
    )

    class Meta:
        ordering = ['version', 'source_type', 'source_id', 'level']
        indexes = [
            models.Index(fields=['version', 'source_type', 'source_id']),
            models.Index(fields=['version', 'modifier_type']),
        ]

    def __str__(self):
        return f"{self.source_id} L{self.level}: {self.modifier_type} = {self.value}"


class AdvancedClass(models.Model):
    """Represents an advanced class (subclass) for heroes."""

    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='advanced_classes')
    id_key = models.CharField(max_length=100, help_text="Advanced class identifier")

    faction = models.ForeignKey(Faction, on_delete=models.CASCADE, related_name='advanced_classes')
    class_type = models.CharField(max_length=20, choices=Hero.CLASS_TYPE_CHOICES)

    icon = models.CharField(max_length=100, blank=True)

    activation_conditions = models.JSONField(default=list, help_text="Requirements to unlock")
    required_skill_ids = models.JSONField(default=list, help_text="Pre-extracted skill IDs for quick lookups")
    bonuses = models.JSONField(default=list, help_text="Bonus effects")
    raw_data = models.JSONField(help_text="Complete raw data from game files")

    class Meta:
        ordering = ['version', 'faction', 'class_type', 'id_key']
        unique_together = [['version', 'id_key']]
        verbose_name_plural = 'Advanced Classes'
        indexes = [models.Index(fields=['version', 'faction', 'class_type'])]

    def __str__(self):
        return f"{self.id_key} (v{self.version.build_id})"

    @property
    def icon_url(self):
        if self.icon:
            return f"/media/gamedata/advanced_classes/{self.icon}.png"
        return ""

    @property
    def display_info(self):
        from core.localizations import get_advanced_class_info
        return get_advanced_class_info(self.id_key)
