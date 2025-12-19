# Functional Specification: Army Building

- **Roadmap Item:** Army Building (Unit/Army Selection)
- **Status:** In Progress
- **Author:** Claude

---

## 1. Overview and Rationale (The "Why")

### Context
The Hero Builder allows users to select heroes, configure skills, equip items, and manage spells. However, heroes in HoMM: Olden Era lead armies of units into battle. The starting army composition varies by hero and can be customized throughout the game.

### Problem
Players cannot theorycraft complete army compositions alongside their hero builds. Understanding how hero stats (Attack/Defence) interact with different unit types, or planning optimal army compositions for specific strategies, requires the in-game interface.

### Desired Outcome
Users can view their hero's starting army and customize army composition with units from their faction. The army panel shows unit stats, abilities, and integrates with the hero's Attack/Defence modifiers for damage calculations.

### Success Metrics
- Users can see the hero's default starting army with unit details
- Users can add/remove units from their faction's roster
- Users can adjust unit stack sizes
- Unit stats reflect hero bonuses (Attack/Defence modifiers)

---

## 2. Functional Requirements (The "What")

### 2.1 Starting Army Display

- **As a** user, **I want to** see my hero's default starting army when I load the builder, **so that** I know what units the hero starts with.

  **Acceptance Criteria:**
  - [ ] The army panel shows all units from the hero's `startSquad` data
  - [ ] Each unit slot displays: unit icon, unit name, and stack count
  - [ ] Stack count shows as a range (e.g., "21-28") matching the hero's min/max values
  - [ ] Units are displayed in 7 slots (matching in-game army size limit)
  - [ ] Empty slots show a "+" button to add units

### 2.2 Unit Stack Management

- **As a** user, **I want to** adjust the number of units in a stack, **so that** I can plan different army sizes.

  **Acceptance Criteria:**
  - [ ] Clicking a unit stack opens a count editor
  - [ ] Users can input a specific stack count
  - [ ] Stack count affects total army value calculation
  - [ ] Users can remove a unit stack entirely (clear the slot)

### 2.3 Adding Units

- **As a** user, **I want to** add units to empty army slots, **so that** I can build custom army compositions.

  **Acceptance Criteria:**
  - [ ] Clicking an empty slot or "+" button opens a unit selection modal
  - [ ] Modal shows all units from the hero's faction
  - [ ] Units are grouped by tier (T1-T7)
  - [ ] Each unit displays: icon, name, tier, and key stats (HP, Damage, Speed)
  - [ ] Selecting a unit adds it to the army slot
  - [ ] Users cannot add the same base unit twice (but can have base + upgraded versions)

### 2.4 Unit Tooltips

- **As a** user, **I want to** see detailed unit stats on hover, **so that** I can make informed army composition decisions.

  **Acceptance Criteria:**
  - [ ] Hovering over a unit shows a detailed tooltip with:
    - Unit name and tier
    - All stats: HP, Attack, Defence, Damage (min-max), Initiative, Speed
    - Attack type (melee/ranged/magic)
    - Movement type (ground/flying)
    - Special abilities (if any)
  - [ ] Stats show base values with hero bonuses applied (if applicable)

### 2.5 Unit Upgrades Selection

- **As a** user, **I want to** choose between base and upgraded unit variants, **so that** I can plan upgrade paths.

  **Acceptance Criteria:**
  - [ ] Unit selection shows all variants: base, upgraded, and alt-upgraded
  - [ ] Upgraded units display their enhanced stats
  - [ ] Users can swap between variants for the same tier

### 2.6 Army Value Display

- **As a** user, **I want to** see the total army value, **so that** I can understand my army's strength.

  **Acceptance Criteria:**
  - [ ] Total army value is calculated from all unit stack values
  - [ ] Unit value = squad_value × stack_count
  - [ ] Total displays in the army panel header

---

## 3. User Interface (The "How it Looks")

### 3.1 Army Panel Location

The army panel appears below the hero card, in a new section between the hero card and equipment panel.

### 3.2 Army Panel Layout

```
┌─────────────────────────────────────────────────────────────┐
│ ARMY                                           Value: 1,234 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌───┐│
│  │ [U] │  │ [U] │  │ [+] │  │ [+] │  │ [+] │  │ [+] │  │[+]││
│  │ 21  │  │  4  │  │     │  │     │  │     │  │     │  │   ││
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └───┘│
│  Trogl    Medusa                                            │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Unit Selection Modal

```
┌─────────────────────────────────────────┐
│ Select Unit                          [X]│
├─────────────────────────────────────────┤
│ Tier 1                                  │
│  ┌─────┐ ┌─────┐ ┌─────┐               │
│  │Trogl│ │T.Upg│ │T.Alt│               │
│  └─────┘ └─────┘ └─────┘               │
│                                         │
│ Tier 2                                  │
│  ┌─────┐ ┌─────┐ ┌─────┐               │
│  │Assas│ │A.Upg│ │A.Alt│               │
│  └─────┘ └─────┘ └─────┘               │
│ ...                                     │
└─────────────────────────────────────────┘
```

---

## 4. Data Requirements

### 4.1 Unit Data (Already Available)
- `Unit` model contains all required fields
- Icons at `/media/gamedata/units/{id_key}.png` (partial coverage)
- Stats: hp, offence, defence, damage_min, damage_max, initiative, speed
- Faction relationship for filtering

### 4.2 Hero Starting Army
- `Hero.raw_data.startSquad`: Array of `{sid, min, max}`
- Example: `[{sid: "trogl", min: 21, max: 28}, {sid: "medusa", min: 3, max: 4}]`

### 4.3 Missing Icons
About 54 of 84 units lack direct icon matches. Fallback: use tier/faction placeholder icons.

---

## 5. Out of Scope

- Unit abilities detailed breakdown (future combat calculator feature)
- Hero Attack/Defence bonus application to unit stats (future integration)
- Army recruitment costs calculation
- Neutral units (only faction units for now)

---

## 6. Dependencies

- Existing `Unit` model in `gamedata/models.py`
- Existing `api_units` endpoint in `hero_builder/views.py`
- Hero `raw_data.startSquad` field
