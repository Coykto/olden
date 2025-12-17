# Technical Specification: Equipment System

- **Functional Specification:** `context/spec/003-equipment-system/functional-spec.md`
- **Status:** Approved
- **Author(s):** Claude

---

## 1. High-Level Technical Approach

The Equipment System will extend the existing Hero Builder with item management functionality. Following the established patterns from the Skill System implementation:

1. **Backend API:** New endpoints for fetching items and item set data, following the `/api/skills/` pattern
2. **Frontend State:** Extend `heroBuild` object with equipment and backpack state, managed by new `EquipmentManager` and `ItemSelectionModal` modules
3. **Item Sets:** Load set bonus data from game files (cached), calculate active bonuses client-side
4. **Drag-and-Drop:** Native HTML5 Drag and Drop API (with fallback to library if needed)

No new Django models required - the existing `Item` model contains all necessary data.

---

## 2. Proposed Solution & Implementation Plan (The "How")

### 2.1 Backend - API Endpoints

**New URL routes** in `hero_builder/urls.py`:

```python
path('api/items/available/', views.api_available_items, name='api_available_items'),
path('api/item-sets/<str:set_id>/', views.api_item_set_info, name='api_item_set_info'),
```

**Endpoint 1: `GET /api/items/available/`**

Query parameters:
- `slot` (optional): Filter by slot type (`head`, `armor`, `left_hand`, etc.)
- `search` (optional): Filter by item name

Response structure:
```json
{
  "items": [
    {
      "id": "chain_mail_artifact",
      "name": "Chain Mail",
      "description": "Standard protective armor",
      "icon": "chain_mail_artifact",
      "slot": "armor",
      "rarity": "common",
      "bonuses": ["+3 Defence"],
      "bonuses_raw": [...],
      "item_set": null,
      "max_level": 2,
      "cost_base": 25,
      "cost_per_level": 25
    }
  ]
}
```

**Endpoint 2: `GET /api/item-sets/<str:set_id>/`**

Response structure:
```json
{
  "id": "angelic_alliance_item_set",
  "name": "Angelic Alliance",
  "items": [
    {"id": "angelic_alliance_sword_of_judgement_artifact", "name": "Sword of Judgement", "slot": "left_hand"},
    ...
  ],
  "bonuses": [
    {
      "required_items": 2,
      "description": "+10% to all stats",
      "bonuses": [...]
    },
    {
      "required_items": 6,
      "description": "All magic schools available",
      "bonuses": [...]
    }
  ]
}
```

### 2.2 Backend - Utility Functions

**New file: `core/item_utils.py`**

```python
from functools import lru_cache
from pathlib import Path
import json
from django.conf import settings
from core.localizations import get_localizations

def parse_item_bonuses(bonuses_data: list, level: int = 1) -> list[str]:
    """
    Parse item bonuses into human-readable strings.
    Handles upgrade scaling based on level.
    """
    # Implementation details...

@lru_cache(maxsize=1)
def load_item_sets() -> dict:
    """Load and cache item set definitions from game files."""
    # Load from extracted DB/items/item_sets/item_sets.json

def get_item_set_info(set_id: str) -> dict | None:
    """Get set info with localized names and bonus descriptions."""

def calculate_dust_cost(cost_base: int, cost_per_level: int, level: int) -> int:
    """Calculate cumulative dust cost for upgrading to a given level."""
    return cost_base + (cost_per_level * level)
```

### 2.3 Frontend - State Management

**Extend `heroBuild` object** in `builder.html`:

```javascript
const heroBuild = {
    heroId: '',
    heroFaction: '',
    skills: [],
    // NEW: Equipment state
    equipment: {
        slots: {
            'unique': null,      // { id, name, icon, level, maxLevel, ... }
            'head': null,
            'back': null,
            'armor': null,
            'weapon': null,      // left_hand
            'shield': null,      // right_hand
            'belt': null,
            'boots': null,
            'ring-1': null,
            'ring-2': null,
            'accessory-1': null, // item_slot
            'accessory-2': null,
            'accessory-3': null,
            'accessory-4': null
        },
        backpack: new Array(24).fill(null)  // 4x6 grid
    }
};
```

### 2.4 Frontend - EquipmentManager Module

```javascript
const EquipmentManager = {
    init() { /* Setup click handlers, load state */ },

    // Item management
    equipItem(slotId, itemData) { /* Equip to slot */ },
    unequipItem(slotId) { /* Remove from slot */ },
    swapItems(slotA, slotB) { /* Swap two slots */ },

    // Backpack
    addToBackpack(itemData, slotIndex) { /* Add item */ },
    removeFromBackpack(slotIndex) { /* Remove item */ },

    // Upgrades
    setItemLevel(slotId, level) { /* Change upgrade level */ },
    maxAllUpgrades() { /* Set all equipped to max */ },
    resetAllUpgrades() { /* Set all equipped to 0 */ },

    // Calculations
    getTotalDustCost() { /* Sum of equipped item dust costs */ },
    getEquippedSetItems() { /* Group equipped items by set */ },

    // UI
    updateUI() { /* Render all slots and backpack */ },
    updateDustDisplay() { /* Update total dust counter */ }
};
```

### 2.5 Frontend - ItemSelectionModal Module

Following `SkillSelectionModal` pattern:

