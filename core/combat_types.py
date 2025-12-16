"""
Data types for combat damage calculations.

These classes represent the inputs and outputs of the damage calculation engine.
"""
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class HeroStats:
    """Computed hero stats including skill bonuses."""
    offence: int = 0
    defence: int = 0
    spell_power: int = 0
    intelligence: int = 0
    luck: int = 0
    moral: int = 0

    # Percentage modifiers from skills
    offence_perc: float = 0.0
    defence_perc: float = 0.0
    damage_perc: float = 0.0  # Global damage bonus


@dataclass
class UnitStats:
    """Unit stats for combat calculations."""
    hp: int = 1
    offence: int = 0
    defence: int = 0
    damage_min: int = 1
    damage_max: int = 1
    initiative: int = 0
    speed: int = 1
    luck: int = 0
    moral: int = 0
    attack_type: str = "melee"  # melee, ranged, magic

    # Damage modifiers
    out_all_dmg_mod: float = 0.0
    in_all_dmg_mod: float = 0.0
    crit_chance: float = 0.0
    crit_damage: float = 1.5


@dataclass
class UnitStack:
    """A stack of units in combat."""
    unit_id: str
    unit_name: str
    count: int
    stats: UnitStats
    faction_id: str = ""
    abilities: list = field(default_factory=list)
    damage_modifiers: dict = field(default_factory=dict)


@dataclass
class HeroBuild:
    """A hero configuration for combat calculations."""
    hero_id: str
    hero_name: str
    level: int
    base_stats: HeroStats
    computed_stats: HeroStats  # After skill bonuses
    skills: list = field(default_factory=list)  # List of (skill_id, level) tuples
    specialization_bonuses: dict = field(default_factory=dict)


@dataclass
class ArmyMorale:
    """Morale calculation for a multi-faction army."""
    faction_ids: list = field(default_factory=list)
    faction_count: int = 1
    morale_penalty: int = 0  # -1 per additional faction
    base_morale: int = 0
    effective_morale: int = 0


@dataclass
class ModifierBreakdown:
    """Details about a modifier applied to damage."""
    source: str  # skill name, ability name, etc.
    source_type: str  # skill, ability, spell, item
    modifier_type: str  # outDmgMod, offence, etc.
    value: float
    description: str = ""


@dataclass
class DamageResult:
    """Result of a damage calculation."""
    min_damage: int
    max_damage: int
    avg_damage: int
    kills_min: int
    kills_max: int
    kills_avg: int
    overkill_min: int = 0
    overkill_max: int = 0
    overkill_avg: int = 0
    modifiers_applied: list = field(default_factory=list)  # List of ModifierBreakdown


@dataclass
class ExpectedDamageResult:
    """Extended damage result with probability distributions."""
    base_result: DamageResult  # Without luck/morale triggers

    # With positive morale trigger (extra turn chance)
    morale_trigger_chance: float = 0.0
    damage_with_morale: Optional[DamageResult] = None

    # With luck trigger (max damage)
    luck_trigger_chance: float = 0.0
    damage_with_luck: Optional[DamageResult] = None

    # With crit trigger
    crit_trigger_chance: float = 0.0
    damage_with_crit: Optional[DamageResult] = None

    # Weighted average considering all probabilities
    expected_avg_damage: float = 0.0
    expected_avg_kills: float = 0.0


@dataclass
class CombatScenario:
    """Full combat scenario for calculation."""
    attacker_stack: UnitStack
    defender_stack: UnitStack
    attacker_hero: Optional[HeroBuild] = None
    defender_hero: Optional[HeroBuild] = None
    attacker_army_morale: Optional[ArmyMorale] = None
    defender_army_morale: Optional[ArmyMorale] = None
    is_ranged_attack: bool = False
    is_counter_attack: bool = False
    terrain_bonus: float = 0.0  # For native terrain bonuses
