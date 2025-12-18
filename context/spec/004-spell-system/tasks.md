# Tasks: Spell System

## Slice 1: Remove right sidebar and expand layout
*Goal: Clean up the layout before adding new components*

- [ ] **Slice 1: Remove the vertical right stripe from the builder layout**
  - [ ] Remove `.right-skills-panel` HTML from `builder.html` (or the partial that contains it)
  - [ ] Remove `.right-skills-panel` and `.right-skill-slot` CSS rules from `builder.css`
  - [ ] Remove related responsive media query rules
  - [ ] Verify the layout expands correctly without the sidebar

---

## Slice 2: Basic spell book UI (empty slots)
*Goal: Display the spell book section with empty slots*

- [ ] **Slice 2: Replace backpack section with spell book displaying 5 empty slots**
  - [ ] Create `.spell-book-section` HTML structure in place of `.backpack-section`
  - [ ] Add 5 empty `.spell-slot` elements with "+" placeholder
  - [ ] Add CSS for `.spell-book-section`, `.spell-grid`, `.spell-slot`
  - [ ] Verify spell book renders in bottom-right area with distinct visual style

---

## Slice 3: Spell API endpoint
*Goal: Backend serves spell data to the frontend*

- [ ] **Slice 3: Create API endpoint returning available spells**
  - [ ] Add `MagicSchool` model to `gamedata/models.py`
  - [ ] Create migration for `MagicSchool`
  - [ ] Update `import_gamedata` to extract school display names from `Lang/english/texts/magic.json`
  - [ ] Add `spell_type` and `max_upgrade_level` fields to `Spell` model (or extract from raw_data at API time)
  - [ ] Create `api_available_spells` view in `hero_builder/views.py`
  - [ ] Add URL route for `/api/spells/available/`
  - [ ] Verify API returns spell list with schools data

---

## Slice 4: Spell picker modal (basic)
*Goal: Users can open a modal and see available spells*

- [ ] **Slice 4: Open spell picker modal showing all spells**
  - [ ] Add `SpellBookManager` JavaScript object skeleton in `_scripts.html`
  - [ ] Implement `SpellBookManager.init()` to fetch spells from API
  - [ ] Implement `SpellBookManager.openSpellPicker()` to render modal
  - [ ] Add click handler on empty slots to open picker
  - [ ] Reuse existing modal CSS patterns (`.modal-overlay`, `.skill-modal`)
  - [ ] Verify clicking empty slot opens modal with spell list

---

## Slice 5: Select spell and fill slot
*Goal: Users can select a spell and see it in the slot*

- [ ] **Slice 5: Selecting a spell fills the slot with icon**
  - [ ] Implement `SpellBookManager.selectSpell(spellId)`
  - [ ] Track equipped spells in `SpellBookManager.equippedSpells` array
  - [ ] Implement `SpellBookManager.updateSlot(index)` to render spell icon
  - [ ] Close modal after selection
  - [ ] Verify selected spell appears in slot with icon

---

## Slice 6: Add Spell button (dynamic slot creation)
*Goal: Users can add more than 5 spells*

- [ ] **Slice 6: "Add Spell" button creates new slots beyond initial 5**
  - [ ] Add "Add Spell" button to spell book UI
  - [ ] Clicking "Add Spell" opens picker
  - [ ] Selecting spell creates new slot (6th, 7th, etc.) with that spell
  - [ ] Verify slot count grows when adding spells via button

---

## Slice 7: School-of-magic tabs (bookmarks)
*Goal: Users can filter spell book by school*

- [ ] **Slice 7: Add school bookmark tabs to filter equipped spells**
  - [ ] Add `.spell-school-tabs` HTML with tabs for each school + "All"
  - [ ] Render tab labels from API `schools` data
  - [ ] Add CSS for bookmark-style tabs
  - [ ] Implement `SpellBookManager.filterBySchool(schoolId)`
  - [ ] Filter display to show only spells matching school (hide non-matching slots)
  - [ ] Verify clicking tabs filters the spell book view

---

## Slice 8: Combat / Global Map filters
*Goal: Users can filter by spell type*

- [ ] **Slice 8: Add combat/global map toggle filters**
  - [ ] Add `.spell-type-filters` HTML with toggle buttons
  - [ ] Add CSS for filter buttons
  - [ ] Implement `SpellBookManager.filterByType(type)`
  - [ ] Combine with school filter (both filters apply together)
  - [ ] Verify filters work independently and combined

---

## Slice 9: Spell tooltips (basic info)
*Goal: Users see spell details on hover*

- [ ] **Slice 9: Show tooltip on spell hover with name, school, type**
  - [ ] Add `.spell-tooltip` HTML structure inside spell slots
  - [ ] Add CSS for tooltip positioning and styling
  - [ ] Populate tooltip with spell name, school display name, spell type
  - [ ] Verify tooltip appears on hover with correct info

---

## Slice 10: Dynamic spell descriptions
*Goal: Spell descriptions show calculated values*

- [ ] **Slice 10: Display dynamic spell description in tooltip**
  - [ ] Implement `SpellBookManager.formatSpellDescription()` using existing pipeline
  - [ ] Pass spell data and upgrade level to `DescriptionRuntime.formatDescription()`
  - [ ] Display formatted description in tooltip
  - [ ] Verify descriptions show calculated values (not placeholders)

---

## Slice 11: Spell upgrades
*Goal: Users can upgrade/downgrade spells*

- [ ] **Slice 11: Add upgrade/downgrade functionality**
  - [ ] Track upgrade level per spell in `equippedSpells` array
  - [ ] Display current level in tooltip (e.g., "Level 1/3")
  - [ ] Add Upgrade/Downgrade buttons to tooltip
  - [ ] Implement `SpellBookManager.upgradeSpell(index)` and `downgradeSpell(index)`
  - [ ] Disable buttons at min/max levels
  - [ ] Verify upgrade changes level and updates description

---

## Slice 12: Remove spell
*Goal: Users can remove spells from slots*

- [ ] **Slice 12: Add spell removal functionality**
  - [ ] Add Remove button to tooltip
  - [ ] Add X button on slot itself (visible on hover)
  - [ ] Implement `SpellBookManager.removeSpell(index)`
  - [ ] Auto-collapse slot if count > 5
  - [ ] Keep slot empty if count ≤ 5
  - [ ] Verify removal works and auto-collapse functions correctly

---

## Slice 13: Max All / Reset All buttons
*Goal: Bulk upgrade controls*

- [ ] **Slice 13: Add Max All and Reset All buttons**
  - [ ] Add button HTML near spell book (similar placement to equipment)
  - [ ] Implement `SpellBookManager.maxAllSpells()`
  - [ ] Implement `SpellBookManager.resetAllSpells()`
  - [ ] Verify buttons affect all equipped spells

---

## Slice 14: Scrolling for many spells
*Goal: Handle more than 20 spells gracefully*

- [ ] **Slice 14: Enable scrolling when spell count exceeds 20**
  - [ ] Add CSS for max-height and overflow-y on spell grid container
  - [ ] Verify scrolling activates at > 20 slots
  - [ ] Ensure scroll behavior is smooth

---

## Slice 15: Description updates on hero stat changes
*Goal: Spell descriptions update when equipment changes spell power*

- [ ] **Slice 15: Wire spell descriptions to hero stat updates**
  - [ ] Call `SpellBookManager.updateAllDescriptions()` when hero stats change
  - [ ] Hook into existing `EquipmentManager.updateAllDescriptions()` flow
  - [ ] Verify equipping an item that changes spell power updates spell descriptions
