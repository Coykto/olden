# Olden Forge - Project Instructions

## Problem-Solving Principles

**NEVER solve the specific problem you have. ALWAYS deduce the general problem and solve that.**

When you encounter an issue, ask: "What is the underlying system or pattern that caused this?" Fix the root cause, not the symptom.

### Examples

1. **Item description showing wrong text**
   - BAD: Fix the specific item's description string
   - GOOD: Investigate how ALL item descriptions are parsed, rendered, and calculated. Fix the general description pipeline.

2. **Double plus signs in descriptions (`++3 Defence`)**
   - BAD: Add a special case for items with `+` in template
   - GOOD: Understand the general pattern (template has `+{0}`, function returns `+3`), then fix `formatDescription()` to handle sign deduplication for ALL templates.

3. **Tooltip showing different data than modal**
   - BAD: Copy the correct data to the tooltip
   - GOOD: Centralize description calculation in ONE function (`formatItemDescription()`) and make both modal and tooltip call it.

4. **Fallback function syntax not working (`func1|func2`)**
   - BAD: Manually handle specific items that use fallbacks
   - GOOD: Fix the runtime parser to correctly split and try each function in the fallback chain for ALL items.

## Project Overview
Olden Forge is a hero builder web application for Heroes of Might & Magic: Olden Era.

## Key Documentation

### Item Description System
The game uses a complex system to fill placeholder values in item descriptions.
- **Full documentation**: `/docs/item-description-system.md`
- **Serena memory**: `item-description-system`

Key points:
- Description templates are in `Lang/english/texts/artifacts.json`
- Placeholder resolver functions are mapped in `Lang/args/artifacts.json`
- Function definitions are in 42 `.script` files under `Core.zip/DB/info/`
- Some items require hero stats (e.g., viewRadius) for dynamic calculations

### Script Transpiler System
A Node.js transpiler converts game script files to JavaScript at import time.

**Files:**
- `/transpiler/` - TypeScript transpiler source
- `/static/js/description-runtime.js` - Runtime support (memoization, formatters)
- `/static/js/hero-state.js` - Hero state model
- `/static/js/generated/` - Generated files (do not edit)
  - `description_functions.js` - 1175 transpiled functions (~384KB)
  - `game_data.js` - Buff/ability lookup tables (~158KB)

**Commands:**
```bash
# Transpiler runs automatically during data import
python manage.py import_gamedata

# Manual transpiler execution
cd transpiler && npx ts-node src/index.ts <core_zip_path> <output_dir>
```

## Development Workflow
See serena memory: `development-workflow`

## Tech Stack
- Django 6.0 backend
- Vanilla JavaScript frontend with transpiled description functions
- Node.js TypeScript transpiler
- SQLite database
- Game data imported from Unity asset bundles

## Testing

### E2E Tests (Playwright)
```bash
# Requires server running at http://127.0.0.1:8000
pytest tests/e2e/test_descriptions.py -v
```

Tests verify:
- Hero builder loads without JS errors
- Item descriptions render with correct values
- Descriptions update when equipment changes
- Cross-item stat dependencies work correctly

## Key Files

| File | Purpose |
|------|---------|
| `/transpiler/src/index.ts` | Transpiler entry point |
| `/transpiler/src/codegen.ts` | JavaScript code generation |
| `/transpiler/src/data-extractor.ts` | Extract buff/ability lookup tables |
| `/static/js/description-runtime.js` | Runtime memoization and formatters |
| `/static/js/hero-state.js` | Hero state model |
| `/core/item_utils.py` | Item bonus parsing |
| `/hero_builder/views.py` | API endpoints |
| `/hero_builder/templates/hero_builder/builder.html` | Main frontend |
| `/gamedata/management/commands/import_gamedata.py` | Data import |
