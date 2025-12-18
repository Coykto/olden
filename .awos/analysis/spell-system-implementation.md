# Spell System Implementation Analysis

**Date:** 2025-12-18
**Analyst:** Claude Code
**Purpose:** Technical analysis for implementing the Spell System in Olden Forge

---

## Executive Summary

The Spell System implementation requires minimal model changes (the `Spell` model already exists) and focuses on creating API endpoints and frontend integration. The existing description transpiler **already includes spell description functions** (`current_magic_*`), so we can reuse the entire item description pipeline with minor adjustments.

**Key Finding:** 90% of the infrastructure already exists. We primarily need to:
1. Create API endpoints for spell data (similar to items)
2. Add helper functions in `core/localizations.py` for spell info
3. Integrate spells into the frontend using existing patterns

---

## 1. Existing Spell Data Model

### Location: `gamedata/models.py` (lines 438-461)

```python
class Spell(models.Model):
    """Represents a magic spell in the game."""
    SCHOOL_CHOICES = [
        ('day', 'Day Magic'),
        ('night', 'Night Magic'),
        ('space', 'Space Magic'),
        ('primal', 'Primal Magic'),
        ('neutral', 'Neutral Magic'),
    ]

    version = models.ForeignKey(GameVersion, on_delete=models.CASCADE, related_name='spells')
    id_key = models.CharField(max_length=100, help_text="Spell identifier from game files")
    school = models.CharField(max_length=20, choices=SCHOOL_CHOICES, blank=True)
    level = models.IntegerField(default=1)  # Spell rank (1-4)

    # Raw JSON data for spell effects, costs, etc.
    raw_data = models.JSONField(help_text="Complete raw spell data from game files")

    class Meta:
        ordering = ['version', 'school', 'level', 'id_key']
        unique_together = [['version', 'id_key']]
```

### Current State
- **Total Spells:** 129 spells imported
- **Schools:** day (23), neutral (33), night (25), primal (24), space (24)
- **Data Import:** Already implemented in `gamedata/management/commands/import_gamedata.py:391-423`

### Sample Raw Data Structure

```json
{
  "id": "day_10_magic_second_song",
  "name": "day_10_magic_second_song_name",
  "icon": "day_10_magic_second_song",
  "description": [
    "day_10_magic_second_song_description",
    "day_10_magic_second_song_description_1",
    "day_10_magic_second_song_description_2",
    "day_10_magic_second_song_description_3"
  ],
  "school_": "day",
  "rank": 3,
  "learnCost": [
    {"name": "gemstones", "cost": 6},
    {"name": "crystals", "cost": 6},
    {"name": "mercury", "cost": 6}
  ],
  "upgradeCost": [25, 25, 25],
  "manaCost": [12, 12, 12, 12],
  "battleMagic": { /* combat effects */ },
  "bonusDescriptions": [
    {"level": 2, "description": "day_10_magic_second_song_description_up_level_bonus_2"},
    {"level": 3, "description": "day_10_magic_second_song_description_up_level_bonus_3"},
    {"level": 4, "description": "description_up_effect_allies_all"}
  ]
}
```

**Key Observation:** Spells have multiple description keys:
- Base description (array of keys for levels 1-4)
- Bonus descriptions (upgrade level descriptions)
- Multiple localization keys for different upgrade levels

### Model Analysis

**✅ Strengths:**
- Model structure is appropriate for spell data
- `raw_data` JSONField stores complete spell configuration
- School categorization is correct
- Version FK enables multi-version support

**⚠️ Recommended Enhancements:**
1. Add `rank` field (extracted from `raw_data.rank`) for spell tier filtering
2. Add `usedOnMap` boolean (from `raw_data.usedOnMap`) to distinguish battle/world spells
3. Add `mana_cost_base` integer (from `raw_data.manaCost[0]`) for quick filtering
4. Consider adding indexed fields for common filters (school + rank combinations)

**Note:** These enhancements are **optional** for initial implementation. The current model is sufficient using `raw_data` queries.

---

## 2. Game Data Import

### Location: `gamedata/management/commands/import_gamedata.py`

