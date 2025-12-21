# Entity Description System

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

## Localization Storage

All localization data is stored in the database during import, eliminating runtime dependency on game files.

### Model: `gamedata.Localization`
- **loc_type='text'**: Localization strings (skill names, descriptions, etc.) - 7497 entries
- **loc_type='args'**: Description argument mappings (function names for placeholders) - 1193 entries

### Categories (for args)
- `skills`: From `Lang/args/heroSkills.json`
- `items`: From `Lang/args/artifacts.json`
- `spells`: From `Lang/args/magic.json`
- `abilities`: From `Lang/args/unitsAbility.json`
- `specs`: From `Lang/args/heroInfo.json`

### Key Functions (in `core/localizations.py`)
All functions read from database first, falling back to files for local dev:
- `get_localizations()` → All text strings
- `get_skill_args()` → Skill description args
- `get_item_args()` → Item description args
- `get_spell_args()` → Spell description args
- `get_hero_spec_args()` → Hero specialization args
- `get_unit_ability_args()` → Unit ability args

### Adding New Localization Sources
1. Add the args file mapping in `_import_localizations()` in `import_gamedata.py`
2. Add a category to `Localization.CATEGORY_CHOICES` in `gamedata/models.py`
3. Create a new `get_*_args()` function using `_get_args_from_db(category)`

## Implementation Notes
- Transpiled functions use LRU memoization (5 cached values per function)
- Descriptions update dynamically when equipment changes hero stats
- GameData lookup tables enable DbBuff/DbAbility operations
- Upgrade formula: `value = base + increment * (level - 1)`
