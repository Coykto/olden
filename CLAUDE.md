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

6. **Nested tooltip disappears when moving between sibling triggers**
   - BAD: Add special case handling for "moving from ability A to ability B"
   - GOOD: Understand the general pattern (need to check if trigger is inside ANY tooltip in the stack, not just `activeTooltip`). The nested tooltip was moved to body, so `activeTooltip.contains(trigger)` fails for siblings. Fix by iterating through entire `tooltipStack`.

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

**Serena memory:** `tooltip-system` (contains detailed implementation notes and lessons learned)

The tooltip system (`/static/js/tooltip.js`) is a sophisticated system supporting:
- Configurable placement (top, bottom, left, right) with automatic boundary detection
- Gap-free hover using an invisible bridge element
- **Nested tooltips** with proper stack management
- DOM movement to `document.body` to avoid CSS transform issues

### Key Concepts

**1. Tooltips are moved to `document.body` when shown**
This avoids CSS transform/filter issues but means:
- The tooltip is no longer a child of its trigger element
- When regenerating parent's innerHTML, hide active tooltips first
- Nested tooltip triggers remain inside parent tooltip (which is in body)

**2. Tooltip Stack for Nesting**
```javascript
tooltipStack = [{tooltip, trigger}, ...]  // Index 0 = parent, higher = children
```
- Parent tooltip at index 0, nested tooltips at higher indices
- When showing a sibling nested tooltip, pop and hide tooltips above the common parent
- When entering parent area without trigger, hide child tooltips

**3. Critical Event Handling Patterns**

In `handleMouseEnter`:
```javascript
if (enteredTooltip && isTooltipInStack(enteredTooltip)) {
    if (trigger && !tooltipStack.some(t => t.trigger === trigger)) {
        // New nested trigger - show its tooltip
    } else if (!trigger) {
        // Entered tooltip area with NO trigger - hide child tooltips
    }
    // else: trigger already in stack - do nothing (keep nested tooltip)
}
```

In `showTooltip`:
```javascript
// Check if trigger is inside ANY tooltip in the stack (not just activeTooltip)
for (let i = tooltipStack.length - 1; i >= 0; i--) {
    if (tooltipStack[i].tooltip.contains(trigger)) {
        parentStackIndex = i;
        break;
    }
}
// If moving to sibling, pop tooltips above parent
```

In `isHoveringTooltipArea`:
```javascript
// Only count tooltips at same or higher stack index (children)
// Parent tooltips (lower index) should NOT keep nested tooltip visible
if (hoveredIndex >= ourIndex) return true;
```

### Common Pitfalls (Lessons Learned)

1. **Don't check only `activeTooltip`** - When nesting, check the entire stack
2. **Stack index matters** - Parent at lower index, children at higher index
3. **Trigger already in stack** - Don't hide its tooltip when re-entering
4. **`closest('.tooltip')` finds parent** - Nested tooltips are in body, so `closest()` from trigger finds the parent tooltip, not the nested one

### Solution Patterns

**For full DOM regeneration:**
```javascript
if (typeof Tooltip !== 'undefined') {
    Tooltip.hideActive();
}
this.updateUI();
```

**For in-place updates:**
```javascript
const findTooltipElement = (selector) => {
    let el = slotElement.querySelector(selector);
    if (el) return el;
    const activeTooltip = document.body.querySelector('.tooltip[style*="display: block"]');
    if (activeTooltip) {
        el = activeTooltip.querySelector(selector);
    }
    return el;
};
```

### Key Files
- `/static/js/tooltip.js` - Tooltip system with nested support
- `/hero_builder/templates/hero_builder/partials/_scripts.html` - EquipmentManager, SpellBookManager, ArmyManager
- `/hero_builder/static/hero_builder/css/tooltip.css` - Tooltip styles