**Import Function:** `_import_spells()` (lines 391-423)

**Current Implementation:**
```python
def _import_spells(self, reader: GameDataReader, version: GameVersion):
    """Import spell data."""
    spells_data = reader.get_all_spells()

    spell_objects = []
    for spell_data in spells_data:
        # Infer school from id_key or raw data
        school = ""
        spell_id = spell_data.get("id", "")

        if "day" in spell_id or spell_data.get("school") == "day":
            school = "day"
        # ... (similar logic for other schools)

        spell_objects.append(Spell(
            version=version,
            id_key=spell_data["id"],
            school=school,
            level=spell_data.get("level", 1),
            raw_data=spell_data
        ))

    Spell.objects.bulk_create(spell_objects)
```

**Data Source:** `core/data_reader.py:145-155`

```python
def get_all_spells(self) -> List[Dict[str, Any]]:
    """Get all magic/spell data from magics directory."""
    spells = []
    magics_dir = self.extract_to / "magics"

    for json_file in magics_dir.rglob("*.json"):
        data = self.read_json(json_file.relative_to(self.extract_to))
        if "array" in data:
            spells.extend(data["array"])

    return spells
```

**✅ Status:** Import is complete and working (129 spells successfully imported)

**⚠️ Enhancement Opportunities:**
1. Extract `rank` from `raw_data.rank` during import
2. Extract `usedOnMap` flag
3. Add validation for required fields in `raw_data`
4. Log warnings for missing localization keys

---

## 3. Description Transpiler System

### Spell Description Functions in Generated Code

**Location:** `static/js/generated/description_functions.js`

**Functions Found:**
```javascript
// Mana cost functions
DescriptionFunctions["current_magic_upgrade_0_param_mana_cost"]
DescriptionFunctions["current_magic_upgrade_1_param_mana_cost"]
DescriptionFunctions["current_magic_upgrade_2_param_mana_cost"]
DescriptionFunctions["current_magic_upgrade_3_param_mana_cost"]

// Damage functions
DescriptionFunctions["current_magic_upgrade_0_param_damage_base"]
DescriptionFunctions["current_magic_upgrade_1_param_damage_base"]
DescriptionFunctions["current_magic_upgrade_2_param_damage_base"]

// Healing functions
DescriptionFunctions["current_magic_baseHeal"]
DescriptionFunctions["current_magic_healPerCount"]

// And many more...
```

**Transpiler Source Files:** `transpiler/src/index.ts:36-49`

```typescript
// Magic script files already included in transpilation
'DB/info/info_script_magic/magic_info.script',
'DB/info/info_script_magic/magic_battle.script',
'DB/info/info_script_magic/magic_battle_alts.script',
'DB/info/info_script_magic/magic_battle_day.script',
'DB/info/info_script_magic/magic_battle_night.script',
'DB/info/info_script_magic/magic_battle_neutral.script',
'DB/info/info_script_magic/magic_battle_primal.script',
'DB/info/info_script_magic/magic_battle_space.script',
'DB/info/info_script_magic/magic_world_day.script',
'DB/info/info_script_magic/magic_world_neutral.script',
'DB/info/info_script_magic/magic_world_night.script',
'DB/info/info_script_magic/magic_world_primal.script',
'DB/info/info_script_magic/magic_world_space.script',
```

**✅ Status:** Spell description functions are **already transpiled and available**

**No transpiler changes needed!** The existing system fully supports spell descriptions.

---

## 4. Localization System

### Spell Text Files

**Location:** `StreamingAssets/Lang/english/texts/magic.json`

**Structure:**
```json
{
  "tokens": [
    {"sid": "magic_type_healing", "text": "Recovery"},
    {"sid": "day", "text": "Daylight Magic"},
    {"sid": "day_10_magic_second_song_name", "text": "Second Song"},
    {"sid": "day_10_magic_second_song_description", "text": "Resets the next turn delay for one ally..."}
  ]
}
```

### Spell Args Files

**Location:** `StreamingAssets/Lang/args/magic.json`

