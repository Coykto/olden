# Combat Calculator Implementation Plan

## Reference Design
See `/Users/eb/PycharmProjects/olden/design_examples/calc_example.PNG` - Heroes 3 damage calculator

## Features Required

### Two-Sided Combat View
- **Left Hero Panel**: Hero portrait, stats (Attack/Defense), level, skills
- **Right Hero Panel**: Same structure for opposing hero
- **Unit Selection**: Pick attacking and defending unit stacks

### Hero Configuration
- Attack stat (base + modifiers)
- Defense stat (base + modifiers)  
- Hero level (affects specialization scaling)
- Skills with levels (None/Basic/Advanced/Expert)
- Specialization bonuses

### Army Configuration
- Unit stack selection (unit type + count)
- Multi-faction detection (morale penalty)
- Neutral army support (no hero)

### Damage Calculation Display
- **ATTACK Section**: Damage range, Average, Kills
- **RETALIATION Section**: Same metrics for counter-attack
- Show modified stats: Attack 10 (15) = base (with modifiers)

### Combat Modifiers
- Spell buffs: Bless, Bloodlust, Shield, Prayer, etc.
- Debuffs: Curse, Weakness, Blind, etc.
- Situational: Range penalty, Obstacle penalty, Melee strike, Ranged retaliation

## Data Extraction Needed

### Unit Data (from /tmp/DB/units/)
- Base stats: hp, offence, defence, damageMin, damageMax, initiative, speed
- Attack type: melee, ranged (shootRange, shootThreshold)
- Damage modifiers: outDmgMods, inDmgMods
- Abilities and passives

### Hero Data (from /tmp/DB/heroes/)
- Base stats: offence, defence, spellPower, intelligence
- Stat rolls for leveling
- Starting skills

### Skill Effects (from /tmp/DB/heroes_skills/)
- Assault: +10/15/20% outgoing damage
- Protection: -10/15/20% incoming damage
- Leadership: morale bonuses
- etc.

### Specialization Bonuses (from /tmp/DB/heroes_specializations/)
- heroOffenceModifier, heroDefenceModifier
- Unit-specific bonuses (e.g., +1 offence per 3 hero levels)

### Buff Effects (from /tmp/DB/buffs/)
- Stat modifiers: offence, defence, speed, initiative
- Damage modifiers: outAllDmgMod, inAllDmgMod
- Type-specific: outDmgMods.list[{t: "normal_damage", v: 0.15}]

## Damage Formula (approximate)

```
Base Damage = random(damageMin, damageMax) * stack_count
Offense Bonus = (attacker_offence - defender_defence) * 0.05
Damage Modifiers = sum(outDmgMods) - sum(inDmgMods)
Final Damage = Base Damage * (1 + Offense Bonus) * (1 + Damage Modifiers)
Kills = Final Damage / defender_hp
```

## Database Models Needed

### Already Exists
- Unit (with attack_type, abilities, damage_modifiers fields added)
- Hero (with stats)
- Skill (with extracted_values)

### May Need
- UnitAbility - detailed ability definitions
- CombatModifier - buff/debuff effects
- Spell - combat spell effects

## UI Components

1. HeroPanel - configurable hero with stats/skills
2. ArmyBuilder - unit stack selection
3. UnitSelector - dropdown/modal for unit selection  
4. DamageDisplay - calculated damage output
5. ModifierToggles - buff/debuff checkboxes
