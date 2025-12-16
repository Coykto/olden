"""
Damage calculation engine for Heroes of Might and Magic: Olden Era.

This module implements the game's damage formula based on reverse-engineering
the game mechanics from decompiled code and game data analysis.
"""
from dataclasses import dataclass, field
from typing import Optional

from core.combat_types import (
    UnitStack, HeroBuild, DamageResult, ExpectedDamageResult,
    ModifierBreakdown, ArmyMorale, HeroStats, UnitStats
)


# Morale trigger chances by morale value
# From game code: moralDistribution = [0.05, 0.10, 0.15, 0.20, 0.25]
# Indexes map to morale values [-2, -1, 0, +1, +2] adjusted to [0..4]
MORALE_TRIGGER_CHANCE = {
    -2: 0.25,  # 25% bad morale (skip turn)
    -1: 0.20,
    0: 0.0,    # No trigger at neutral
    1: 0.20,   # 20% good morale (extra turn)
    2: 0.25,
    3: 0.30,   # Extrapolated for high morale
}

# Luck trigger chances (same distribution pattern)
LUCK_TRIGGER_CHANCE = {
    -2: 0.25,  # 25% bad luck (min damage)
    -1: 0.20,
    0: 0.0,
    1: 0.20,   # 20% good luck (max damage)
    2: 0.25,
    3: 0.30,
}

# Stat difference scaling factor (5% per point)
STAT_DIFF_FACTOR = 0.05


