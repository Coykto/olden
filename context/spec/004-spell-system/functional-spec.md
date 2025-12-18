# Functional Specification: Spell System

- **Roadmap Item:** Spell Selection & Loadout, Spell Upgrades
- **Status:** Draft
- **Author:** Claude (AI Assistant)

---

## 1. Overview and Rationale (The "Why")

The Spell System enables hero builders to fully theorycraft their hero's magical capabilities alongside skills and equipment. Currently, the Hero Builder supports skill selection and equipment, but heroes in HoMM: Olden Era also learn and upgrade spells as a core part of their build.

**Problem being solved:** Without spell support, users cannot fully plan their hero builds. Spell damage and effects depend on hero stats, making spell descriptions dynamic — similar to how item descriptions already work. Users need to see how their hero's stats affect spell effectiveness.

**Desired outcome:** Users can assign any number of spells to their hero, upgrade them to see improved effects, and quickly filter spells by school of magic or usage type (combat vs. global map).

**Success criteria:**
- Users can add, upgrade, and remove spells from their hero loadout
- Spell descriptions display correctly with hero-stat-dependent values
- School of magic and combat/global map filters work correctly
- The spell book UI is intuitive and visually fits the existing builder aesthetic

---

## 2. Functional Requirements (The "What")

### 2.1 Layout Changes

**Remove the vertical stripe on the right side of the builder**
- The vertical stripe (right column) is removed from the UI
- The main content area expands to fill the freed space
- **Acceptance Criteria:**
  - [ ] The vertical stripe is no longer visible
  - [ ] No blank space remains where the stripe was

**Repurpose the bottom-right grid area for the spell book**
- The grid that was originally planned for inventory becomes the spell book
- The spell book should visually communicate that it is a spell book (not just generic slots)
- **Acceptance Criteria:**
  - [ ] The bottom-right area displays a spell book component
  - [ ] The spell book has a distinct visual style that differentiates it from equipment/inventory

### 2.2 Spell Book Display

**Initial state: 5 empty spell slots**
- When no spells are assigned, the spell book shows 5 empty slots
- Empty slots can be clicked to open the spell picker
- An "Add Slot" button opens the spell picker directly (selecting a spell creates a new filled slot)
- **Acceptance Criteria:**
  - [ ] New heroes start with 5 visible empty spell slots
  - [ ] Clicking an empty slot opens the spell picker
  - [ ] "Add Slot" button opens the spell picker; selecting a spell creates slot #6, #7, etc.

**Auto-collapse behavior**
- When a spell is removed and the total slot count exceeds 5, the empty slot automatically disappears
- The spell book always maintains a minimum of 5 slots (empty or filled)
- Maximum slots before scrolling: 20
- **Acceptance Criteria:**
  - [ ] Removing a spell when slots > 5 auto-removes the empty slot
  - [ ] Removing a spell when slots ≤ 5 leaves an empty slot
  - [ ] Minimum 5 slots are always visible
  - [ ] The spell book scrolls when slot count exceeds 20

### 2.3 Adding Spells

**Click empty slot or "Add Slot" to open spell picker**
- Clicking an empty spell slot opens a modal to select a spell for that slot
- Clicking "Add Slot" opens the spell picker; selecting a spell creates a new slot with that spell
- **Acceptance Criteria:**
  - [ ] Clicking an empty slot opens the spell picker for that slot
  - [ ] Clicking "Add Slot" opens the spell picker; selection creates a new filled slot
  - [ ] The modal closes after selection

**Spell picker modal organization**
- Spells are organized into tabs by school of magic
- An additional tab shows all spells (or spells without a school, if applicable)
- Schools of magic are extracted from game data
- **Acceptance Criteria:**
  - [ ] The picker displays a tab for each magic school (extracted from data)
  - [ ] Clicking a tab filters the visible spells to that school
  - [ ] All spells are accessible through the appropriate tab

**Spell selection**
- Clicking a spell in the picker assigns it to the slot that was clicked (or creates a new slot if via "Add Slot")
- The modal closes after selection
- The same spell can be assigned to multiple slots (no duplicate restriction for now)
- **Acceptance Criteria:**
  - [ ] Selecting a spell assigns it to the target slot
  - [ ] The modal closes after selection
  - [ ] The selected spell appears in the slot with its icon

### 2.4 Spell Tooltips

**Tooltip content**
- Hovering over an assigned spell shows a tooltip with:
  - Spell name
  - School of magic
  - Type (combat / global map)
  - Full description (with dynamic values from hero stats via description pipeline)
  - Current upgrade level indicator
  - Action buttons: Upgrade, Downgrade, Remove
