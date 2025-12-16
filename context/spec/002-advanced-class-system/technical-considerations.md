# Technical Specification: Advanced Class System

- **Functional Specification:** `context/spec/002-advanced-class-system/functional-spec.md`
- **Status:** Draft
- **Author(s):** Claude (AI Assistant)

---

## 1. High-Level Technical Approach

This feature adds advanced class awareness to the Hero Builder through:

1. **Database Layer:** New `AdvancedClass` model storing class definitions with activation conditions
2. **Data Import Layer:** Extended importer to extract advanced class data and icons from game files
3. **API Layer:** Two new endpoints for fetching advanced classes and skill-to-class mappings
4. **Frontend Layer:** JavaScript modules for progress tracking, tooltip rendering, skill indicators, and dynamic class badge updates

All advanced class logic runs client-side after initial data fetch, ensuring responsive UI updates as users modify skills.

---

## 2. Proposed Solution & Implementation Plan

### 2.1 Data Model / Database Changes

**New Model: `AdvancedClass`** in `gamedata/models.py`

| Field | Type | Purpose |
|-------|------|---------|
| `version` | FK(GameVersion) | Game version tracking |
| `id_key` | CharField(100) | Unique identifier |
| `faction` | FK(Faction) | Faction this class belongs to |
| `class_type` | CharField(20) | "might" or "magic" |
| `icon` | CharField(100) | Icon filename |
| `activation_conditions` | JSONField | Full activation requirements array |
| `required_skill_ids` | JSONField | Pre-extracted skill IDs list |
| `bonuses` | JSONField | Bonus effects |
| `raw_data` | JSONField | Complete raw data |

**Indexes:** `(version, faction, class_type)` for filtered queries

**Migration:** Standard Django migration creating `gamedata_advancedclass` table

### 2.2 Data Import Extensions

**GameDataReader** (`core/data_reader.py`):
- Add `get_all_advanced_classes()` method
- Read from `heroes_sub_classes/sub_classes_{faction}.json` files

**Import Command** (`gamedata/management/commands/import_gamedata.py`):
- Add `_import_advanced_classes()` method
- Extract `required_skill_ids` from `activationConditions` for quick lookups
- Call after faction/skill imports (dependency order)

**Asset Extractor** (`core/asset_extractor.py`):
- Extract advanced class icons to `media/gamedata/advanced_classes/`

**Localizations** (`core/localizations.py`):
- Add `get_advanced_class_info(class_id)` function
- Pattern: `{class_id}_name`, `{class_id}_desc` keys

### 2.3 API Contracts

#### `GET /api/advanced-classes/`
- **Params:** `faction`, `class_type`
- **Returns:** List of advanced classes with id, name, description, icon_url, required_skills, activation_conditions

#### `GET /api/advanced-classes/skill-indicators/`
- **Params:** `faction`, `class_type`
- **Returns:** Mapping of skill IDs to their advanced class indicators (class_id, icon_url)

### 2.4 Frontend Components

**AdvancedClassManager** (JavaScript):
- Fetches and caches advanced class data on page load
- Calculates progress for each advanced class
- Checks eligibility when skills change
- Updates class badge when advanced class achieved/lost

**ClassTooltip** (JavaScript):
- Renders tooltip with base class info + both advanced classes
- Progress bars showing X/5
- Hover event handlers on class badge

**SkillIndicators** (JavaScript):
- Fetches skill-to-class mapping on page load
- Overlays small icons on skills in modal and builder slots

### 2.5 Logic / Algorithm

**Progress Calculation:** Count required skills at Expert level (0-5)

**Eligibility Check:** First advanced class with progress=5 wins; run on every skill change

---

## 3. Impact and Risk Analysis

### System Dependencies
- `gamedata` app: New model, migration, importer
- `core` app: Localization function, asset extraction
- `hero_builder` app: API endpoints, builder.html JavaScript
- Media folder: New `advanced_classes/` directory

### Risks & Mitigations
- **Missing game files:** Graceful skip with warning
- **Missing localizations:** Fallback to formatted id_key
- **Missing icons:** Placeholder icon
- **Performance:** Client-side calculation is O(10) per update

---

## 4. Testing Strategy

### Backend
- Model creation and `check_eligibility()` method
- Import with valid/missing data
- API responses for various faction/class combinations

### Frontend (Manual)
- Tooltip display and progress updates
- Class badge changes on eligibility
- Skill indicator rendering in modal and slots
