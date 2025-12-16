# Tasks: Skill Management System

## Slice 1: Add Empty Skill Modal (UI Only)
The smallest piece of visible value - clicking a "big plus" opens a modal, but with no data yet.

- [x] Add modal container `<div id="skill-modal-container">` to `builder.html`
- [x] Add modal CSS styles (overlay, modal box, close button)
- [x] Add JavaScript to open/close an empty modal when clicking a skill slot "+"
- [x] Ensure modal closes on overlay click and Escape key

## Slice 2: API Endpoint for Available Skills
Backend API that returns learnable skills for a hero.

- [x] Create `api_available_skills` view in `hero_builder/views.py`
- [x] Implement faction filtering (exclude other factions' faction skills)
- [x] Implement `exclude` parameter to filter already-selected skills
- [x] Add URL route `/api/skills/available/`
- [ ] Write unit tests for faction filtering and exclusion logic

## Slice 3: Populate Skill Selection Modal with Real Data
Connect the modal to the API and display actual skills.

- [x] Fetch skills from API when modal opens
- [x] Render skill options (icon, name, description, subskill previews)
- [x] Add search input with client-side filtering
- [x] Style skill options to match game UI (dark theme)

## Slice 4: Add Skill to Slot (State Management)
Selecting a skill updates the UI - the slot shows the selected skill icon.

- [x] Create `heroBuild` state object in JavaScript
- [x] Create `SkillManager.init()` to initialize state from hero's starting skills
- [x] Create `SkillManager.addSkill()` to add skill to state
- [x] Create `SkillManager.updateUI()` to render skill icons in slots
- [x] Wire up modal selection to call `addSkill()` and close modal

## Slice 5: API Endpoint for Subskills
Backend API that returns subskill options for a skill level-up.

- [x] Create `api_skill_subskills` view in `hero_builder/views.py`
- [x] Return upgraded skill info (name, description, icon at new level)
- [x] Return subskill options from `raw_data['parametersPerLevel']`
- [x] Add URL route `/api/skills/<skill_id>/level/<level>/subskills/`
- [ ] Write unit tests for subskill retrieval

## Slice 6: Subskill Selection Modal (Level Up)
Clicking a small "+" opens a modal to select a subskill.

- [x] Create `SubskillSelectionModal` JavaScript object
- [x] Fetch subskills from API when modal opens
- [x] Render upgraded skill at top of modal
- [x] Render subskill options below
- [x] Add CSS styles matching game UI (highlighted skill, option cards)

## Slice 7: Level Up Skill with Subskill Selection
Selecting a subskill levels up the skill and updates UI.

- [x] Create `SkillManager.levelUpSkill()` function
- [x] Update skill level and store selected subskill ID in state
- [x] Update `updateUI()` to show subskill icon in small button
- [x] Enable/disable small "+" buttons based on skill level

## Slice 8: Remove Skill Functionality
Right-click a skill to remove it (except starting skills).

- [x] Add context menu or tooltip with "Remove" option on right-click
- [x] Create `SkillManager.removeSkill()` function
- [x] Prevent removal of starting skills
- [x] Reset slot to empty "+" state after removal

## Slice 9: Tooltips and Polish
Add hover tooltips and visual refinements.

- [x] Add tooltip on skill hover showing name and description
- [x] Add tooltip on subskill button hover
- [x] Ensure disabled buttons have correct visual styling (opacity)
- [x] Test all interactions and fix any edge cases
