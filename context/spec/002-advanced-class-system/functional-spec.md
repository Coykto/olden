# Functional Specification: Advanced Class System

- **Roadmap Item:** Advanced Class System — Dynamic Class Progression & Class Tooltips
- **Status:** Draft
- **Author:** Claude (AI Assistant)

---

## 1. Overview and Rationale (The "Why")

### Purpose
In Heroes of Might and Magic: Olden Era, each hero class (Knight, Cleric, Death Knight, Necromancer, Overlord, Warlock, etc.) has **two possible advanced classes** that unlock powerful passive bonuses. To achieve an advanced class, the hero must learn five specific skills at Expert level. This feature brings advanced class awareness to the Hero Builder.

### Problem Statement
Users planning hero builds need to understand:
1. **What advanced classes exist** for their hero's faction and class
2. **Which skills are required** to unlock each advanced class
3. **Their current progress** toward unlocking advanced classes based on selected skills
4. **When to adjust skill choices** if they accidentally de-select a required skill

Currently, the Hero Builder shows the hero's base class icon but provides no information about advanced classes, their requirements, or the user's progress toward them.

### Desired Outcome
A fully integrated advanced class system where:
- Users see informative tooltips on the class icon explaining the base class and both possible advanced classes
- Skills contributing to an advanced class display a small indicator icon
- The hero's displayed class automatically updates when all requirements for an advanced class are met
- If a user changes skills such that the requirements are no longer met, the class reverts

### Success Criteria
- Users can hover over the class badge to see class description and both advanced class options with progress
- Users can see which skills contribute to which advanced class via small indicator icons
- The class badge visually updates when an advanced class is achieved
- All advanced class data is correctly imported from game files

---

## 2. Functional Requirements (The "What")

### 2.1 Class Tooltip Display

**As a** user building a hero, **I want to** hover over the class badge to see information about my class and advanced class options, **so that** I can understand my progression goals.

#### Tooltip Content Structure
The tooltip displays:
1. **Base Class Name** (e.g., "Cleric")
2. **Base Class Description** (e.g., "Magic Hero. Upon leveling up, most of the time gains Spell Power and Knowledge bonuses, along with skills that enhance spellcasting. Knows Heroic Strike, which is used to attack the enemies in battle. This skill's Damage scales with the hero's level.")
3. **Separator line**
4. **First Advanced Class Section:**
   - Advanced class name (e.g., "Grand Inquisitor")
   - Progress bar showing X/5 required skills
   - Bonus description (e.g., "Day and Space spells always deal maximum Damage")
5. **Second Advanced Class Section:**
   - Advanced class name (e.g., "Ascendant")
   - Progress bar showing X/5 required skills
   - Bonus description (e.g., "All the hero's spells always cost 0 mana")

#### Visual Design (matching in-game style)
- Dark background with subtle border
- Golden/yellow text for class names
- White text for descriptions
- Progress bar with gold fill on dark background
- Clear visual separation between base class info and advanced class options

**Acceptance Criteria:**
- [ ] Hovering over the class badge displays the tooltip
- [ ] Tooltip shows the base class name and description
- [ ] Tooltip shows BOTH possible advanced classes for this hero's class
- [ ] Each advanced class section shows: name, X/5 progress indicator with progress bar, and bonus description
- [ ] Progress updates dynamically as skills are added/removed/leveled
- [ ] Tooltip disappears when mouse leaves the class badge

### 2.2 Dynamic Class Progression

**As a** user, **I want** my hero's class to automatically update when I achieve an advanced class, **so that** I can see my build's progression.

#### Activation Rules
An advanced class is **achieved** when:
- The hero has **5 specific skills** at **Expert level** (level 3)
- The required skills are defined in the advanced class's `activationConditions`

#### Class Badge Updates
- When an advanced class is achieved:
  - The class badge icon changes from the base class icon to the advanced class icon
  - The class name in the hero info area updates to the advanced class name
- When skills are changed such that the requirements are no longer met:
  - The class badge reverts to the base class icon
  - The class name reverts to the base class name