**Structure:**
```json
{
  "tokensArgs": [
    {
      "sid": "alt_text_healing_amount",
      "args": ["current_magic_baseHeal", "current_magic_healPerCount"]
    },
    {
      "sid": "day_01_magic_blessing_description",
      "args": ["current_magic_upgrade_0_param_offence_percent"]
    }
  ]
}
```

**✅ Both files exist and follow the same pattern as items**

### Required Function in `core/localizations.py`

**Pattern to Follow:** `get_item_info()` (lines 503-542)

**New Function Needed:**

```python
@lru_cache(maxsize=1)
def get_spell_args(lang: str = "english") -> dict:
    """
    Load spell description args from game files.
    Returns a dict mapping sid -> list of function names.
    """
    args_file = settings.GAME_DATA_PATH / "StreamingAssets" / "Lang" / "args" / "magic.json"

    if not args_file.exists():
        return {}

    try:
        with open(args_file, 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
            tokens_args = data.get("tokensArgs", [])
            return {item["sid"]: item.get("args", []) for item in tokens_args}
    except Exception:
        return {}


def get_spell_info(spell_id: str, upgrade_level: int = 0) -> dict:
    """
    Get display info for a spell including name, descriptions, and costs.

    Args:
        spell_id: The spell's id_key (e.g., 'day_10_magic_second_song')
        upgrade_level: Spell upgrade level (0-3, where 0 is base)

    Returns:
        dict with name, description_template, description_args,
        upgrade_description_template, upgrade_description_args,
        mana_cost, learn_cost, upgrade_cost
    """
    localizations = get_localizations()
    args_data = get_spell_args()

    # Spell localization keys
    name_key = f"{spell_id}_name"
    desc_key = f"{spell_id}_description"

    # Spells have array of descriptions for levels 0-3
    desc_keys = [
        desc_key,
        f"{desc_key}_1",
        f"{desc_key}_2",
        f"{desc_key}_3"
    ]

    # Get name
    name = localizations.get(name_key, spell_id.replace("_", " ").title())

    # Get description for specified level
    level_desc_key = desc_keys[min(upgrade_level, len(desc_keys) - 1)]
    description_template = localizations.get(level_desc_key, "")
    description_args = args_data.get(level_desc_key, [])

    # Get bonus description (if spell is upgraded)
    upgrade_description_template = ""
    upgrade_description_args = []
    if upgrade_level > 0:
        upgrade_key = f"{spell_id}_description_up_level_bonus_{upgrade_level + 1}"
        upgrade_description_template = localizations.get(upgrade_key, "")
        upgrade_description_args = args_data.get(upgrade_key, [])

    return {
        "name": name,
        "description_template": description_template,
        "description_args": description_args,
        "upgrade_description_template": upgrade_description_template,
        "upgrade_description_args": upgrade_description_args,
    }
```

---

## 5. API Endpoints

### Required Endpoints

**Location:** `hero_builder/views.py` and `hero_builder/urls.py`

#### 5.1 List Available Spells

**Endpoint:** `GET /api/spells/available/`

**Query Parameters:**
- `school` (optional): Filter by magic school (day, night, space, primal, neutral)
- `rank` (optional): Filter by spell rank (1-4)
- `exclude` (optional): Comma-separated list of spell IDs to exclude

**Response:**
```json
{
  "spells": [
    {
      "id": "day_10_magic_second_song",
      "name": "Second Song",
      "school": "day",
      "rank": 3,
      "icon": "day_10_magic_second_song",
      "mana_cost": 12,
      "learn_cost": [
        {"resource": "gemstones", "amount": 6},
        {"resource": "crystals", "amount": 6},
        {"resource": "mercury", "amount": 6}
      ],
      "upgrade_cost": [25, 25, 25],
      "used_on_map": false,
      "description_template": "Resets the next turn delay for one ally...",
      "description_args": ["current_magic_upgrade_0_param_..."],
      "raw_data": { /* full spell data */ }
    }
  ]
}
```

**Implementation Pattern:** Follow `api_available_items()` (lines 668-724)

