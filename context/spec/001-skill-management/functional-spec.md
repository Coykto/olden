# Functional Specification: Skill Management System

- **Roadmap Item:** Implement skill plus icons for leveling up skills and selecting subskills
- **Status:** Draft
- **Author:** Claude (AI Assistant)

---

## 1. Overview and Rationale (The "Why")

### Purpose
The hero builder currently displays skill slots with "plus" icons that are non-functional. This feature will bring these icons to life, allowing users to:
1. **Add new skills** to their hero build (big plus icons)
2. **Level up existing skills** and select subskills (small plus icons next to skills)

### Problem Statement
Users building hero configurations need to plan skill progression beyond the hero's starting skills. Currently, there is no way to:
- Add additional skills to the 8 available skill slots
- Upgrade skills from Basic to Advanced to Expert
- Choose subskills that unlock when leveling up

### Desired Outcome
A fully interactive skill management system where users can build complete hero skill configurations, including all 8 potential skills and their subskill selections, for theorycraft and build planning purposes.

### Success Criteria
- Users can add skills to empty slots from a searchable list
- Users can level up skills and select subskills through modal dialogs
- The UI visually reflects skill levels and selected subskills
- All interactions are client-side only (no database persistence required)

---

## 2. Functional Requirements (The "What")

### 2.1 Adding New Skills (Big Plus Icons)

**As a** user planning a hero build, **I want to** click an empty skill slot to add a new skill, **so that** I can configure my hero's complete skill loadout.

#### User Flow
1. User clicks a "big plus" icon in an empty skill slot
2. A modal dialog appears showing available skills
3. User can search/filter skills by typing
4. User selects a skill
5. Skill is added at Basic level (level 1)
6. Modal closes, skill appears in the slot

#### Modal Design (matching in-game style)
- Header: "SELECT SKILL" or similar
- Search input field at the top for filtering by skill name
- Scrollable list of skill options
- Each skill option displays:
  - Skill icon
  - Skill name with level prefix (e.g., "BASIC LOGISTICS")
  - Skill description
  - Small subskill icons on the right side showing available subskills
- Selected option is highlighted
- Confirm/Cancel buttons

#### Skill Availability Rules
- **Include:**
  - All Common skills not already learned
  - All Class skills not already learned
  - The hero's own faction skill (if not already learned)
- **Exclude:**
  - Skills the hero already has
  - Other factions' faction skills (e.g., Temple hero cannot learn Necromancy)

**Acceptance Criteria:**
- [ ] Clicking an empty skill slot opens the skill selection modal
- [ ] Modal displays a search input field
- [ ] Typing in search field filters skills by name (case-insensitive)
- [ ] Skills are displayed with icon, name, description, and subskill preview icons
- [ ] Other factions' faction skills are NOT shown in the list
- [ ] Selecting a skill and confirming adds it at Basic (level 1)
- [ ] The modal closes after selection
- [ ] The new skill appears in the clicked slot with its icon
- [ ] The two subskill plus buttons next to the new skill become interactive (first enabled, second disabled)

### 2.2 Leveling Up Skills (Small Plus Icons)

**As a** user, **I want to** click the small plus icon next to a skill to level it up, **so that** I can upgrade my skills and choose subskills.

#### Skill Level Progression
- **Level 1 (Basic):** Starting level when skill is added
- **Level 2 (Advanced):** First upgrade, unlocks first subskill selection
- **Level 3 (Expert):** Second upgrade, unlocks second subskill selection

#### Small Plus Button States

| Skill Level | First Plus (Top) | Second Plus (Bottom) |
|-------------|------------------|----------------------|
| Basic (1)   | Enabled (→ Advanced) | Disabled |
| Advanced (2) | Shows subskill icon | Enabled (→ Expert) |
| Expert (3)  | Shows subskill icon | Shows subskill icon |

