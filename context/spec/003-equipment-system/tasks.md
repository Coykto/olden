# Tasks: Equipment System

## Slice 1: Equip a single item to one slot (Armor)
*Goal: Prove the end-to-end flow works for one slot type.*

- [x] **Backend: Create item bonus parsing utility**
  - [x] Create `core/item_utils.py` with `parse_item_bonuses()` function
  - [x] Add `get_item_display_name()` to look up localized item names
  - [x] Add basic unit tests for bonus parsing

- [x] **Backend: Create items API endpoint**
  - [x] Add `api_available_items` view in `hero_builder/views.py`
  - [x] Add URL route `/api/items/available/` in `hero_builder/urls.py`
  - [x] Support `slot` query parameter for filtering
  - [x] Return items with id, name, description, icon, rarity, bonuses, max_level, costs

- [x] **Frontend: Add equipment state to heroBuild**
  - [x] Extend `heroBuild` object with `equipment.slots` object (all 15 slots initialized to null)

- [x] **Frontend: Create ItemSelectionModal**
  - [x] Create `ItemSelectionModal` object following `SkillSelectionModal` pattern
  - [x] Implement `open(slotId, slotType)` - fetches items from API filtered by slot
  - [x] Implement `render()` - displays modal with item list (icon, name, rarity, bonuses)
  - [x] Implement `filter(searchText)` - client-side name filtering
  - [x] Implement `select(itemId)` and `close()`

- [x] **Frontend: Create basic EquipmentManager**
  - [x] Create `EquipmentManager` object with `init()`, `equipItem()`, `unequipItem()`, `updateUI()`
  - [x] Wire up click handler on armor slot to open `ItemSelectionModal`
  - [x] On item select, update state and show item icon in slot
  - [x] Add right-click handler to remove equipped item

- [x] **Verify:** Click armor slot → modal opens with armor items → select item → icon appears in slot → right-click removes it

---

## Slice 2: Extend to all 15 equipment slots
*Goal: All slots are functional with correct filtering.*

- [x] **Frontend: Add slot type mapping**
  - [x] Create mapping object: UI slot IDs → backend slot types (e.g., `weapon` → `left_hand`)

- [x] **Frontend: Wire up all equipment slots**
  - [x] Add click handlers to all 15 equipment slots
  - [x] Each slot passes its type to `ItemSelectionModal.open()`
  - [x] Verify each slot shows only items of the correct type

- [x] **Verify:** Each of the 15 slots opens modal with correctly filtered items

---

## Slice 3: Basic item tooltip on hover
*Goal: See item details when hovering over equipped items.*

- [x] **Frontend: Add tooltip to equipped items**
  - [x] Update `EquipmentManager.updateUI()` to render tooltip-wrapper structure
  - [x] Show item name (with rarity color), rarity label, and bonuses list
  - [x] Add CSS for item tooltip (extend existing tooltip styles)

- [x] **Verify:** Hover over equipped item → tooltip shows name, rarity, bonuses

---

## Slice 4: Equipment upgrades with dust cost
*Goal: Adjust item upgrade levels and see costs.*

- [x] **Backend: Add dust cost calculation utility**
  - [x] Add `calculate_dust_cost(cost_base, cost_per_level, level)` to `core/item_utils.py`

- [x] **Frontend: Add upgrade controls to tooltip**
  - [x] Add +/- buttons to item tooltip
  - [x] Add level display ("Level 1/2") and dust cost display
  - [x] Wire up buttons to `EquipmentManager.setItemLevel()`

- [x] **Frontend: Implement upgrade level state**
  - [x] Store `level` in equipment slot state alongside item data
  - [x] `setItemLevel()` updates level (clamped to 0-maxLevel)
  - [x] Re-render tooltip with updated bonus values and dust cost

- [x] **Backend: Update bonus parsing for levels**
  - [x] Update `parse_item_bonuses()` to accept level parameter
  - [x] Calculate scaled bonus values based on upgrade data

- [x] **Verify:** Click +/- → level changes → bonuses update → dust cost updates

---

## Slice 5: Total dust cost summary
*Goal: See total dust investment for all equipped items.*

- [x] **Frontend: Add dust cost display**
  - [x] Add dust cost total element below equipment panel
  - [x] Implement `EquipmentManager.getTotalDustCost()` - sum all equipped items
  - [x] Implement `EquipmentManager.updateDustDisplay()` - update the display

