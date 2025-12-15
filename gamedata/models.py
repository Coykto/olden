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
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ['version', 'name']
        unique_together = [['version', 'id_key']]

    def __str__(self):
        return f"{self.name} (v{self.version.build_id})"


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

    # Raw JSON data for abilities, passives, etc.
    raw_data = models.JSONField(help_text="Complete raw unit data from game files")

    class Meta:
        ordering = ['version', 'faction', 'tier', 'id_key']
        unique_together = [['version', 'id_key']]

    def __str__(self):
        return f"{self.id_key} (T{self.tier}, v{self.version.build_id})"


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

    # Starting attributes
    cost_gold = models.IntegerField()
    start_level = models.IntegerField(default=1)
    start_offence = models.IntegerField(default=0)
    start_defence = models.IntegerField(default=0)
    start_spell_power = models.IntegerField(default=0)
    start_intelligence = models.IntegerField(default=0)
    start_luck = models.IntegerField(default=0)
    start_moral = models.IntegerField(default=0)

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
    ]

    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='skills')
    id_key = models.CharField(max_length=100, help_text="Skill identifier from game files")
    skill_type = models.CharField(max_length=20, choices=SKILL_TYPE_CHOICES)

    # Each skill has 3 levels with different bonuses
    raw_data = models.JSONField(help_text="Complete raw skill data with all levels")

    class Meta:
        ordering = ['version', 'skill_type', 'id_key']
        unique_together = [['version', 'id_key']]

    def __str__(self):
        return f"{self.id_key} (v{self.version.build_id})"


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