```python
def api_available_spells(request):
    """
    API endpoint to get available spells for spell book.
    Query params:
        school (optional): Magic school filter
        rank (optional): Spell rank filter (1-4)
        exclude (optional): Comma-separated spell IDs to exclude
    Returns: {spells: [...]}
    """
    version = GameVersion.objects.filter(is_active=True).first()
    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    school_param = request.GET.get('school', '')
    rank_param = request.GET.get('rank', '')
    exclude_ids = request.GET.get('exclude', '').split(',') if request.GET.get('exclude') else []

    spells = Spell.objects.filter(version=version)

    if school_param:
        spells = spells.filter(school=school_param)

    if rank_param:
        try:
            rank = int(rank_param)
            # Note: rank is in raw_data, may need custom filter
            spells = [s for s in spells if s.raw_data.get('rank') == rank]
        except ValueError:
            pass

    # Exclude already known spells
    spells = [s for s in spells if s.id_key not in exclude_ids]

    spells_data = []
    for spell in spells:
        spell_info = get_spell_info(spell.id_key, upgrade_level=0)

        spells_data.append({
            'id': spell.id_key,
            'school': spell.school,
            'rank': spell.raw_data.get('rank', 1),
            'icon': spell.raw_data.get('icon', spell.id_key),
            'mana_cost': spell.raw_data.get('manaCost', [0])[0],
            'learn_cost': spell.raw_data.get('learnCost', []),
            'upgrade_cost': spell.raw_data.get('upgradeCost', []),
            'used_on_map': spell.raw_data.get('usedOnMap', False),
            'raw_data': spell.raw_data,
            # Localized fields
            'name': spell_info['name'],
            'description_template': spell_info['description_template'],
            'description_args': spell_info['description_args'],
        })

    return JsonResponse({'spells': spells_data})
```

#### 5.2 Get Spell Details

**Endpoint:** `GET /api/spells/<spell_id>/`

**Response:**
```json
{
  "id": "day_10_magic_second_song",
  "name": "Second Song",
  "school": "day",
  "rank": 3,
  "icon": "day_10_magic_second_song",
  "mana_costs": [12, 12, 12, 12],
  "learn_cost": [...],
  "upgrade_cost": [25, 25, 25],
  "used_on_map": false,
  "descriptions": [
    {
      "level": 0,
      "description_template": "...",
      "description_args": [...]
    },
    {
      "level": 1,
      "description_template": "...",
      "description_args": [...]
    }
  ],
  "bonus_descriptions": [...],
  "raw_data": { /* full spell data */ }
}
```

**Implementation:**

```python
def api_spell_detail(request, spell_id):
    """API endpoint to get detailed spell data."""
    version = GameVersion.objects.filter(is_active=True).first()

    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    spell = get_object_or_404(Spell, version=version, id_key=spell_id)

    # Get descriptions for all upgrade levels
    descriptions = []
    for level in range(4):
        spell_info = get_spell_info(spell_id, upgrade_level=level)
        descriptions.append({
            'level': level,
            'description_template': spell_info['description_template'],
            'description_args': spell_info['description_args'],
        })

    # Get bonus descriptions
    bonus_descriptions = []
    for bonus in spell.raw_data.get('bonusDescriptions', []):
        bonus_level = bonus.get('level')
        bonus_key = bonus.get('description')
        localizations = get_localizations()
        args_data = get_spell_args()

        bonus_descriptions.append({
            'level': bonus_level,
            'description_template': localizations.get(bonus_key, ''),
            'description_args': args_data.get(bonus_key, []),
        })

    data = {
        'id': spell.id_key,
        'school': spell.school,
        'rank': spell.raw_data.get('rank', 1),
        'icon': spell.raw_data.get('icon', spell.id_key),
        'mana_costs': spell.raw_data.get('manaCost', []),
        'learn_cost': spell.raw_data.get('learnCost', []),
        'upgrade_cost': spell.raw_data.get('upgradeCost', []),
        'used_on_map': spell.raw_data.get('usedOnMap', False),
        'descriptions': descriptions,
        'bonus_descriptions': bonus_descriptions,
        'raw_data': spell.raw_data,
    }

    # Get base name
    spell_info = get_spell_info(spell_id, upgrade_level=0)
    data['name'] = spell_info['name']

    return JsonResponse(data)
```

