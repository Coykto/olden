# Tasks: Spell System

## Slice 1: Remove right sidebar and expand layout
*Goal: Clean up the layout before adding new components*

- [x] **Slice 1: Remove the vertical right stripe from the builder layout**
  - [x] Remove `.right-skills-panel` HTML from `builder.html` (or the partial that contains it)
  - [x] Remove `.right-skills-panel` and `.right-skill-slot` CSS rules from `builder.css`
  - [x] Remove related responsive media query rules
  - [x] Verify the layout expands correctly without the sidebar

---

## Slice 2: Basic spell book UI (empty slots)
*Goal: Display the spell book section with empty slots*

- [x] **Slice 2: Replace backpack section with spell book displaying 5 empty slots**
  - [x] Create `.spell-book-section` HTML structure in place of `.backpack-section`
  - [x] Add 5 empty `.spell-slot` elements with "+" placeholder
  - [x] Add CSS for `.spell-book-section`, `.spell-grid`, `.spell-slot`
  - [x] Verify spell book renders in bottom-right area with distinct visual style

---

## Slice 3: Spell API endpoint
*Goal: Backend serves spell data to the frontend*

- [x] **Slice 3: Create API endpoint returning available spells**
  - [x] Add `MagicSchool` model to `gamedata/models.py`
  - [x] Create migration for `MagicSchool`
  - [x] Update `import_gamedata` to extract school display names from `Lang/english/texts/magic.json`
  - [x] Add `spell_type` and `max_upgrade_level` fields to `Spell` model (or extract from raw_data at API time)
  - [x] Create `api_available_spells` view in `hero_builder/views.py`
  - [x] Add URL route for `/api/spells/available/`
  - [x] Verify API returns spell list with schools data

---

## Slice 4: Spell picker modal (basic)
*Goal: Users can open a modal and see available spells*

- [x] **Slice 4: Open spell picker modal showing all spells**
  - [x] Add `SpellBookManager` JavaScript object skeleton in `_scripts.html`
  - [x] Implement `SpellBookManager.init()` to fetch spells from API
  - [x] Implement `SpellBookManager.openSpellPicker()` to render modal
  - [x] Add click handler on empty slots to open picker
  - [x] Reuse existing modal CSS patterns (`.modal-overlay`, `.skill-modal`)
  - [x] Verify clicking empty slot opens modal with spell list

---

## Slice 5: Select spell and fill slot
*Goal: Users can select a spell and see it in the slot*

- [x] **Slice 5: Selecting a spell fills the slot with icon**
  - [x] Implement `SpellBookManager.selectSpell(spellId)`
  - [x] Track equipped spells in `SpellBookManager.equippedSpells` array
  - [x] Implement `SpellBookManager.updateSlot(index)` to render spell icon
  - [x] Close modal after selection
  - [x] Verify selected spell appears in slot with icon

---

## Slice 6: Add Spell button (dynamic slot creation)
*Goal: Users can add more than 5 spells*

- [x] **Slice 6: "Add Spell" button creates new slots beyond initial 5**
  - [x] Add "Add Spell" button to spell book UI
  - [x] Clicking "Add Spell" opens picker
  - [x] Selecting spell creates new slot (6th, 7th, etc.) with that spell
  - [x] Verify slot count grows when adding spells via button

---

## Slice 7: School-of-magic tabs (bookmarks)
*Goal: Users can filter spell book by school*

- [x] **Slice 7: Add school bookmark tabs to filter equipped spells**
  - [x] Add `.spell-school-tabs` HTML with tabs for each school + "All"
  - [x] Render tab labels from API `schools` data
  - [x] Add CSS for bookmark-style tabs
  - [x] Implement `SpellBookManager.filterBySchool(schoolId)`
  - [x] Filter display to show only spells matching school (hide non-matching slots)
  - [x] Verify clicking tabs filters the spell book view

---

## Slice 8: Combat / Global Map filters
*Goal: Users can filter by spell type*

- [x] **Slice 8: Add combat/global map toggle filters**
  - [x] Add `.spell-type-filters` HTML with toggle buttons
  - [x] Add CSS for filter buttons
  - [x] Implement `SpellBookManager.filterByType(type)`
  - [x] Combine with school filter (both filters apply together)
  - [x] Verify filters work independently and combined

---

## Slice 9: Spell tooltips (basic info)
*Goal: Users see spell details on hover*

- [x] **Slice 9: Show tooltip on spell hover with name, school, type**
  - [x] Add `.spell-tooltip` HTML structure inside spell slots
  - [x] Add CSS for tooltip positioning and styling
  - [x] Populate tooltip with spell name, school display name, spell type
  - [x] Verify tooltip appears on hover with correct info

---

## Slice 10: Dynamic spell descriptions
*Goal: Spell descriptions show calculated values*

- [x] **Slice 10: Display dynamic spell description in tooltip**
  - [x] Implement `SpellBookManager.formatSpellDescription()` using existing pipeline
  - [x] Pass spell data and upgrade level to `DescriptionRuntime.formatDescription()`
  - [x] Display formatted description in tooltip
  - [x] Verify descriptions show calculated values (not placeholders)

---

## Slice 11: Spell upgrades
*Goal: Users can upgrade/downgrade spells*

- [x] **Slice 11: Add upgrade/downgrade functionality**
  - [x] Track upgrade level per spell in `equippedSpells` array
  - [x] Display current level in tooltip (e.g., "Level 1/3")
  - [x] Add Upgrade/Downgrade buttons to tooltip
  - [x] Implement `SpellBookManager.upgradeSpell(index)` and `downgradeSpell(index)`
  - [x] Disable buttons at min/max levels
  - [x] Verify upgrade changes level and updates description

---

## Slice 12: Remove spell
*Goal: Users can remove spells from slots*

- [x] **Slice 12: Add spell removal functionality**
  - [x] Add Remove button to tooltip
  - [x] Add X button on slot itself (visible on hover)
  - [x] Implement `SpellBookManager.removeSpell(index)`
  - [x] Auto-collapse slot if count > 5
  - [x] Keep slot empty if count ≤ 5
  - [x] Verify removal works and auto-collapse functions correctly

---

## Slice 13: Max All / Reset All buttons
*Goal: Bulk upgrade controls*

- [x] **Slice 13: Add Max All and Reset All buttons**
  - [x] Add button HTML near spell book (similar placement to equipment)
  - [x] Implement `SpellBookManager.maxAllSpells()`
  - [x] Implement `SpellBookManager.resetAllSpells()`
  - [x] Verify buttons affect all equipped spells

---

## Slice 14: Scrolling for many spells
*Goal: Handle more than 20 spells gracefully*

- [x] **Slice 14: Enable scrolling when spell count exceeds 20**
  - [x] Add CSS for max-height and overflow-y on spell grid container
  - [x] Verify scrolling activates at > 20 slots
  - [x] Ensure scroll behavior is smooth

---

## Slice 15: Description updates on hero stat changes
*Goal: Spell descriptions update when equipment changes spell power*

- [x] **Slice 15: Wire spell descriptions to hero stat updates**
  - [x] Call `SpellBookManager.updateAllDescriptions()` when hero stats change
  - [x] Hook into existing `EquipmentManager.updateAllDescriptions()` flow
  - [x] Verify equipping an item that changes spell power updates spell descriptions



Before each major unit of work:
1. Write current plan to PROGRESS.md
2. After completing a feature, update PROGRESS.md with status
3. If context feels heavy, run /compact or /clear and re-read PROGRESS.md
4. On any error or limit, save state to PROGRESS.md before stopping