#### User Flow for Leveling Up
1. User clicks an enabled small plus button
2. A modal dialog appears showing:
   - The upgraded skill info at the top (e.g., "ADVANCED LOGISTICS, +15% Movement Points")
   - 3 subskill options below to choose from
3. Each subskill shows:
   - Subskill icon
   - Subskill name
   - Subskill description/bonus
4. User selects one subskill
5. Modal closes
6. Skill level increases
7. The plus button that was clicked now shows the selected subskill's icon
8. Next plus button becomes enabled (if applicable)

**Acceptance Criteria:**
- [ ] Clicking the first plus (when skill is Basic) opens the level-up modal
- [ ] Modal displays the Advanced-level skill info at the top
- [ ] Modal displays the subskill options for level 2
- [ ] Selecting a subskill levels up the skill to Advanced (level 2)
- [ ] The first plus button changes from "+" to the selected subskill's icon
- [ ] The second plus button becomes enabled
- [ ] Clicking the second plus (when skill is Advanced) opens the Expert level-up modal
- [ ] After selecting an Expert subskill, both plus buttons show subskill icons
- [ ] Both plus buttons are disabled/non-interactive when at Expert level

### 2.3 Removing Skills

**As a** user, **I want to** be able to remove a skill I've added, **so that** I can reconfigure my build.

**Acceptance Criteria:**
- [ ] Right-clicking (or long-pressing on mobile) a skill slot shows a context menu or tooltip with "Remove" option
- [ ] Clicking "Remove" clears the skill slot back to an empty "+" state
- [ ] Removed skill becomes available again in the skill selection modal
- [ ] Starting skills (those the hero begins with) cannot be removed

### 2.4 Visual Feedback

#### Skill Slot Display States

1. **Empty Slot:** Large "+" icon, both subskill buttons disabled
2. **Skill at Basic:** Skill icon displayed, first subskill "+" enabled, second disabled
3. **Skill at Advanced:** Skill icon with "2" indicator or border, first subskill shows icon, second "+" enabled
4. **Skill at Expert:** Skill icon with "3" indicator or border, both subskill buttons show icons

#### Skill Icon Variations
- Basic: Uses base skill icon (e.g., `skill_logistics.png`)
- Advanced: Uses `_2` suffix icon (e.g., `skill_logistics_2.png`)
- Expert: Uses `_3` suffix icon (e.g., `skill_logistics_3.png`)

**Acceptance Criteria:**
- [ ] Skill icons update to show the correct level variant
- [ ] Subskill buttons display the selected subskill icon when filled
- [ ] Disabled buttons are visually muted (opacity, color change)
- [ ] Hovering over a skill or subskill shows a tooltip with name and description

### 2.5 State Management (Client-Side)

The build state should be maintained in JavaScript client-side state:

```
heroBuild = {
  skills: [
    {
      skillId: "skill_logistics",
      level: 2,  // 1=Basic, 2=Advanced, 3=Expert
      subskills: ["subskill_secret_passages", null]  // selected subskill IDs, null if not yet selected
    },
    ...
  ]
}
```

**Acceptance Criteria:**
- [ ] Build state is stored in client-side JavaScript
- [ ] State persists during the browser session (page navigation within the app should not lose state)
- [ ] No database calls are made for saving/loading build state
- [ ] Refreshing the page resets to the hero's starting configuration

---

## 3. Scope and Boundaries

### In-Scope
- Adding new skills via modal with search functionality
- Leveling up skills (Basic → Advanced → Expert)
- Selecting subskills when leveling up
- Visual updates to reflect skill levels and subskills
- Removing added skills (not starting skills)
- Tooltips showing skill/subskill details
- Client-side state management

### Out-of-Scope
- Database persistence of builds (separate roadmap item)
- Sharing builds via URL (separate roadmap item)
- Equipment system (separate feature)
- Unit/Army selection (separate feature)
- Spell selection (separate feature)
- Build import/export functionality
- Skill recommendations or build guides
- Mobile-specific gesture handling (long-press will use standard browser behavior)
- Undo/redo functionality