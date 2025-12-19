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

5. **Item tooltip not updating when clicking upgrade button**
   - BAD: Add `Tooltip.hideActive()` to `setItemLevel()`, `maxAllUpgrades()`, `resetAllUpgrades()`
   - GOOD: Understand WHY tooltips go stale (tooltip system moves them to `document.body`), then fix it in ONE place (`updateUI()`) so ALL callers automatically work. See "Tooltip System Architecture" section below.

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

## Subagent Usage

**Use subagents as much as possible.** They provide specialized expertise and allow parallel work.

### python-expert
**Always use for Python work:**
- Django views, models, forms, serializers
- Management commands
- Any backend logic
- Class design and refactoring

### react-expert
**Always use for JavaScript/TypeScript work:**
- Frontend JS in `/static/js/`
- Transpiler code in `/transpiler/`
- Any TypeScript modifications

### tester (custom)
**Always use for testing. NEVER write or execute unit tests.**

Spawn a general-purpose subagent with these instructions:
- Use Playwright MCP tools exclusively for E2E testing
- Test against the running dev server at `http://127.0.0.1:8000`
- When testing a specific issue (e.g., a spell description), also check 3-5 similar items to catch patterns
- Take screenshots of failures
- Check browser console for JS errors

Example prompt for tester:
```
Test that spell descriptions render correctly. Focus on [specific spell], but also verify 3-4 other spells from different schools. Use Playwright MCP to navigate, check text content, and capture any console errors.
```

### Testing Rules

1. **NEVER write unit tests. NEVER run pytest or Django tests.**
2. **All testing happens via Playwright E2E through the tester subagent.**
3. When delegating to tester, provide:
   - What specific behavior to verify
   - Context on what might be broken
   - Examples of similar past issues (if any)
   - URLs/paths to test

## Game Data

### Source of Truth
**Game files are the ultimate source of truth.** Never assume something exists or doesn't exist in game data - always check.

### Raw Game Data Location
```
/Users/eb/Downloads/gamedata/steamapps/common/Heroes of Might Magic Olden Era Demo/HeroesOE_Data/StreamingAssets/
```

Key files:
- `Core.zip` - Contains all `.script` files with game logic
- `Lang/english/` - Localization JSON files

### Re-importing Game Data
Feel free to re-import whenever needed:
```bash
python manage.py import_gamedata --force
```
This also runs the transpiler automatically.

### Decompiling Game Code
The game is built with Unity (C#). To decompile:
```bash
# Install ILSpy CLI if needed
dotnet tool install -g ilspycmd

# Decompile a DLL
ilspycmd /path/to/Assembly-CSharp.dll -o ./decompiled/
```

Game assemblies are typically in:
```
HeroesOE_Data/Managed/
```

### Verification Principle
**NEVER assume. ALWAYS verify.**
- Don't assume a field exists in game data - grep for it
- Don't assume a function works a certain way - read the .script file
- Don't assume game behavior - check the wiki or screenshots

## Research Resources

### When Unsure About Game Visuals
Google for game screenshots: `"Heroes of Might and Magic Olden Era" [feature]`

### Game Wikis
- https://wiki.hoodedhorse.com/Heroes_of_Might_and_Magic_Olden_Era/Main_Page
- https://mightandmagic.fandom.com/wiki/Category:Olden_Era

## Tech Stack
- Django 6.0 backend
- Vanilla JavaScript frontend with transpiled description functions
- Node.js TypeScript transpiler
- SQLite database
- Game data imported from Unity asset bundles

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

## Tooltip System Architecture

**CRITICAL:** The tooltip system (`/static/js/tooltip.js`) moves tooltip elements to `document.body` when displaying them. This has important implications:

### The Problem
When a tooltip is visible:
1. The tooltip DOM element is moved from its parent (e.g., equipment slot) to `document.body`
2. If code regenerates the parent's innerHTML, a NEW tooltip is created inside the parent
3. But the OLD tooltip is still in `document.body` being displayed
4. User sees stale content

### The Solution Pattern
When updating UI that contains tooltips:

**For full DOM regeneration (like `EquipmentManager.updateUI()`):**
```javascript
// Hide active tooltip BEFORE regenerating DOM
if (typeof Tooltip !== 'undefined') {
    Tooltip.hideActive();
}
// Now safe to regenerate innerHTML
this.updateUI();
// Optionally re-show tooltip for same element
Tooltip.show(element);
```

**For in-place updates (like `SpellBookManager.updateSlotInPlace()`):**
```javascript
// Query both the slot AND the active tooltip in body
const findTooltipElement = (selector) => {
    let el = slotElement.querySelector(selector);
    if (el) return el;
    // Tooltip may have been moved to body
    const activeTooltip = document.body.querySelector('.tooltip[style*="display: block"]');
    if (activeTooltip) {
        el = activeTooltip.querySelector(selector);
    }
    return el;
};
```

### Key Files
- `/static/js/tooltip.js` - Tooltip system (moves tooltips to body on show)
- `/hero_builder/templates/hero_builder/partials/_scripts.html` - EquipmentManager, SpellBookManager
