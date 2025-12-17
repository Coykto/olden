# Functional Specification: Equipment System

- **Roadmap Item:** Equipment System (Full Equipment Selection + Equipment Upgrades)
- **Status:** Approved
- **Author:** Claude

---

## 1. Overview and Rationale (The "Why")

### Context
The Hero Builder currently allows users to select heroes and configure their skills, but lacks the ability to equip items. In Heroes of Might and Magic: Olden Era, equipment is a core part of hero builds, providing stat bonuses, special abilities, and powerful set bonuses when multiple items from the same set are equipped.

### Problem
Players cannot theorycraft complete hero builds without equipment. The in-game UI doesn't allow "what-if" planning for equipment combinations, set bonus optimization, or calculating upgrade costs before committing resources.

### Desired Outcome
Users can fully equip heroes with all available in-game items, configure upgrade levels, and see the total alchemical dust investment required. This completes the "Hero Builder Core" functionality for equipment, enabling comprehensive build theorycrafting.

### Success Metrics
- Users can equip items in all 15 equipment slots (including duplicates like 2 rings, 4 accessories)
- Users can see item set bonuses and which are active based on equipped items
- Users can plan upgrade costs before spending dust in-game

---

## 2. Functional Requirements (The "What")

### 2.1 Equipment Selection

- **As a** user, **I want to** click on an equipment slot and select an item from a searchable list, **so that** I can equip my hero with the items I'm theorycrafting.

  **Acceptance Criteria:**
  - [ ] Clicking an equipment slot opens a modal showing only items valid for that slot type
  - [ ] The modal includes a search bar that filters items by name
  - [ ] Each item in the list displays: icon, name, rarity, and a brief description of its bonuses
  - [ ] Selecting an item equips it to the slot and closes the modal
  - [ ] The equipped item's icon replaces the empty slot placeholder
  - [ ] Right-clicking an equipped item removes it from the slot

### 2.2 Equipment Slots

The following equipment slots must be available, matching the in-game layout:

| Slot Type | Count | Notes |
|-----------|-------|-------|
| Head | 1 | Helms, crowns |
| Armor | 1 | Body armor |
| Boots | 1 | Footwear |
| Belt | 1 | Belts, sashes |
| Back | 1 | Cloaks, capes |
| Left Hand | 1 | Weapons |
| Right Hand | 1 | Shields, off-hand |
| Ring | 2 | Two ring slots |
| Item Slot | 4 | Accessories, misc items |
| Unique Slot | 1 | Special/legendary items |

**Acceptance Criteria:**
- [ ] All 15 slots are visible in the equipment panel
- [ ] Each slot only accepts items of its designated type
- [ ] Slots display a placeholder icon indicating the slot type when empty

### 2.3 Item Tooltips

- **As a** user, **I want to** hover over an equipped item to see its full details, **so that** I can understand what bonuses it provides.

  **Acceptance Criteria:**
  - [ ] Hovering over an equipped item displays a tooltip with:
    - Item name and rarity
    - All item bonuses (stats, abilities, effects)
    - Current upgrade level and upgraded bonus values
    - Item set information (if applicable, see 2.6)
  - [ ] All information visible in-game tooltips is shown (no "press shift for more" - show everything)

### 2.4 Equipment Upgrades

- **As a** user, **I want to** adjust the upgrade level of equipped items, **so that** I can see how upgrades affect stats and calculate dust costs.

  **Acceptance Criteria:**
  - [ ] Each item tooltip includes +/- buttons to adjust upgrade level
  - [ ] Upgrade level cannot go below 0 or above the item's maximum level
  - [ ] Bonus values in the tooltip update to reflect the current upgrade level
  - [ ] The dust cost for the current upgrade level is displayed in the tooltip

### 2.5 Bulk Upgrade Controls

- **As a** user, **I want to** quickly set all equipped items to max level or reset all upgrades, **so that** I can easily compare fully upgraded vs base builds.

  **Acceptance Criteria:**
  - [ ] A "Max All" button sets all equipped items to their maximum upgrade level
  - [ ] A "Reset All" button sets all equipped items to upgrade level 0
  - [ ] These buttons are visible in or near the equipment panel

### 2.6 Item Sets

- **As a** user, **I want to** see item set information and which set bonuses are active, **so that** I can optimize my equipment for set synergies.

  **Acceptance Criteria:**
  - [ ] Items that belong to a set display the set name in their tooltip
  - [ ] The tooltip lists all set bonus tiers with their requirements (e.g., "2 items:", "4 items:")
  - [ ] Active bonus tiers (requirements met) are displayed in white/bright text
  - [ ] Inactive bonus tiers (requirements not met) are displayed in grey/dim text
  - [ ] The tooltip shows which items are part of the set

### 2.7 Alchemical Dust Cost Summary

- **As a** user, **I want to** see the total alchemical dust cost for all my equipped item upgrades, **so that** I can plan my resource spending.

  **Acceptance Criteria:**
  - [ ] The total dust cost for all equipped items is displayed at the bottom of the equipment panel
  - [ ] The total updates automatically when items are equipped/unequipped or upgrade levels change
  - [ ] Only equipped items are counted (not backpack items)

### 2.8 Backpack / Inventory

- **As a** user, **I want to** store items in a backpack, **so that** I can keep alternative items for quick swapping and theorycrafting different combinations.

  **Acceptance Criteria:**
  - [ ] A backpack grid (4 columns x 6 rows = 24 slots) is displayed alongside the equipment panel
  - [ ] Clicking a backpack slot opens the item selection modal (all item types available)
  - [ ] Items in the backpack retain their upgrade levels
  - [ ] Right-clicking an item in the backpack removes it

### 2.9 Drag-and-Drop

- **As a** user, **I want to** drag items between the backpack and equipment slots, **so that** I can quickly swap items without using menus.

  **Acceptance Criteria:**
  - [ ] Items can be dragged from backpack to valid equipment slots
  - [ ] Items can be dragged from equipment slots to the backpack
  - [ ] Items can be dragged between backpack slots to reorganize
  - [ ] When dragging an item, valid destination slots highlight to indicate where it can be dropped
  - [ ] Dropping an item on an occupied slot swaps the two items
  - [ ] Dropping an item on an invalid slot returns it to its original position

---

## 3. Scope and Boundaries

### In-Scope

- Full equipment selection for all 15 slots
- Item selection modal with search/filter
- Item tooltips showing all bonuses and effects
- Upgrade level adjustment (+/- buttons in tooltip)
- Bulk upgrade controls (Max All / Reset All)
- Item set display with active/inactive bonus highlighting
- Total alchemical dust cost for equipped items
- Backpack for storing alternative items
- Drag-and-drop between equipment and backpack
- Slot highlighting during drag operations

### Out-of-Scope

The following are explicitly NOT included in this specification (they are separate roadmap items):

- **Spell System** - Spell selection, loadouts, and spell upgrades
- **Army Building** - Unit/army selection and configuration
- **Build Persistence** - Saving builds to database
- **Build Sharing** - Shareable URLs for builds
- **Import/Export** - Exporting builds to portable formats
- **Equipment affecting hero stats display** - While item bonuses are shown in tooltips, they do not currently update the hero's stat display (this may be added in a future enhancement)
- **Item filtering by rarity** - Search by name is sufficient for initial release
- **Item comparison mode** - Side-by-side item comparison
