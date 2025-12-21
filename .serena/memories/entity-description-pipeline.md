# Entity Description Pipeline

## Architecture Overview

The game uses a multi-part system for dynamic descriptions:

1. **Template Text** - Stored in `Localization(loc_type='text')` 
   - Example: `"Has +{0}% Movement points, plus {1}% more for every {2} hero levels."`

2. **Arg Functions** - Stored in `Localization(loc_type='args', category='specs|skills|items|...')`
   - Example: `["current_specialization_perc_base_bonus", "current_specialization_perc_increment_alt"]`
   - Maps placeholders {0}, {1}, etc. to function names

3. **Raw Entity Data** - The actual data needed by functions (bonuses, parameters, etc.)
   - This is the CONTEXT passed to JavaScript functions
   - Example: `{ bonuses: [{ type: "heroStat", parameters: ["movementPerBonus", "0.1"], upgrade: {...} }] }`

4. **JavaScript Functions** - In `static/js/generated/description_functions.js`
   - Functions like `current_specialization_perc_base_bonus(ctx)` access `ctx.currentSpecialization.bonuses[...]`

## The Production Bug (December 2025)

### Symptom
Descriptions showed template text with unfilled placeholders:
- "Has +{0}% Movement points" instead of "Has +10% Movement points"

### Root Cause
Parts 1 & 2 (template + args) were stored in database ✅
Part 3 (raw entity data) was read from game files via `get_specialization_data()` ❌

On production, `GAME_DATA_PATH` doesn't exist, so raw data returned `{}`.

### Diagnosis Steps
1. Used Playwright to check HTML data attributes on production
2. Found `data-spec-args` was populated correctly 
3. Found `data-spec-raw` was empty `{}`
4. Traced `get_specialization_data()` → reads from files that don't exist on production

### Solution
Store raw entity data in database during import:
- Added `specialization_data` JSONField to Hero model
- Updated `_import_heroes()` to read and store specialization data from Core.zip
- Updated `get_hero_specialization_info()` to use Hero.specialization_data

## Data Flow

```
Template:     Localization(key='human_hero_1_spec_description', text='Has +{0}%...')
Args:         Localization(key='human_hero_1_spec_description', args=['current_spec...'])
Raw Data:     Hero(specialization_data={bonuses: [...]})
                    ↓
JavaScript:   DescriptionRuntime.formatDescription(template, args, {currentSpecialization: rawData})
                    ↓
Output:       "Has +10% Movement points, plus 2.5% more..."
```

## Key Files

- `core/localizations.py` - `get_hero_specialization_info()`, `get_specialization_data()`
- `gamedata/models.py` - Hero.specialization_data, Localization model
- `gamedata/management/commands/import_gamedata.py` - `_import_heroes()`, `_import_localizations()`
- `static/js/generated/description_functions.js` - Transpiled functions
- `static/js/description-runtime.js` - `formatDescription()` runtime

## Checklist for New Entity Types

When adding dynamic descriptions for a new entity type:
1. ✅ Add text localizations to database (template strings)
2. ✅ Add args localizations to database (function name mappings)
3. ✅ Store raw entity data in database (bonuses, parameters, etc.)
4. ✅ Ensure JavaScript functions exist in description_functions.js
5. ✅ Pass correct context object to formatDescription()
