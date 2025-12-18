# Entity Description Pipeline Pattern

This document describes the pattern used to render dynamic descriptions for game entities (items, skills, spells, abilities). This pattern should be followed for all entity types.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ENTITY DESCRIPTION PIPELINE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. GAME DATA FILES                                                  │
│     └── Lang/args/{entity}.json → Maps SID to function names        │
│                                                                      │
│  2. TRANSPILED FUNCTIONS                                             │
│     └── static/js/generated/description_functions.js                 │
│     └── 1175+ functions from .script files                          │
│                                                                      │
│  3. BACKEND (Python)                                                 │
│     └── get_{entity}_args() → Load args from JSON                   │
│     └── API returns: description_template, description_args, raw_data│
│                                                                      │
│  4. FRONTEND (JavaScript)                                            │
│     └── format{Entity}Description(data, level) → Uses pipeline      │
│     └── DescriptionRuntime.formatDescription(template, args, ctx)   │
│                                                                      │
│  5. HERO STATE (if entity has bonuses)                               │
│     └── getEffectiveHeroStats() → Aggregate entity bonuses          │
│     └── updateAllDescriptions() → Refresh on entity change          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Args Files Available

| Entity        | Args File             | Backend Function   | Status |
|---------------|-----------------------|--------------------|--------|
| Items         | `artifacts.json`      | `get_item_args()`  | ✅ Done |
| Skills        | `heroSkills.json`     | `get_skill_args()` | ✅ Done |
| Spells        | `magic.json`          | `get_spell_args()` | Not implemented |
| Unit Abilities| `unitsAbility.json`   | -                  | Not implemented |
| Buffs         | `unitsBuff.json`      | -                  | Not implemented |
| Magic Buffs   | `magic_buff.json`     | -                  | Not implemented |

## Implementation Checklist for New Entity Types

### Backend (core/localizations.py)

1. Add loader function:
```python
@lru_cache(maxsize=1)
def get_{entity}_args(lang: str = "english") -> dict:
    """
    Load {entity} description args from game files.
    Returns a dict mapping sid -> list of function names.
    """
    args_file = settings.GAME_DATA_PATH / "StreamingAssets" / "Lang" / "args" / "{args_file}.json"

    if not args_file.exists():
        return {}

    try:
        with open(args_file, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
            tokens_args = data.get("tokensArgs", [])
            return {item["sid"]: item.get("args", []) for item in tokens_args}
    except Exception:
        return {}
```

### Backend API (hero_builder/views.py)

2. Update API endpoint to return all required fields:
```python
entity_data.append({
    'id': entity.id_key,
    'name': info['name'],
    'description': info['description'],              # Fallback
    'description_template': description_template,     # Raw template with {0}, {1}
    'description_args': description_args,             # List of function names
    'raw_data': entity.raw_data,                      # Full entity config
    # ... other fields
})
```

### Frontend (templates/hero_builder/partials/_scripts.html)

3. If entity has `heroStat` bonuses, add to `getEffectiveHeroStats()`:
```javascript
// Add bonuses from {entities}
for (const entityData of heroBuild.{entities}) {
    if (!entityData || !entityData.raw_data) continue;
    const level = entityData.level || 1;
    const levelData = entityData.raw_data.parametersPerLevel?.[level - 1];
    if (!levelData?.bonuses) continue;

    for (const bonus of levelData.bonuses) {
        if (bonus.type !== 'heroStat') continue;
        const params = bonus.parameters || [];
        if (params.length < 2) continue;

        const statName = params[0];
        const value = parseFloat(params[1]);
        if (isNaN(value)) continue;

        const statMap = {
            'viewRadius': 'viewRadius',
            'offence': 'offence',
            'defence': 'defence',
            'spellPower': 'spellPower',
            'intelligence': 'intelligence',
            'luck': 'luck',
            'moral': 'moral',
        };
        const key = statMap[statName];
        if (key) {
            stats[key] = (stats[key] || 0) + value;
        }
    }
}
```

4. Store `raw_data` when entity is equipped/assigned:
```javascript
heroBuild.{entities}[slotIndex] = {
    id: entityData.id,
    // ... other fields
    description_template: entityData.description_template,
    description_args: entityData.description_args,
    raw_data: entityData.raw_data,
};
```

5. Call `updateAllDescriptions()` when entity changes:
```javascript
// After adding/removing/leveling entity:
EquipmentManager.updateAllDescriptions();
```

6. Use (or create) format function:
```javascript
format{Entity}Description(entityData, level = 1) {
    if (!entityData.description_args || entityData.description_args.length === 0) {
        return entityData.description || entityData.description_template || '';
    }

    if (typeof DescriptionRuntime !== 'undefined' && typeof DescriptionFunctions !== 'undefined') {
        try {
            const ctx = {
                current{Entity}: {
                    id: entityData.id,
                    level: level,
                    config: entityData.raw_data || {}
                },
                currentHero: {
                    stats: this.getEffectiveHeroStats()
                }
            };

            return DescriptionRuntime.formatDescription(
                entityData.description_template,
                entityData.description_args,
                ctx
            );
        } catch (e) {
            console.warn('[EquipmentManager] {Entity} description error, falling back:', e);
        }
    }

    return entityData.description || entityData.description_template || '';
}
```

## Context Structure for Transpiled Functions

The transpiled functions expect specific context paths:

| Entity | Context Path | Example Access |
|--------|--------------|----------------|
| Items  | `ctx.currentItem` | `ctx.currentItem.config.bonuses[0].parameters[1]` |
| Skills | `ctx.currentSkill` | `ctx.currentSkill.config.bonuses[0].parameters[1]` |
| Spells | `ctx.currentMagic` | `ctx.currentMagic.config.parameters[0]` |
| Hero   | `ctx.currentHero` | `ctx.currentHero.stats.viewRadius` |

## Key Principles

1. **Consistent API Response** - All entities return same fields: `description_template`, `description_args`, `raw_data`

2. **Transpiled Functions Handle Computation** - Never compute description values manually; use the transpiled functions

3. **Hero State Integration** - If entity has `heroStat` bonuses, include in `getEffectiveHeroStats()` and call `updateAllDescriptions()` on change

4. **Fallback Chain** - Always fall back to pre-computed `description` if transpiled functions fail

## Transpiler

The transpiler converts game `.script` files to JavaScript. Run with:
```bash
make transpile
```

Output: `static/js/generated/description_functions.js`