#### 5.3 URL Configuration

**Location:** `hero_builder/urls.py`

**Add:**
```python
# API endpoints - Spells
path('api/spells/available/', views.api_available_spells, name='api_available_spells'),
path('api/spells/<str:spell_id>/', views.api_spell_detail, name='api_spell_detail'),
```

---

## 6. Frontend Integration

### HeroState Context Support

**Location:** `static/js/hero-state.js:175-190`

**✅ Already Implemented:**

```javascript
createSpellContext(spell) {
  return {
    currentMagic: spell,
    currentHero: {
      stats: this.effectiveStats,
      heroClass: this.heroClass,
      faction: this.faction,
      getSpellPower: (school) => {
        // Base spell power + school-specific bonuses
        let sp = this.effectiveStats.spellPower || 0;
        // Could add school-specific bonuses here
        return sp;
      },
    },
  };
}

formatSpellDescription(spell, template, argFunctions) {
  const ctx = this.createSpellContext(spell);
  return DescriptionRuntime.formatDescription(template, argFunctions, ctx);
}
```

**Status:** Context creation and formatting functions **already exist**!

### Description Update System

**Location:** `static/js/hero-state.js:289-328`

**✅ Already Supports Spells:**

```javascript
updateAllDescriptions() {
  const elements = document.querySelectorAll('[data-description-template]');

  for (const el of elements) {
    const template = el.dataset.descriptionTemplate;
    const argsJson = el.dataset.descriptionArgs;
    const itemJson = el.dataset.descriptionItem;
    const type = el.dataset.descriptionType || 'item';

    // ...

    let formatted;
    switch (type) {
      case 'spell':
        formatted = this.formatSpellDescription(item, template, args);
        break;
      // ...
    }
  }
}
```

**Usage Pattern:**

```html
<div class="spell-description"
     data-description-type="spell"
     data-description-template="Resets the next turn delay for {0} ally..."
     data-description-args='["current_magic_upgrade_0_param_..."]'
     data-description-item='{"id": "day_10_magic_second_song", "level": 1, ...}'>
  <!-- Description will be formatted here -->
</div>
```

### Frontend Component Recommendations

Based on item implementation patterns, spell UI should follow:

**1. Spell Book Modal** (similar to item selection modal)
- Filter by school (tabs)
- Filter by rank
- Display learned spells
- Click to view details

**2. Spell Card Component**
```html
<div class="spell-card" data-spell-id="day_10_magic_second_song">
  <img src="/media/gamedata/ui/day_10_magic_second_song.png" alt="Second Song">
  <div class="spell-info">
    <h4 class="spell-name">Second Song</h4>
    <div class="spell-school-badge">Day Magic</div>
    <div class="spell-rank">Rank 3</div>
    <div class="spell-mana-cost">12 Mana</div>
  </div>
  <div class="spell-description"
       data-description-type="spell"
       data-description-template="..."
       data-description-args='[...]'
       data-description-item='{"id": "...", "level": 1}'>
  </div>
</div>
```

**3. Spell Detail Modal**
- Show all 4 upgrade levels
- Show bonus descriptions
- Show mana costs per level
- Show learn/upgrade costs
- Upgrade buttons

---

## 7. Comparison with Item Implementation

### API Pattern Similarity

| Feature | Items | Spells | Status |
|---------|-------|--------|--------|
| **Model** | `Item` | `Spell` | ✅ Exists |
| **Localization** | `get_item_info()` | `get_spell_info()` | ⚠️ Need to create |
| **Args file** | `artifacts.json` | `magic.json` | ✅ Exists |
| **List endpoint** | `/api/items/available/` | `/api/spells/available/` | ⚠️ Need to create |
| **Detail endpoint** | N/A | `/api/spells/<id>/` | ⚠️ Need to create |
| **Transpiled functions** | `current_item_*` | `current_magic_*` | ✅ Exists |
| **Context creation** | `createItemContext()` | `createSpellContext()` | ✅ Exists |
| **Format function** | `formatItemDescription()` | `formatSpellDescription()` | ✅ Exists |

