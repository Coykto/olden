# Tasks: Advanced Class System

## Slice 1: Database Model & Basic Import
*Goal: Advanced class data exists in the database and can be viewed in Django admin.*

- [x] **1.1** Add `AdvancedClass` model to `gamedata/models.py`
  - [x] Fields: version, id_key, faction (FK), class_type, icon, activation_conditions (JSON), required_skill_ids (JSON), bonuses (JSON), raw_data (JSON)
  - [x] Meta: unique_together, indexes, ordering
  - [x] Properties: `icon_url`, `display_info`
- [x] **1.2** Create and run database migration
- [x] **1.3** Register `AdvancedClass` in Django admin (`gamedata/admin.py`)
- [x] **1.4** Add `get_all_advanced_classes()` to `GameDataReader` (`core/data_reader.py`)
- [x] **1.5** Add `get_advanced_class_info()` to localizations (`core/localizations.py`)
- [x] **1.6** Add `_import_advanced_classes()` to import command (`gamedata/management/commands/import_gamedata.py`)
- [x] **1.7** Extract advanced class icons to `media/gamedata/advanced_classes/` (update asset extractor)
- [x] **1.8** Test: Run import, verify data in Django admin

---

## Slice 2: API Endpoints
*Goal: Frontend can fetch advanced class data via API.*

- [x] **2.1** Add `api_advanced_classes()` view in `hero_builder/views.py`
  - [x] Returns advanced classes filtered by faction and class_type
- [x] **2.2** Add `api_advanced_class_skill_indicators()` view
  - [x] Returns mapping of skill IDs to advanced class indicators
- [x] **2.3** Register URL routes in `hero_builder/urls.py`
- [x] **2.4** Test: Verify API responses with browser/curl

---

## Slice 3: Class Badge Tooltip
*Goal: Hovering over the class badge shows tooltip with base class and both advanced classes (static progress 0/5).*

- [x] **3.1** Add `AdvancedClassManager` JavaScript module in `builder.html`
  - [x] Fetch advanced class data on page load
  - [x] Store in client-side cache
- [x] **3.2** Add `ClassTooltip` JavaScript component
  - [x] Render tooltip HTML with base class info
  - [x] Show both advanced classes with names, descriptions, progress bars (hardcoded 0/5 for now)
- [x] **3.3** Add CSS styles for tooltip (dark background, gold text, progress bars)
- [x] **3.4** Attach hover events to `.class-badge` element
- [x] **3.5** Test: Hover over class badge, verify tooltip appears with correct data

---

## Slice 4: Dynamic Progress Calculation
*Goal: Progress bars update live as user adds/removes/levels skills.*

- [x] **4.1** Add `calculateProgress(advancedClass, heroSkills)` function to `AdvancedClassManager`
- [x] **4.2** Integrate progress calculation into `ClassTooltip` rendering
- [x] **4.3** Call progress update on every `SkillManager.updateUI()` execution
- [x] **4.4** Test: Add skills at Expert level, verify progress bar updates (e.g., 2/5 → 3/5)

---

## Slice 5: Dynamic Class Badge Update
*Goal: Class badge icon and name change when advanced class is achieved.*

- [x] **5.1** Add `checkEligibility()` function to determine if any advanced class is achieved
- [x] **5.2** Store current active advanced class in `heroBuild` state
- [x] **5.3** Update class badge `<img>` src when advanced class achieved
- [x] **5.4** Update class name text (`.hero-class` span) when advanced class achieved
- [x] **5.5** Revert to base class when requirements no longer met
- [x] **5.6** Test: Level 5 required skills to Expert → badge changes; remove one → badge reverts

---

## Slice 6: Skill Indicator Icons
*Goal: Skills show small advanced class icons indicating which class they contribute to.*

- [x] **6.1** Fetch skill indicators from `/api/advanced-classes/skill-indicators/` on page load
- [x] **6.2** Update skill slot rendering to overlay indicator icons on applicable skills
- [x] **6.3** Update skill selection modal to show indicator icons next to applicable skills
- [x] **6.4** Add CSS for indicator icon positioning (small, non-intrusive)
- [x] **6.5** Test: Verify indicators appear on correct skills in both modal and builder slots



.hero-specialty {
    color: #d4af37;
    font-size: 0.8rem;
    font-style: italic;
    line-height: 1.3;
    margin-bottom: 8px;
}