**Acceptance Criteria:**
- [ ] When all 5 required skills reach Expert level, the class badge updates to the advanced class icon
- [ ] The hero's class name text updates to match the advanced class
- [ ] Removing or downgrading a required skill causes the class to revert to base class
- [ ] The transition is immediate (no animation required, but smooth transition preferred)
- [ ] Only one advanced class can be active at a time (achieving one supersedes base class)

### 2.3 Skill Advanced Class Indicators

**As a** user, **I want to** see which skills contribute to which advanced class, **so that** I can plan my skill selections accordingly.

#### Indicator Display Rules
- When a skill is part of an advanced class's requirements for the current hero's faction and class:
  - A small icon of the corresponding advanced class appears on/near the skill
  - This indicator is visible in both the skill selection modal and the skill slots
- Skills may contribute to **one or both** advanced classes (display indicators for all applicable)
- The indicator should be small and non-intrusive (similar to the in-game UI)

#### Context-Awareness
- The indicators shown depend on the **hero's faction AND class type** (might/magic)
- Example: A Temple Magic hero (Cleric) sees indicators for Grand Inquisitor and Ascendant
- Example: A Temple Might hero (Knight) sees indicators for Swashbuckler and Paragon
- The same skill may have different indicator icons for different heroes

**Acceptance Criteria:**
- [ ] Skills contributing to an advanced class show a small advanced class icon
- [ ] The icon matches the specific advanced class it contributes to
- [ ] Skills contributing to both advanced classes show both icons
- [ ] Indicators are visible in skill selection modal
- [ ] Indicators are visible on skill slots in the builder
- [ ] Indicators are specific to the current hero's faction and class type

### 2.4 Skill Selection Modal Updates

**As a** user, **I want to** see advanced class indicators in the skill selection modal, **so that** I can choose skills that progress my desired advanced class.

#### Modal Enhancements
- Each skill option in the selection modal should display:
  - (Existing) Skill icon, name, description, subskill previews
  - (New) Small advanced class icon(s) for applicable classes

**Acceptance Criteria:**
- [ ] Skill selection modal shows advanced class indicator icons next to applicable skills
- [ ] Indicators match the hero's possible advanced classes
- [ ] Icons are positioned consistently (e.g., top-right corner of skill icon or near subskill previews)

### 2.5 Game Data Import — Advanced Classes

**As a** system administrator, **I need** advanced class data imported from game files, **so that** the feature has accurate information.

#### Data to Import
For each advanced class:
- `id` (unique identifier, e.g., "ascendant", "grand_inquisitor")
- `name` (localized display name)
- `description` (bonus description text)
- `icon` (icon file reference)
- `faction` (e.g., "human", "undead", "dungeon", "unfrozen")
- `classType` (e.g., "might", "magic")
- `activationConditions`:
  - Array of required skills with their skill IDs and required level (typically 3 for Expert)

#### Database Model
A new `AdvancedClass` model (or similar) to store:
- Version reference (for game version tracking)
- ID key
- Faction
- Class type
- Icon reference
- Localized name/description
- Activation conditions (JSON or related model)
- Bonus description

**Acceptance Criteria:**
- [ ] Game data importer extracts advanced class data from decompiled game files
- [ ] All advanced classes for each faction are imported (2 per class type × number of factions)
- [ ] Activation conditions (required skills) are correctly parsed and stored
- [ ] Icons for advanced classes are extracted and stored in media folder
- [ ] Localized names and descriptions are available

---

## 3. Scope and Boundaries

### In-Scope
- Class badge tooltip showing base class and both advanced class options
- Progress indicators (X/5) for each advanced class
- Dynamic class icon/name updates when advanced class is achieved
- Automatic reversion to base class when requirements are no longer met
- Small advanced class indicator icons on contributing skills
- Game data import for advanced classes (model, importer update, icon extraction)
- Client-side state tracking for advanced class progress

### Out-of-Scope
- **Equipment System** (separate roadmap item)
- **Spell System** (separate roadmap item)
- **Army Building** (separate roadmap item)
- **Build Persistence** (separate roadmap item)
- **Build Sharing** (separate roadmap item)
- Advanced class-specific bonuses affecting calculated stats (no stat calculation in this phase)
- Visual effects or animations for class transitions (simple icon swap is sufficient)
- Mobile-specific tooltip behavior
