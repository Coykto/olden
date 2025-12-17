# Item Description System

## Summary
The game uses a multi-layer system to resolve description placeholders ({0}, {1}). Olden Forge implements this with a **Node.js transpiler** that converts game script files to JavaScript at import time.

## Architecture

### Game Data Files
- `Lang/english/texts/artifacts.json` - Localized text templates with placeholders
- `Lang/args/artifacts.json` - Maps SIDs to resolver function names
- `Core.zip/DB/info/` - 42 `.script` files with function definitions

### Olden Forge Implementation
- `/transpiler/` - Node.js TypeScript transpiler
- `/static/js/description-runtime.js` - Runtime support (memoization, formatters)
- `/static/js/hero-state.js` - Hero state model
- `/static/js/generated/description_functions.js` - 1175 transpiled functions
- `/static/js/generated/game_data.js` - Buff/ability lookup tables (478 buffs, 21 abilities)

## Documentation
Full documentation: `/docs/item-description-system.md`

## Quick Reference

### Common Functions
- `current_item_param_1` → `bonuses[0].parameters[1]` with upgrade calculation
- `current_item_param_N_percent` → Same, formatted as percent
- Hero-dependent values use `CurrentHero()` to access hero stats like `viewRadius`
- Fallback syntax: `function_name|fallback_function`

### Transpiler Operations
- Context: `CurrentItem`, `CurrentHero`, `CurrentBuff`, `CurrentAbility`, etc.
- Database: `DbBuff`, `DbAbility`, `DbObstacle`, `DbTrap`
- Arithmetic: `Add`, `Sub`, `Mul`, `Div`, `Avg`, `Floor`
- Utility: `Text`, `Invoke`, `SpellpowerForCurrentMagic`

### Return Type Formatters
- `modInt` → `+3`, `-2` (signed integer)
- `modPercentNumeric` → `+15%` (percentage)
- `string` → raw value

## Commands
```bash
# Transpiler runs automatically during data import
python manage.py import_gamedata

# E2E tests
pytest tests/e2e/test_descriptions.py -v
```

## Implementation Notes
- Transpiled functions use LRU memoization (5 cached values per function)
- Descriptions update dynamically when equipment changes hero stats
- GameData lookup tables enable DbBuff/DbAbility operations
- Upgrade formula: `value = base + increment * (level - 1)`
