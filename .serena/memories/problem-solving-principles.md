# Problem-Solving Principles

**NEVER solve the specific problem you have. ALWAYS deduce the general problem and solve that.**

When you encounter an issue, ask: "What is the underlying system or pattern that caused this?" Fix the root cause, not the symptom.

## Examples from This Project

### 1. Item description showing wrong text
- **BAD**: Fix the specific item's description string
- **GOOD**: Investigate how ALL item descriptions are parsed, rendered, and calculated. Fix the general description pipeline.

### 2. Double plus signs in descriptions (`++3 Defence`)
- **BAD**: Add a special case for items with `+` in template
- **GOOD**: Understand the general pattern (template has `+{0}`, function returns `+3`), then fix `formatDescription()` to handle sign deduplication for ALL templates.

### 3. Tooltip showing different data than modal
- **BAD**: Copy the correct data to the tooltip
- **GOOD**: Centralize description calculation in ONE function (`formatItemDescription()`) and make both modal and tooltip call it.

### 4. Fallback function syntax not working (`func1|func2`)
- **BAD**: Manually handle specific items that use fallbacks
- **GOOD**: Fix the runtime parser to correctly split and try each function in the fallback chain for ALL items.

### 5. Compound word hyphen issue (`tier-+5` instead of `tier-5`)
- **BAD**: Add special handling for "Spellbinder's Hat"
- **GOOD**: Recognize that ANY template with `word-{0}` pattern will have this issue, and fix the sign-stripping logic to handle hyphens in compound words.

### 6. Buff alias naming mismatch (`+0%` instead of `+20%`)
- **BAD (Specific)**: Hardcode pattern `_unit_bonus` → `_bonus` at runtime:
  ```javascript
  if (id.endsWith("_unit_bonus")) {
    aliases[id.replace("_unit_bonus", "_bonus")] = buff;
  }
  ```
- **GOOD (General)**: Analyze actual data at build time:
  1. Extract skill data
  2. Collect all buff references from skills
  3. Compare against actual buff IDs
  4. Build aliases only for missing references
  5. Log warnings for unfound references (visibility)
  
  This approach is data-driven: it discovers mismatches from the source data rather than assuming patterns. New naming conventions are automatically handled as long as transformation rules exist.

## How to Apply This Principle

1. **Reproduce the issue** - Understand exactly what's happening
2. **Trace the data flow** - Where does this data come from? How is it processed?
3. **Identify the pattern** - Is this a one-off, or could other items/features have the same issue?
4. **Find the root cause** - What system/function is responsible for the incorrect behavior?
5. **Fix at the source** - Modify the general system, not the specific case
6. **Verify broadly** - Check that other similar cases now work correctly