- [x] **Frontend: Auto-update on changes**
  - [x] Call `updateDustDisplay()` in `equipItem()`, `unequipItem()`, `setItemLevel()`

- [x] **Verify:** Equip items, change levels → total dust updates correctly

---

## Slice 6: Bulk upgrade controls
*Goal: Quickly max or reset all upgrades.*

- [x] **Frontend: Add bulk control buttons**
  - [x] Add "Max All" and "Reset All" buttons near equipment panel
  - [x] Implement `EquipmentManager.maxAllUpgrades()` - set all to maxLevel
  - [x] Implement `EquipmentManager.resetAllUpgrades()` - set all to 0
  - [x] Update UI and dust display after bulk operations

- [x] **Verify:** Click "Max All" → all items at max → dust total reflects this → "Reset All" → all at 0

- [x] **UI Redesign:**
  - [x] Added dust icon from game files (`resource_dust.png`)
  - [x] Updated tooltip: Level display, ⏫ upgrade with cost, ⏬ downgrade with savings, Remove button
  - [x] Updated total dust display with icon: "Total {dust_icon}: 0"

---

## Slice 7: Item set display in tooltip
*Goal: Show set information for set items.*

- [ ] **Backend: Create item sets utility**
  - [ ] Add `load_item_sets()` to `core/item_utils.py` (cached, loads from game JSON)
  - [ ] Add `get_item_set_info(set_id)` returning set name, items list, bonus tiers

- [ ] **Backend: Create item sets API endpoint**
  - [ ] Add `api_item_set_info` view
  - [ ] Add URL route `/api/item-sets/<str:set_id>/`

- [ ] **Frontend: Fetch and display set info**
  - [ ] When rendering tooltip for set item, fetch set info
  - [ ] Display set name and all bonus tiers in tooltip
  - [ ] Show which items are in the set

- [ ] **Verify:** Equip a set item → tooltip shows set name and bonus tiers

---

## Slice 8: Active/inactive set bonus highlighting
*Goal: Visually distinguish which set bonuses are active.*

- [ ] **Frontend: Track equipped set items**
  - [ ] Implement `EquipmentManager.getEquippedSetItems()` - returns count per set

- [ ] **Frontend: Highlight active bonuses**
  - [ ] When rendering set tooltip, compare equipped count to tier requirements
  - [ ] Active tiers: white/bright text
  - [ ] Inactive tiers: grey/dim text
  - [ ] Show current count vs required (e.g., "2/4 equipped")

- [ ] **Verify:** Equip 2 of 4 set items → first tier white, second tier grey

---

## Slice 9: Backpack inventory
*Goal: Store items in backpack for theorycrafting alternatives.*

- [ ] **Frontend: Add backpack state**
  - [ ] Add `equipment.backpack` array (24 slots) to `heroBuild`

- [ ] **Frontend: Backpack click handlers**
  - [ ] Click empty backpack slot → open `ItemSelectionModal` (no slot filter - all items)
  - [ ] Implement `EquipmentManager.addToBackpack(itemData, slotIndex)`
  - [ ] Show item icon in backpack slot

- [ ] **Frontend: Backpack item management**
  - [ ] Right-click backpack item → remove it
  - [ ] Backpack items retain upgrade levels
  - [ ] Hover shows same tooltip as equipped items

- [ ] **Verify:** Click backpack slot → select any item → appears in backpack → right-click removes

---

## Slice 10: Drag and drop
*Goal: Drag items between equipment and backpack.*

- [ ] **Frontend: Create DragDropManager**
  - [ ] Implement `DragDropManager` with drag event handlers
  - [ ] Make equipped items and backpack items draggable
  - [ ] Track `draggedItem` and `sourceSlot`

- [ ] **Frontend: Implement drop logic**
  - [ ] `isValidDrop()` - check slot type compatibility
  - [ ] Drop on valid empty slot → move item
  - [ ] Drop on occupied slot → swap items
  - [ ] Drop on invalid slot → return to original position

- [ ] **Frontend: Visual feedback**
  - [ ] Highlight valid drop targets when dragging
  - [ ] Add drag styling (opacity, cursor)

- [ ] **Verify:** Drag item from backpack to equipment → works. Drag between backpack slots → works. Swap equipped items via drag → works.