class DamageCalculator:
    """
    Calculates combat damage between unit stacks.

    The damage formula (reverse-engineered from game code):
    1. Base damage = random(damageMin, damageMax) * unit_count
    2. Stat modifier = 0.05 * (attacker_offence - defender_defence)
    3. If stat_modifier > 0: damage *= (1 + stat_modifier)
    4. If stat_modifier < 0: damage /= (1 - stat_modifier)
    5. Apply outDmgMods (attacker's damage bonuses)
    6. Apply inDmgMods (defender's damage reductions)
    7. Apply skill bonuses (%, additive)
    8. Apply morale/luck if triggered
    """

    def __init__(self):
        self._modifier_log = []

    def calculate_damage(
        self,
        attacker: UnitStack,
        defender: UnitStack,
        attacker_hero: Optional[HeroBuild] = None,
        defender_hero: Optional[HeroBuild] = None,
        attacker_morale: Optional[ArmyMorale] = None,
    ) -> DamageResult:
        """
        Calculate damage from attacker to defender.

        Args:
            attacker: The attacking unit stack
            defender: The defending unit stack
            attacker_hero: Optional hero providing bonuses to attacker
            defender_hero: Optional hero providing bonuses to defender
            attacker_morale: Optional army morale for attacker

        Returns:
            DamageResult with min, max, avg damage and kills
        """
        self._modifier_log = []

        # Get effective stats
        atk_stats = self._get_effective_stats(attacker, attacker_hero)
        def_stats = self._get_effective_stats(defender, defender_hero)

        # Calculate base damage range
        base_min = attacker.stats.damage_min * attacker.count
        base_max = attacker.stats.damage_max * attacker.count

        self._log_modifier("Base Damage", "base", "damage", f"{base_min}-{base_max}")

        # Apply stat difference modifier
        stat_diff = atk_stats.offence - def_stats.defence
        stat_modifier = stat_diff * STAT_DIFF_FACTOR

        if stat_diff != 0:
            self._log_modifier(
                f"Offence vs Defence ({atk_stats.offence} vs {def_stats.defence})",
                "stat", "multiplier", stat_modifier
            )

        if stat_modifier > 0:
            # Bonus damage
            multiplier = 1 + stat_modifier
        elif stat_modifier < 0:
            # Reduced damage (diminishing returns)
            multiplier = 1 / (1 - stat_modifier)
        else:
            multiplier = 1.0

        dmg_min = base_min * multiplier
        dmg_max = base_max * multiplier

        # Apply hero damage bonuses
        if attacker_hero:
            hero_dmg_bonus = attacker_hero.computed_stats.damage_perc
            if hero_dmg_bonus:
                self._log_modifier(
                    f"Hero Damage Bonus",
                    "hero", "damagePerc", hero_dmg_bonus
                )
                dmg_min *= (1 + hero_dmg_bonus)
                dmg_max *= (1 + hero_dmg_bonus)

        # Apply attacker's outDmgMods
        out_mods = attacker.damage_modifiers.get('outDmgMods', [])
        for mod in out_mods:
            mod_type = mod.get('type', '')
            mod_value = mod.get('value', 0)
            if mod_value:
                self._log_modifier(
                    f"Out Damage Mod ({mod_type})",
                    "ability", "outDmgMod", mod_value
                )
                dmg_min *= (1 + mod_value)
                dmg_max *= (1 + mod_value)

        # Apply global outAllDmgMod
        out_all = attacker.damage_modifiers.get('outAllDmgMod', 0)
        if out_all:
            self._log_modifier("Global Out Damage Mod", "ability", "outAllDmgMod", out_all)
            dmg_min *= (1 + out_all)
            dmg_max *= (1 + out_all)

        # Apply defender's inDmgMods (damage reduction)
        in_mods = defender.damage_modifiers.get('inDmgMods', [])
        for mod in in_mods:
            mod_type = mod.get('type', '')
            mod_value = mod.get('value', 0)
            if mod_value:
                self._log_modifier(
                    f"In Damage Mod ({mod_type})",
                    "ability", "inDmgMod", mod_value
                )
                # inDmgMods are reductions (positive value = less damage taken)
                dmg_min *= (1 - mod_value)
                dmg_max *= (1 - mod_value)

        # Apply global inAllDmgMod
        in_all = defender.damage_modifiers.get('inAllDmgMod', 0)
        if in_all:
            self._log_modifier("Global In Damage Mod", "ability", "inAllDmgMod", in_all)
            dmg_min *= (1 - in_all)
            dmg_max *= (1 - in_all)

        # Ensure minimum damage of 1
        dmg_min = max(1, int(dmg_min))
        dmg_max = max(1, int(dmg_max))
        dmg_avg = (dmg_min + dmg_max) // 2

        # Calculate kills
        defender_hp = defender.stats.hp
        kills_min = dmg_min // defender_hp
        kills_max = dmg_max // defender_hp
        kills_avg = dmg_avg // defender_hp

        # Cap kills at defender count
        kills_min = min(kills_min, defender.count)
        kills_max = min(kills_max, defender.count)
        kills_avg = min(kills_avg, defender.count)

        return DamageResult(
            min_damage=dmg_min,
            max_damage=dmg_max,
            avg_damage=dmg_avg,
            kills_min=kills_min,
            kills_max=kills_max,
            kills_avg=kills_avg,
            modifiers_applied=self._modifier_log.copy()
        )

    def calculate_expected_damage(
        self,
        attacker: UnitStack,
        defender: UnitStack,
        attacker_hero: Optional[HeroBuild] = None,
        defender_hero: Optional[HeroBuild] = None,
        attacker_morale: Optional[ArmyMorale] = None,
    ) -> ExpectedDamageResult:
        """
        Calculate expected damage including luck/morale probabilities.

        Returns extended result with probability-weighted expectations.
        """
        base_result = self.calculate_damage(
            attacker, defender, attacker_hero, defender_hero, attacker_morale
        )

        # Get effective luck and morale
        atk_stats = self._get_effective_stats(attacker, attacker_hero)
        effective_luck = atk_stats.luck
        effective_morale = atk_stats.moral

        if attacker_morale:
            effective_morale += attacker_morale.morale_penalty

        # Clamp to valid range
        effective_luck = max(-2, min(3, effective_luck))
        effective_morale = max(-2, min(3, effective_morale))

        luck_chance = LUCK_TRIGGER_CHANCE.get(effective_luck, 0)
        morale_chance = MORALE_TRIGGER_CHANCE.get(effective_morale, 0)

        # Calculate damage with luck (max damage)
        damage_with_luck = None
        if luck_chance > 0 and effective_luck > 0:
            # Good luck = always max damage
            damage_with_luck = DamageResult(
                min_damage=base_result.max_damage,
                max_damage=base_result.max_damage,
                avg_damage=base_result.max_damage,
                kills_min=base_result.kills_max,
                kills_max=base_result.kills_max,
                kills_avg=base_result.kills_max,
                modifiers_applied=base_result.modifiers_applied + [
                    ModifierBreakdown(
                        source="Luck",
                        source_type="stat",
                        modifier_type="luck",
                        value=effective_luck,
                        description=f"Good luck ({int(luck_chance * 100)}% chance)"
                    )
                ]
            )

        # Calculate expected average considering probabilities
        expected_avg = base_result.avg_damage
        expected_kills = base_result.kills_avg

        if damage_with_luck and luck_chance > 0:
            # Weight by luck probability
            expected_avg = (
                base_result.avg_damage * (1 - luck_chance) +
                damage_with_luck.avg_damage * luck_chance
            )
            expected_kills = (
                base_result.kills_avg * (1 - luck_chance) +
                damage_with_luck.kills_avg * luck_chance
            )

        return ExpectedDamageResult(
            base_result=base_result,
            luck_trigger_chance=luck_chance if effective_luck > 0 else 0,
            damage_with_luck=damage_with_luck,
            morale_trigger_chance=morale_chance if effective_morale > 0 else 0,
            expected_avg_damage=expected_avg,
            expected_avg_kills=expected_kills
        )

    def _get_effective_stats(
        self,
        stack: UnitStack,
        hero: Optional[HeroBuild]
    ) -> UnitStats:
        """Get effective unit stats including hero bonuses."""
        stats = UnitStats(
            hp=stack.stats.hp,
            offence=stack.stats.offence,
            defence=stack.stats.defence,
            damage_min=stack.stats.damage_min,
            damage_max=stack.stats.damage_max,
            initiative=stack.stats.initiative,
            speed=stack.stats.speed,
            luck=stack.stats.luck,
            moral=stack.stats.moral,
            attack_type=stack.stats.attack_type,
            out_all_dmg_mod=stack.stats.out_all_dmg_mod,
            in_all_dmg_mod=stack.stats.in_all_dmg_mod,
        )

        if hero:
            # Add hero stats to unit
            stats.offence += hero.computed_stats.offence
            stats.defence += hero.computed_stats.defence
            stats.luck += hero.computed_stats.luck
            stats.moral += hero.computed_stats.moral

            # Apply percentage bonuses
            if hero.computed_stats.offence_perc:
                stats.offence = int(stats.offence * (1 + hero.computed_stats.offence_perc))
            if hero.computed_stats.defence_perc:
                stats.defence = int(stats.defence * (1 + hero.computed_stats.defence_perc))

        return stats

    def _log_modifier(self, source: str, source_type: str, mod_type: str, value):
        """Log a modifier that was applied."""
        self._modifier_log.append(ModifierBreakdown(
            source=source,
            source_type=source_type,
            modifier_type=mod_type,
            value=value if isinstance(value, (int, float)) else 0,
            description=str(value) if not isinstance(value, (int, float)) else ""
        ))

    def calculate_army_morale(self, faction_ids: list, base_morale: int = 0) -> ArmyMorale:
        """
        Calculate army morale based on faction composition.

        Multi-faction armies suffer morale penalties.
        """
        unique_factions = set(faction_ids)
        faction_count = len(unique_factions)

        # -1 morale per additional faction beyond the first
        morale_penalty = -(faction_count - 1) if faction_count > 1 else 0

        effective_morale = base_morale + morale_penalty

        return ArmyMorale(
            faction_ids=list(unique_factions),
            faction_count=faction_count,
            morale_penalty=morale_penalty,
            base_morale=base_morale,
            effective_morale=effective_morale
        )