**Conclusion:** ~70% of spell infrastructure already exists. We primarily need:
1. `get_spell_info()` function in `core/localizations.py`
2. Two API endpoints in `hero_builder/views.py`
3. Frontend components (HTML/JS)

---

## 8. Implementation Checklist

### Phase 1: Backend API (Estimated: 3-4 hours)

- [ ] **Add `get_spell_args()` to `core/localizations.py`**
  - Pattern: Copy `get_item_args()`, change file to `magic.json`
  - Lines: ~15

- [ ] **Add `get_spell_info()` to `core/localizations.py`**
  - Pattern: Similar to `get_item_info()`, handle array of descriptions
  - Lines: ~50
  - Handle 4 upgrade levels

- [ ] **Add `api_available_spells()` to `hero_builder/views.py`**
  - Pattern: Copy `api_available_items()` structure
  - Lines: ~50
  - Filter by school, rank, exclude list

- [ ] **Add `api_spell_detail()` to `hero_builder/views.py`**
  - New endpoint for full spell details
  - Lines: ~40
  - Return all upgrade levels

- [ ] **Update `hero_builder/urls.py`**
  - Add 2 new URL patterns
  - Lines: ~2

- [ ] **Write unit tests for spell API endpoints**
  - Test filtering, localization, description args
  - Lines: ~100

### Phase 2: Frontend Integration (Estimated: 5-6 hours)

- [ ] **Create spell book UI component**
  - Modal with school tabs
  - Spell cards with icons
  - Filter by rank
  - Lines: ~200 (HTML/JS)

- [ ] **Create spell detail modal**
  - Show all upgrade levels
  - Dynamic descriptions with `formatSpellDescription()`
  - Upgrade controls
  - Lines: ~150

- [ ] **Integrate with HeroState**
  - Store known spells
  - Handle spell learning
  - Handle spell upgrades
  - Lines: ~50

- [ ] **Add spell book button to hero builder UI**
  - Button in header/sidebar
  - Open spell book modal
  - Lines: ~20

- [ ] **Style spell components**
  - School color themes
  - Rank indicators
  - Mana cost badges
  - Lines: ~100 (CSS)

### Phase 3: Testing (Estimated: 2-3 hours)

- [ ] **E2E tests for spell system**
  - Load spell book
  - Learn spell
  - Verify description updates
  - Upgrade spell
  - Lines: ~150

- [ ] **Manual testing**
  - Test all schools
  - Test all ranks
  - Test description placeholders with hero stats
  - Test upgrade flow

### Phase 4: Documentation (Estimated: 1-2 hours)