- **Acceptance Criteria:**
  - [ ] All listed information displays in the tooltip
  - [ ] Description values update dynamically based on hero stats
  - [ ] Upgrade/Downgrade/Remove buttons are functional

### 2.5 Spell Upgrades

**Upgrade levels**
- Spells have upgrade levels (number extracted from game data)
- Level is displayed as a numeric indicator (e.g., "Level 1/3")
- Upgrades are free (no dust cost displayed)
- **Acceptance Criteria:**
  - [ ] Each spell displays its current level
  - [ ] Maximum level is determined by game data per spell
  - [ ] No cost display is shown (unlike equipment)

**Upgrade/Downgrade via tooltip**
- Upgrade button increases spell level (if not at max)
- Downgrade button decreases spell level (if not at min)
- **Acceptance Criteria:**
  - [ ] Clicking Upgrade increases the level by 1
  - [ ] Clicking Downgrade decreases the level by 1
  - [ ] Buttons are disabled at min/max levels respectively

**Max All / Reset All buttons**
- "Max All" button upgrades all assigned spells to their maximum level
- "Reset All" button resets all assigned spells to level 1
- These buttons appear near the spell book (similar placement to equipment's Max/Reset)
- **Acceptance Criteria:**
  - [ ] "Max All" sets all spells to their maximum level
  - [ ] "Reset All" sets all spells to level 1
  - [ ] Buttons are visible and accessible near the spell book

### 2.6 Removing Spells

**Remove via tooltip**
- The "Remove" button in the tooltip removes the spell from that slot
- If total slots > 5, the slot auto-collapses; otherwise it becomes empty
- **Acceptance Criteria:**
  - [ ] Clicking Remove clears the spell from the slot
  - [ ] Slot auto-collapses if above minimum (5 slots)
  - [ ] Slot remains empty if at minimum

**Remove via slot control**
- A "Remove" control on the slot itself (visible on hover or always) allows quick removal
- **Acceptance Criteria:**
  - [ ] Users can remove a spell directly from the slot without opening the tooltip

### 2.7 Spell Book Filters

**School of magic bookmarks**
- 5 bookmark-style tabs on the right edge of the spell book (matching in-game aesthetic)
- Each bookmark corresponds to a school of magic (extracted from data)
- Clicking a bookmark filters the spell book to show only spells of that school
- A "show all" option displays all spells regardless of school
- **Acceptance Criteria:**
  - [ ] 5 bookmark tabs are visible on the spell book
  - [ ] Clicking a bookmark filters to that school's spells
  - [ ] There is a way to clear the filter and show all spells

**Combat / Global Map toggle filters**
- Two toggle buttons at the bottom of the spell book
- "Combat" filter shows only combat spells
- "Global Map" filter shows only adventure map spells
- Filters can be combined with school filters
- **Acceptance Criteria:**
  - [ ] Both filter toggles are visible
  - [ ] Filters work independently and in combination with school filters
  - [ ] Clear indication of which filters are active

### 2.8 Spell Descriptions (Dynamic Values)

**Reuse description-transpiler pipeline**
- Spell descriptions use the same pipeline as item descriptions
- Hero stats (like spell damage) affect calculated values in descriptions
- **Acceptance Criteria:**
  - [ ] Spell descriptions display correctly with placeholder values resolved
  - [ ] Changing hero stats updates spell descriptions accordingly

---

## 3. Scope and Boundaries

### In-Scope

- Removal of the vertical stripe (right column) from builder layout
- Spell book UI component in the bottom-right area
- Spell slot management (5 initial, add more via picker, auto-collapse, max 20 before scroll)
- Spell picker modal with school-of-magic tabs
- Spell assignment to slots
- Spell tooltips with full details and action buttons
- Spell upgrade system (level indicator, upgrade/downgrade, max all/reset all)
- Spell removal (via tooltip and slot control)
- School of magic bookmark filters (5 schools from game data)
- Combat / Global Map toggle filters
- Integration with description-transpiler pipeline for dynamic spell descriptions

### Out-of-Scope

- **Spell prerequisites/restrictions:** Heroes may have restrictions on which spells they can learn — this is acknowledged but NOT implemented in this spec. All spells are selectable regardless of hero state.
- **Army Building:** Separate roadmap item.
- **Build Persistence:** Separate roadmap item (Phase 2).
- **Build Sharing:** Separate roadmap item (Phase 2).
- **Import/Export:** Separate roadmap item (Phase 2).
- **Unit Quiz:** Separate roadmap item (Phase 3).
- **Skill Probability Analysis:** Separate roadmap item (Phase 3).
- **Game Data Browser enhancements:** Separate roadmap item (Phase 3).
