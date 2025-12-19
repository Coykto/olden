# Implementation Tasks: Army Building

## Phase 1: Backend

- [ ] **1.1** Add `icon_url` property to Unit model (`gamedata/models.py`)
- [ ] **1.2** Create `api_faction_units` endpoint (`hero_builder/views.py`)
- [ ] **1.3** Add URL route for faction units API (`hero_builder/urls.py`)
- [ ] **1.4** Extend `api_hero_data` to include `start_squad`

## Phase 2: Frontend Structure

- [ ] **2.1** Create `_army.html` partial template
- [ ] **2.2** Create `army.css` styles (or add to `builder.css`)
- [ ] **2.3** Include army partial in `builder.html`

## Phase 3: JavaScript

- [ ] **3.1** Create `army-builder.js` module with ArmyBuilder class
- [ ] **3.2** Implement starting army population
- [ ] **3.3** Implement unit tooltips
- [ ] **3.4** Implement army value calculation
- [ ] **3.5** Implement unit selection modal
- [ ] **3.6** Implement unit count editor

## Phase 4: Polish

- [ ] **4.1** Handle missing unit icons (placeholder fallback)
- [ ] **4.2** Ensure responsive layout
- [ ] **4.3** Match existing UI patterns (colors, borders, fonts)

## Phase 5: Testing

- [ ] **5.1** Test starting army loads correctly for different heroes
- [ ] **5.2** Test unit selection modal opens and shows faction units
- [ ] **5.3** Test unit tooltips display correct stats
- [ ] **5.4** Test army value calculation
- [ ] **5.5** Test add/remove units
- [ ] **5.6** Test count adjustment