- [ ] **Update CLAUDE.md with spell system patterns**
- [ ] **Add spell system to docs/**
- [ ] **Update development-workflow memory**

---

## 9. Code Examples

### Example 1: Using Spell API in Frontend

```javascript
// Fetch available day magic spells
async function loadDaySpells() {
  const response = await fetch('/api/spells/available/?school=day&exclude=day_01_magic_blessing');
  const data = await response.json();

  data.spells.forEach(spell => {
    // Format description with hero stats
    const formatted = HeroState.formatSpellDescription(
      spell.raw_data,
      spell.description_template,
      spell.description_args
    );

    // Display spell card
    displaySpellCard(spell, formatted);
  });
}
```

### Example 2: Spell Card with Dynamic Description

```html
<div class="spell-card"
     onclick="showSpellDetail('day_10_magic_second_song')">
  <img src="/media/gamedata/ui/day_10_magic_second_song.png"
       alt="Second Song"
       class="spell-icon">

  <div class="spell-header">
    <h4 class="spell-name">Second Song</h4>
    <span class="spell-school-badge day-magic">Day</span>
    <span class="spell-rank">★★★</span>
  </div>

  <div class="spell-cost">
    <span class="mana-cost">12 <img src="/static/img/mana.png"></span>
  </div>

  <div class="spell-description"
       data-description-type="spell"
       data-description-template="Resets the next turn delay for one ally..."
       data-description-args='["current_magic_upgrade_0_param_cooldown"]'
       data-description-item='{"id": "day_10_magic_second_song", "level": 1, "manaCost": [12, 12, 12, 12]}'>
    <!-- Auto-formatted by HeroState.updateAllDescriptions() -->
  </div>

  <div class="spell-learn-cost">
    <span>6 <img src="/static/img/gemstones.png"></span>
    <span>6 <img src="/static/img/crystals.png"></span>
    <span>6 <img src="/static/img/mercury.png"></span>
  </div>
</div>
```

### Example 3: Spell Upgrade Handler

```javascript
function upgradeSpell(spellId, currentLevel) {
  const newLevel = currentLevel + 1;

  // Update hero state
  HeroState.spells[spellId].level = newLevel;

  // Re-fetch spell detail with new level
  fetch(`/api/spells/${spellId}/`)
    .then(r => r.json())
    .then(data => {
      // Get description for new level
      const levelDesc = data.descriptions[newLevel];

      // Format with hero stats
      const formatted = HeroState.formatSpellDescription(
        data.raw_data,
        levelDesc.description_template,
        levelDesc.description_args
      );

      // Update UI
      updateSpellCardDescription(spellId, formatted);

      // Show bonus description if available
      const bonus = data.bonus_descriptions.find(b => b.level === newLevel + 1);
      if (bonus) {
        const bonusFormatted = HeroState.formatSpellDescription(
          data.raw_data,
          bonus.description_template,
          bonus.description_args
        );
        showBonusNotification(bonusFormatted);
      }
    });
}
```

---

## 10. Potential Issues and Solutions

### Issue 1: Spell Rank Not in Model Field

**Problem:** Spell rank is in `raw_data.rank`, not a direct model field. This makes filtering slow.

**Solution Options:**
1. **Short-term:** Filter in Python after query: `spells = [s for s in spells if s.raw_data.get('rank') == rank]`
2. **Long-term:** Add migration to add `rank` field to `Spell` model

**Recommendation:** Use short-term solution for initial implementation, add field in optimization phase.

### Issue 2: Multiple Description Keys per Spell

**Problem:** Spells have 4 description keys (one per level), unlike items with single key.

**Solution:** `get_spell_info()` should accept `upgrade_level` parameter and select correct key from array.

**Implementation:**
```python
desc_keys = [
    f"{spell_id}_description",      # Level 0
    f"{spell_id}_description_1",    # Level 1
    f"{spell_id}_description_2",    # Level 2
    f"{spell_id}_description_3"     # Level 3
]
desc_key = desc_keys[min(upgrade_level, len(desc_keys) - 1)]
```

### Issue 3: Spell Context Requires School-Specific Bonuses

**Problem:** `createSpellContext()` has TODO for school-specific spell power bonuses.

**Solution:** Defer school bonuses to Phase 2. For initial implementation, return base spell power.

**Future Enhancement:**
```javascript
getSpellPower: (school) => {
  let sp = this.effectiveStats.spellPower || 0;

  // Add bonuses from skills (e.g., Day Magic Mastery)
  const schoolSkills = {
    'day': 'skill_magic_day',
    'night': 'skill_magic_night',
    'space': 'skill_magic_space',
    'primal': 'skill_magic_primal'
  };

  const skillId = schoolSkills[school];
  if (skillId && this.skills[skillId]) {
    sp += this.skills[skillId].level * 2; // Example bonus
  }

  return sp;
}
```

---

## 11. Recommended Implementation Order

### Week 1: Backend Foundation
1. Add `get_spell_args()` and `get_spell_info()` to `core/localizations.py`
2. Add `api_available_spells()` endpoint
3. Add `api_spell_detail()` endpoint
4. Update URLs
5. Write unit tests

### Week 2: Frontend Skeleton
1. Create spell book modal structure (no styling)
2. Integrate with `/api/spells/available/`
3. Display spell cards with formatted descriptions
4. Test description formatting with `HeroState.formatSpellDescription()`

### Week 3: Full Integration
1. Add spell detail modal
2. Implement spell learning flow
3. Implement spell upgrade flow
4. Add styling and polish
5. Write E2E tests

### Week 4: Polish and Testing
1. Manual testing across all schools
2. Test description edge cases
3. Performance optimization
4. Documentation

---

## 12. Success Criteria

### Backend API
- ✅ `/api/spells/available/` returns filtered spell list
- ✅ Spells include `description_template` and `description_args`
- ✅ Filtering by school, rank, exclude works correctly
- ✅ `/api/spells/<id>/` returns full spell details with all upgrade levels

### Frontend
- ✅ Spell book opens and displays spells
- ✅ Spell descriptions are dynamically formatted with hero stats
- ✅ Spell descriptions update when hero stats change (e.g., equipping spell power items)
- ✅ Can learn new spells
- ✅ Can upgrade spells to higher levels
- ✅ Bonus descriptions display correctly

### Quality
- ✅ E2E tests pass for spell system
- ✅ No console errors when using spell book
- ✅ Descriptions match game behavior
- ✅ Performance is acceptable (<500ms to load spell book)

---

## 13. Final Recommendations

### Immediate Next Steps
1. **Start with `get_spell_info()` function** - This is the foundation for everything else
2. **Create API endpoints** - Test with curl/Postman before building UI
3. **Build minimal spell book UI** - Prove the integration works end-to-end
4. **Iterate on features** - Add filtering, upgrades, etc. incrementally

### Architecture Decisions
- **Reuse item patterns** - Don't reinvent the wheel, spells are very similar to items
- **Keep raw_data queries for now** - Don't add model fields until we prove they're needed
- **Use existing transpiled functions** - No transpiler changes required
- **Follow Django REST patterns** - Consistent with existing API endpoints

### Risk Mitigation
- **Start with read-only spell book** - Defer learning/upgrading to Phase 2
- **Test description formatting early** - This is the most complex part
- **Handle missing localization keys gracefully** - Some spells may have incomplete data

---

## Appendix A: File Locations Reference

```
olden/
├── gamedata/
│   ├── models.py                    # Spell model (lines 438-461)
│   └── management/commands/
│       └── import_gamedata.py       # Spell import (lines 391-423)
│
├── core/
│   ├── data_reader.py               # get_all_spells() (lines 145-155)
│   └── localizations.py             # ADD: get_spell_info(), get_spell_args()
│
├── hero_builder/
│   ├── views.py                     # ADD: api_available_spells(), api_spell_detail()
│   └── urls.py                      # ADD: spell API routes
│
├── static/js/
│   ├── hero-state.js                # ✅ createSpellContext(), formatSpellDescription()
│   ├── description-runtime.js       # ✅ formatDescription()
│   └── generated/
│       └── description_functions.js # ✅ current_magic_* functions
│
├── transpiler/
│   └── src/index.ts                 # ✅ Already includes magic script files
│
└── StreamingAssets/Lang/
    ├── english/texts/magic.json     # ✅ Spell localization texts
    └── args/magic.json              # ✅ Spell description args
```

---

## Appendix B: Spell Data Sample

```python
# Python Shell Example
from gamedata.models import Spell, GameVersion

version = GameVersion.objects.filter(is_active=True).first()
spell = Spell.objects.filter(version=version, school='day').first()

print(f"ID: {spell.id_key}")
print(f"School: {spell.school}")
print(f"Rank: {spell.raw_data.get('rank')}")
print(f"Mana Cost: {spell.raw_data.get('manaCost')}")
print(f"Description Keys: {spell.raw_data.get('description')}")
print(f"Learn Cost: {spell.raw_data.get('learnCost')}")
```

**Output:**
```
ID: day_10_magic_second_song
School: day
Rank: 3
Mana Cost: [12, 12, 12, 12]
Description Keys: [
  'day_10_magic_second_song_description',
  'day_10_magic_second_song_description_1',
  'day_10_magic_second_song_description_2',
  'day_10_magic_second_song_description_3'
]
Learn Cost: [
  {'name': 'gemstones', 'cost': 6},
  {'name': 'crystals', 'cost': 6},
  {'name': 'mercury', 'cost': 6}
]
```

---

**End of Analysis**