def create_unit_stack_from_db(unit, count: int) -> UnitStack:
    """
    Create a UnitStack from a Django Unit model instance.

    Args:
        unit: Unit model instance
        count: Number of units in stack

    Returns:
        UnitStack for calculations
    """
    stats = UnitStats(
        hp=unit.hp,
        offence=unit.offence,
        defence=unit.defence,
        damage_min=unit.damage_min,
        damage_max=unit.damage_max,
        initiative=unit.initiative,
        speed=unit.speed,
        luck=unit.luck,
        moral=unit.moral,
        attack_type=unit.attack_type,
        out_all_dmg_mod=unit.damage_modifiers.get('outAllDmgMod', 0),
        in_all_dmg_mod=unit.damage_modifiers.get('inAllDmgMod', 0),
    )

    return UnitStack(
        unit_id=unit.id_key,
        unit_name=unit.display_name,
        count=count,
        stats=stats,
        faction_id=unit.faction.id_key if unit.faction else "",
        abilities=unit.abilities,
        damage_modifiers=unit.damage_modifiers
    )


def create_hero_build_from_db(hero, level: int, skills: list = None) -> HeroBuild:
    """
    Create a HeroBuild from a Django Hero model instance.

    Args:
        hero: Hero model instance
        level: Hero level
        skills: List of (skill_id, skill_level) tuples

    Returns:
        HeroBuild for calculations
    """
    base_stats = HeroStats(
        offence=hero.start_offence,
        defence=hero.start_defence,
        spell_power=hero.start_spell_power,
        intelligence=hero.start_intelligence,
        luck=hero.start_luck,
        moral=hero.start_moral,
    )

    # Compute stats based on level and skills
    computed_stats = HeroStats(
        offence=base_stats.offence,
        defence=base_stats.defence,
        spell_power=base_stats.spell_power,
        intelligence=base_stats.intelligence,
        luck=base_stats.luck,
        moral=base_stats.moral,
    )

    # TODO: Apply skill bonuses based on skill data
    # This would involve looking up each skill and applying its effects

    return HeroBuild(
        hero_id=hero.id_key,
        hero_name=hero.display_name,
        level=level,
        base_stats=base_stats,
        computed_stats=computed_stats,
        skills=skills or [],
    )
