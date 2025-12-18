# Technical Specification: Spell System

- **Functional Specification:** `context/spec/004-spell-system/functional-spec.md`
- **Status:** Draft
- **Author(s):** Claude (AI Assistant)

---

## 1. High-Level Technical Approach

The Spell System implementation leverages significant existing infrastructure (~70% already built):

**Already Implemented:**
- `Spell` Django model with 129 spells across 5 schools
- Spell description functions already transpiled in `description_functions.js`
- `HeroState.createSpellContext()` and `formatSpellDescription()` ready in frontend
- Equipment modal and tooltip patterns to follow

**To Implement:**
1. **Layout Changes**: Remove `.right-skills-panel`, convert `.backpack-section` to spell book
2. **Backend**: Add spell API endpoint, extract school display names during import
3. **Frontend**: Create `SpellBookManager` module with spell book UI, picker modal, filters
4. **Data Model**: Add `MagicSchool` model to store localized school names

**Systems Affected:**
- `hero_builder/templates/hero_builder/builder.html` - Layout changes
- `hero_builder/static/hero_builder/css/builder.css` - Remove sidebar, add spell book styles
- `hero_builder/templates/hero_builder/partials/_scripts.html` - Add SpellBookManager
- `hero_builder/views.py` - Add spell API endpoint
- `gamedata/models.py` - Add MagicSchool model
- `gamedata/management/commands/import_gamedata.py` - Extract school names

---

## 2. Proposed Solution & Implementation Plan

### 2.1 Data Model Changes

**New Model: `MagicSchool`**
```python
class MagicSchool(models.Model):
    """Stores localized names for magic schools."""
    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='magic_schools')
    id_key = models.CharField(max_length=20)  # day, night, space, primal, neutral
    display_name = models.CharField(max_length=100)  # Daylight Magic, etc.

    class Meta:
        unique_together = [['version', 'id_key']]
```

**Update Spell Model:**
- Add `spell_type` field to distinguish combat vs global map spells (extracted from raw_data)
- Add `max_upgrade_level` field (extracted from raw_data during import)

### 2.2 Game Data Import Changes

**Extract from `Lang/english/texts/magic.json`:**
- School display names (sid: `day`, `night`, `space`, `primal`, `neutral`)
- Spell names and descriptions

**Extract from spell config:**
- `spell_type`: Combat or Global Map (from `raw_data.targetType` or similar)
- `max_upgrade_level`: Number of upgrade tiers (from `raw_data.upgrades` array length)

### 2.3 API Endpoint

**`GET /api/spells/available/`**

Returns all spells with their metadata for the spell picker.

```json
{
  "spells": [
    {
      "id": 123,
      "id_key": "day_01_magic_blessing",
      "name": "Blessing",
      "school": "day",
      "school_display": "Daylight Magic",
      "spell_type": "combat",
      "level": 1,
      "max_upgrade_level": 3,
      "description_template": "Increases attack of target stack by {0}%",
      "description_args": ["current_magic_upgrade_0_param_offence_percent"],
      "icon": "day_01_magic_blessing",
      "raw_data": {...}
    }
  ],
  "schools": [
    {"id": "day", "name": "Daylight Magic"},
    {"id": "night", "name": "Nightshade Magic"},
    ...
  ]
}
```

### 2.4 Layout Changes (CSS)

**Remove:**
```css
/* DELETE: .right-skills-panel and .right-skill-slot rules */
/* DELETE: Related responsive rules */
```

**Add:**
```css
/* Spell Book Section */
.spell-book-section { ... }
.spell-school-tabs { ... }
.spell-school-tab { ... }
.spell-grid { ... }
.spell-slot { ... }
.spell-tooltip { ... }
/* Filter toggles */
.spell-type-filters { ... }
```

**Template Changes:**
- Remove `{% include 'hero_builder/partials/_right_skills.html' %}` (or equivalent)
- Replace `.backpack-section` content with spell book component

### 2.5 Frontend Components

**SpellBookManager (JavaScript Module)**

```javascript
const SpellBookManager = {
    // State
    equippedSpells: [],        // Array of {spell, upgradeLevel} objects
    availableSpells: [],       // From API
    schools: [],               // From API
    currentSchoolFilter: null, // null = all
    currentTypeFilter: null,   // null = all, 'combat', 'global'

    // Core methods
    init(),
    loadSpells(),

    // Spell book display
    renderSpellBook(),
    updateSlot(index),

    // Filtering
    filterBySchool(schoolId),
    filterByType(type),
    getFilteredSpells(),

    // Spell picker modal
    openSpellPicker(targetSlotIndex),
    closeSpellPicker(),
    renderSpellPicker(),
    selectSpell(spellId),

    // Spell management
    addSpell(spell),
    removeSpell(slotIndex),
    upgradeSpell(slotIndex),
    downgradeSpell(slotIndex),
    maxAllSpells(),
    resetAllSpells(),

    // Integration
    getSpellContext(spell, upgradeLevel),
    formatSpellDescription(spell, upgradeLevel),
    updateAllDescriptions()
};
```