```javascript
const ItemSelectionModal = {
    allItems: [],
    currentSlot: null,
    currentSlotType: null,

    async open(slotId, slotType) {
        // Map UI slot names to API slot types
        const apiSlotType = this.mapSlotType(slotType);
        const response = await fetch(`/api/items/available/?slot=${apiSlotType}`);
        const data = await response.json();
        this.allItems = data.items;
        this.render();
    },

    mapSlotType(uiSlot) {
        // 'weapon' -> 'left_hand', 'shield' -> 'right_hand', etc.
    },

    render() { /* Modal with search and item list */ },
    filter(searchText) { /* Client-side name filtering */ },
    select(itemId) { /* Equip and close */ },
    close() { /* Remove modal */ }
};
```

### 2.6 Frontend - Item Tooltips

Enhanced tooltip structure for equipped items:

```html
<div class="item-tooltip">
    <div class="tooltip-header">
        <span class="item-name rarity-{rarity}">{name}</span>
        <span class="item-rarity">{rarity}</span>
    </div>
    <div class="tooltip-bonuses">
        <div class="bonus-line">+3 Defence</div>
        <div class="bonus-line upgraded">+1 per level</div>
    </div>
    <div class="tooltip-upgrade">
        <button class="upgrade-btn minus">-</button>
        <span class="level-display">Level 1/2</span>
        <button class="upgrade-btn plus">+</button>
        <span class="dust-cost">25 dust</span>
    </div>
    <!-- If item has set -->
    <div class="tooltip-set">
        <div class="set-name">Angelic Alliance (1/6)</div>
        <div class="set-bonus inactive">(2) +10% stats</div>
        <div class="set-bonus inactive">(6) All magic schools</div>
    </div>
</div>
```

### 2.7 Frontend - Drag and Drop

Using HTML5 Drag and Drop API:

```javascript
const DragDropManager = {
    draggedItem: null,
    sourceSlot: null,

    init() {
        // Make all item slots draggable
        document.querySelectorAll('.equip-slot, .backpack-slot').forEach(slot => {
            slot.addEventListener('dragstart', this.onDragStart.bind(this));
            slot.addEventListener('dragover', this.onDragOver.bind(this));
            slot.addEventListener('dragleave', this.onDragLeave.bind(this));
            slot.addEventListener('drop', this.onDrop.bind(this));
            slot.addEventListener('dragend', this.onDragEnd.bind(this));
        });
    },

    onDragStart(e) {
        // Store dragged item info
        // Add dragging class
    },

    onDragOver(e) {
        // Check if valid drop target
        // Highlight if valid
        e.preventDefault();  // Allow drop
    },

    onDrop(e) {
        // Handle equip/swap logic
        // Update state via EquipmentManager
    },

    isValidDrop(sourceSlot, targetSlot) {
        // Check slot type compatibility
    }
};
```

### 2.8 Slot Type Mapping

Mapping between UI slot IDs and backend `Item.slot` values:

| UI Slot ID | Backend Slot Type |
|------------|-------------------|
| `unique` | `unic_slot` |
| `head` | `head` |
| `back` | `back` |
| `armor` | `armor` |
| `weapon` | `left_hand` |
| `shield` | `right_hand` |
| `belt` | `belt` |
| `boots` | `boots` |
| `ring-1`, `ring-2` | `ring` |
| `accessory-1` to `accessory-4` | `item_slot` |

---

## 3. Impact and Risk Analysis

### System Dependencies

- **Existing Item model** - Read-only dependency, no changes needed
- **Game data files** - Item sets loaded from `DB/items/item_sets/item_sets.json`
- **Localization system** - Extend `core/localizations.py` for item name/description lookup
- **Existing builder.html** - Equipment slots already exist as placeholders

### Potential Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Drag-drop browser compatibility | Low | Medium | Test on major browsers; have click-to-move fallback |
| Performance with 300+ items in modal | Low | Low | Client-side filtering is fast; consider lazy loading if issues arise |
| Item icon extraction incomplete | Medium | Medium | Verify all icons exist; add placeholder for missing |
| Item set data parsing errors | Low | Medium | Validate JSON on load; graceful fallback to "no set" |

### Open Questions

1. **Item icons and upgrades:** Do item icons change with upgrade level? Current extraction shows single icons per item. May need visual upgrade level indicator (badge/overlay) instead of different icons.

---

## 4. Testing Strategy

### Unit Tests (Python)

- `test_parse_item_bonuses()` - Verify bonus string formatting
- `test_calculate_dust_cost()` - Verify cumulative cost calculation
- `test_load_item_sets()` - Verify set data loading and caching
- `test_api_available_items()` - API response structure and filtering

### Integration Tests

- API endpoints return valid JSON with correct structure
- Slot type filtering returns only matching items
- Item set endpoint returns complete set info

### Manual Testing Checklist

- [ ] Click each equipment slot, verify correct items shown
- [ ] Search filters items by name
- [ ] Equipping item shows icon in slot
- [ ] Right-click removes equipped item
- [ ] Hover shows tooltip with bonuses
- [ ] +/- buttons change upgrade level (within bounds)
- [ ] Dust cost updates correctly
- [ ] "Max All" and "Reset All" work
- [ ] Set items show set info in tooltip
- [ ] Active set bonuses highlighted vs inactive
- [ ] Drag from backpack to equipment works
- [ ] Drag from equipment to backpack works
- [ ] Invalid drop target rejects item
- [ ] Swap works when dropping on occupied slot