**Spell Slot Component (HTML Structure)**
```html
<div class="spell-slot" data-slot-index="0">
    <!-- Empty state -->
    <span class="add-text">+</span>

    <!-- Filled state (dynamically rendered) -->
    <img src="/media/gamedata/spells/{icon}.png" alt="{name}">
    <div class="spell-level-badge">Lv.{level}</div>
    <button class="spell-remove-btn">&times;</button>

    <!-- Tooltip (shown on hover) -->
    <div class="spell-tooltip">
        <div class="spell-name">{name}</div>
        <div class="spell-school">{school_display}</div>
        <div class="spell-type">{combat/global}</div>
        <div class="spell-description">{dynamic description}</div>
        <div class="spell-level">Level {current}/{max}</div>
        <div class="spell-actions">
            <button onclick="SpellBookManager.upgradeSpell(0)">Upgrade</button>
            <button onclick="SpellBookManager.downgradeSpell(0)">Downgrade</button>
            <button onclick="SpellBookManager.removeSpell(0)">Remove</button>
        </div>
    </div>
</div>
```

**School Bookmark Tabs**
```html
<div class="spell-school-tabs">
    <button class="spell-school-tab active" data-school="all">All</button>
    <!-- Dynamically rendered from API schools data -->
    <button class="spell-school-tab" data-school="day">Daylight</button>
    ...
</div>
```

**Type Filter Toggles**
```html
<div class="spell-type-filters">
    <button class="spell-type-btn active" data-type="all">All</button>
    <button class="spell-type-btn" data-type="combat">Combat</button>
    <button class="spell-type-btn" data-type="global">Global Map</button>
</div>
```

### 2.6 Slot Management Logic

**Initial State:** 5 empty slots

**Add Spell Flow:**
1. User clicks "Add Spell" button OR empty slot
2. Spell picker modal opens
3. User selects spell
4. If via "Add Spell": new slot created with spell
5. If via empty slot: spell fills that slot
6. Descriptions update

**Remove Spell Flow:**
1. User clicks remove (tooltip or slot button)
2. Spell removed from slot
3. If slots > 5: slot auto-collapses
4. If slots ≤ 5: slot becomes empty
5. Descriptions update

**Scrolling:** When slots > 20, container becomes scrollable

### 2.7 Description Pipeline Integration

The existing pipeline handles spells:

```javascript
// Already exists in hero-state.js
HeroState.createSpellContext(spell) {
    return {
        currentMagic: spell,
        currentHero: { stats: this.effectiveStats, ... }
    };
}

// Use in SpellBookManager
formatSpellDescription(spell, upgradeLevel) {
    const ctx = HeroState.createSpellContext({
        ...spell,
        upgradeLevel: upgradeLevel
    });
    return DescriptionRuntime.formatDescription(
        spell.description_template,
        spell.description_args,
        ctx
    );
}
```

---

## 3. Impact and Risk Analysis

### System Dependencies

| Component | Dependency | Impact |
|-----------|------------|--------|
| Spell API | Spell model | Must have spells imported |
| SpellBookManager | API endpoint | Needs endpoint before UI works |
| Description rendering | Transpiled functions | Already complete |
| School names | Import process | Must update import to extract names |

### Potential Risks & Mitigations

1. **School name extraction fails**
   - Risk: Localization file structure differs from expected
   - Mitigation: Fallback to internal IDs (day → "Day Magic")

2. **Spell type field missing**
   - Risk: Not all spells have clear combat/global designation
   - Mitigation: Default to "combat" if unknown; add manual override later

3. **Tooltip overflow on small screens**
   - Risk: Bottom-right position may cause tooltip to go off-screen
   - Mitigation: Detect edge and flip tooltip to left side

4. **Performance with many spells**
   - Risk: 129 spells may slow modal rendering
   - Mitigation: Virtual scrolling if needed; current item modal handles similar counts fine

---

## 4. Testing Strategy

### Manual Testing Scenarios

**Layout & Visual:**
- [ ] Vertical stripe (right panel) is completely removed
- [ ] Spell book section appears in bottom-right area
- [ ] 5 empty slots visible by default
- [ ] School bookmark tabs display correct names from game data
- [ ] Combat/Global Map filter buttons visible

**Spell Selection:**
- [ ] Clicking empty slot opens spell picker modal
- [ ] Clicking "Add Spell" opens picker and creates new slot on selection
- [ ] Picker shows all spells organized by school tabs
- [ ] Selecting a spell fills the slot and closes modal
- [ ] Spell icon displays correctly in slot

**Filtering:**
- [ ] School tabs filter spell book to show only matching spells
- [ ] "All" tab shows all spells
- [ ] Combat filter shows only combat spells
- [ ] Global Map filter shows only adventure map spells
- [ ] Filters can be combined (e.g., Day + Combat)

**Tooltips:**
- [ ] Hovering spell shows tooltip with name, school, type, description
- [ ] Tooltip shows current upgrade level (e.g., "Level 1/3")
- [ ] Upgrade/Downgrade/Remove buttons visible in tooltip

**Upgrades:**
- [ ] Upgrade button increases level, updates description
- [ ] Downgrade button decreases level
- [ ] Buttons disabled at min/max levels
- [ ] "Max All" upgrades all spells to max
- [ ] "Reset All" sets all spells to level 1

**Slot Management:**
- [ ] Remove via tooltip clears spell from slot
- [ ] Remove via slot button (X) also works
- [ ] Slots auto-collapse when > 5 and spell removed
- [ ] Minimum 5 slots always maintained
- [ ] Scrolling activates when > 20 slots

**Dynamic Descriptions:**
- [ ] Spell descriptions show calculated values (not placeholders)
- [ ] Changing hero stats (e.g., spell power from equipment) updates spell descriptions
