# Technical Specification: Skill Management System

- **Functional Specification:** `context/spec/001-skill-management/functional-spec.md`
- **Status:** Draft
- **Author(s):** Claude (AI Assistant)

---

## 1. High-Level Technical Approach

The Skill Management System will be implemented as a **client-side feature** using:

1. **Two new JSON API endpoints** for serving skill and subskill data
2. **Vanilla JavaScript** for modal interactions and state management
3. **CSS modals** styled to match the game's dark fantasy UI
4. **Reuse of existing utilities** - `get_skill_info()` from `core/localizations.py`

**Key Decisions:**
- No database persistence - all state is client-side JavaScript
- Separate API endpoints for skills list and subskills (on-demand fetching)
- Client-side filtering for skill search (instant response)
- All modals rendered dynamically via JavaScript

**Systems Affected:**
- `hero_builder/views.py` - New API endpoints
- `hero_builder/urls.py` - New URL routes
- `hero_builder/templates/hero_builder/builder.html` - JavaScript logic and modal CSS

---

## 2. Proposed Solution & Implementation Plan

### 2.1 API Endpoints

#### Endpoint 1: Get Available Skills

```
GET /hero/api/skills/available/
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `faction` | string | Yes | Hero's faction ID (e.g., "human", "undead") |
| `exclude` | string | No | Comma-separated skill IDs to exclude |

**Response:**
```json
{
  "skills": [
    {
      "id": "skill_logistics",
      "type": "Common",
      "name": "Logistics",
      "description": "+10% Movement Points on the global map.",
      "icon": "skill_logistics",
      "subskill_preview": ["sub_secret_passages", "sub_strong_mounts", "sub_careful_planning"]
    },
    {
      "id": "skill_offence",
      "type": "Class",
      "name": "Offence",
      "description": "Increases damage dealt by allied units by 5%.",
      "icon": "skill_offence",
      "subskill_preview": ["sub_attack_formation", "sub_first_strike"]
    }
  ]
}
```

**Business Logic:**
- Include all Common skills
- Include all Class skills
- Include the `faction_skill` for the specified faction
- Exclude other factions' faction skills
- Exclude skills in the `exclude` parameter
- Always return skills at Basic level (level 1) info

#### Endpoint 2: Get Subskills for Level-Up

```
GET /hero/api/skills/<skill_id>/level/<level>/subskills/
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `skill_id` | string | The skill ID (e.g., "skill_logistics") |
| `level` | int | The level being upgraded TO (2 or 3) |

**Response:**
```json
{
  "skill": {
    "id": "skill_logistics",
    "level": 2,
    "name": "Advanced Logistics",
    "description": "+15% Movement Points on the global map.",
    "icon": "skill_logistics_2"
  },
  "subskills": [
    {
      "id": "sub_secret_passages",
      "name": "Secret Passages",
      "description": "Terrain penalty reduces by 50%.",
      "icon": "sub_secret_passages"
    },
    {
      "id": "sub_strong_mounts",
      "name": "Strong Mounts",
      "description": "Neutral Global Map spells cost -4 mana.",
      "icon": "sub_strong_mounts"
    },
    {
      "id": "sub_careful_planning",
      "name": "Careful Planning",
      "description": "Every day, the hero saves up to 50 unused Movement Points.",
      "icon": "sub_careful_planning"
    }
  ]
}
```

**Business Logic:**
- Return the upgraded skill info at the specified level
- Retrieve subskill IDs from `skill.raw_data['parametersPerLevel'][level-1]['subSkills']`
- For each subskill ID, fetch localized name/description using `get_skill_info()`

### 2.2 Backend Implementation

**File: `hero_builder/views.py`**

```python
def api_available_skills(request):
    """
    API endpoint to get skills available for selection.
    Filters by faction to exclude other factions' skills.
    """
    version = GameVersion.objects.filter(is_active=True).first()
    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    faction_id = request.GET.get('faction', '')
    exclude_ids = request.GET.get('exclude', '').split(',') if request.GET.get('exclude') else []

    # Get the faction's own faction skill
    faction = Faction.objects.filter(version=version, id_key=faction_id).first()
    allowed_faction_skill = faction.faction_skill if faction else None

    # Get all other factions' skills to exclude
    other_faction_skills = set(
        Faction.objects.filter(version=version)
        .exclude(id_key=faction_id)
        .exclude(faction_skill='')
        .values_list('faction_skill', flat=True)
    )

    skills_data = []
    for skill in Skill.objects.filter(version=version).order_by('skill_type', 'id_key'):
        # Skip if already selected
        if skill.id_key in exclude_ids:
            continue
        # Skip other factions' faction skills
        if skill.id_key in other_faction_skills:
            continue

        info = get_skill_info(skill.id_key, level=1)

        # Get subskill preview IDs from level 2 data
        subskill_preview = []
        params = skill.raw_data.get('parametersPerLevel', [])
        if len(params) >= 2:
            subskill_preview = params[1].get('subSkills', [])

        skills_data.append({
            'id': skill.id_key,
            'type': skill.skill_type,
            'name': info['name'],
            'description': info['description'],
            'icon': skill.id_key,
            'subskill_preview': subskill_preview,
        })

    return JsonResponse({'skills': skills_data})


def api_skill_subskills(request, skill_id, level):
    """
    API endpoint to get subskills when leveling up a skill.
    """
    version = GameVersion.objects.filter(is_active=True).first()
    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    if level not in [2, 3]:
        return JsonResponse({'error': 'Level must be 2 or 3'}, status=400)

    skill = Skill.objects.filter(version=version, id_key=skill_id).first()
    if not skill:
        return JsonResponse({'error': 'Skill not found'}, status=404)

    # Get upgraded skill info
    skill_info = get_skill_info(skill_id, level=level)
    icon_suffix = f'_{level}' if level > 1 else ''

    # Get subskills from raw_data
    params = skill.raw_data.get('parametersPerLevel', [])
    if len(params) < level:
        return JsonResponse({'error': 'Invalid skill level data'}, status=500)

    subskill_ids = params[level - 1].get('subSkills', [])

    subskills_data = []
    for sub_id in subskill_ids:
        sub_info = get_skill_info(sub_id, level=1)
        subskills_data.append({
            'id': sub_id,
            'name': sub_info['name'],
            'description': sub_info['description'],
            'icon': sub_id,
        })

    return JsonResponse({
        'skill': {
            'id': skill_id,
            'level': level,
            'name': skill_info['name'],
            'description': skill_info['description'],
            'icon': f'{skill_id}{icon_suffix}',
        },
        'subskills': subskills_data,
    })
```

**File: `hero_builder/urls.py`**

Add new URL patterns:
```python
path('api/skills/available/', views.api_available_skills, name='api_available_skills'),
path('api/skills/<str:skill_id>/level/<int:level>/subskills/', views.api_skill_subskills, name='api_skill_subskills'),
```

### 2.3 Client-Side State Management

**JavaScript State Structure:**

```javascript
// State object stored in window or module scope
const heroBuild = {
    heroId: 'hero_slug_here',
    heroFaction: 'human',

    // Array of 8 skill slots (null = empty)
    skills: [
        {
            skillId: 'skill_logistics',
            level: 2,  // 1=Basic, 2=Advanced, 3=Expert
            subskills: ['sub_secret_passages', null]  // [level2 subskill, level3 subskill]
        },
        null,  // empty slot
        // ... up to 8 slots
    ],

    // Starting skills that cannot be removed
    startingSkillIds: ['skill_logistics', 'skill_faction_humans']
};
```

**State Management Functions:**

```javascript
const SkillManager = {
    // Initialize from server-rendered data
    init(heroData) {
        heroBuild.heroId = heroData.slug;
        heroBuild.heroFaction = heroData.faction;
        heroBuild.skills = heroData.startingSkills.map(s => ({
            skillId: s.id,
            level: s.level,
            subskills: [null, null]
        }));
        // Pad to 8 slots
        while (heroBuild.skills.length < 8) {
            heroBuild.skills.push(null);
        }
        heroBuild.startingSkillIds = heroData.startingSkills.map(s => s.id);
    },

    // Add skill to empty slot
    addSkill(slotIndex, skillId) {
        heroBuild.skills[slotIndex] = {
            skillId: skillId,
            level: 1,
            subskills: [null, null]
        };
        this.updateUI();
    },

    // Level up skill and add subskill
    levelUpSkill(slotIndex, subskillId) {
        const skill = heroBuild.skills[slotIndex];
        if (skill && skill.level < 3) {
            const subskillIndex = skill.level - 1;  // 0 for Basic→Advanced, 1 for Advanced→Expert
            skill.subskills[subskillIndex] = subskillId;
            skill.level++;
            this.updateUI();
        }
    },

    // Remove skill (only non-starting skills)
    removeSkill(slotIndex) {
        const skill = heroBuild.skills[slotIndex];
        if (skill && !heroBuild.startingSkillIds.includes(skill.skillId)) {
            heroBuild.skills[slotIndex] = null;
            this.updateUI();
        }
    },

    // Get list of currently selected skill IDs
    getSelectedSkillIds() {
        return heroBuild.skills
            .filter(s => s !== null)
            .map(s => s.skillId);
    },

    // Update DOM to reflect state
    updateUI() {
        // Implementation in next section
    }
};
```

### 2.4 UI Components

#### Modal Container (shared)

```html
<!-- Add to builder.html before closing </body> -->
<div id="skill-modal-container"></div>
```

#### Skill Selection Modal (Add New Skill)

```javascript
const SkillSelectionModal = {
    async open(slotIndex) {
        const excludeIds = SkillManager.getSelectedSkillIds().join(',');
        const response = await fetch(
            `/hero/api/skills/available/?faction=${heroBuild.heroFaction}&exclude=${excludeIds}`
        );
        const data = await response.json();

        this.render(data.skills, slotIndex);
    },

    render(skills, slotIndex) {
        const container = document.getElementById('skill-modal-container');
        container.innerHTML = `
            <div class="modal-overlay" onclick="SkillSelectionModal.close()">
                <div class="skill-modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>Select Skill</h2>
                        <input type="text"
                               class="skill-search"
                               placeholder="Search skills..."
                               oninput="SkillSelectionModal.filter(this.value)">
                    </div>
                    <div class="skill-list" id="skill-list">
                        ${skills.map(s => this.renderSkillOption(s, slotIndex)).join('')}
                    </div>
                </div>
            </div>
        `;
        this.allSkills = skills;
        this.slotIndex = slotIndex;
    },

    renderSkillOption(skill, slotIndex) {
        return `
            <div class="skill-option" data-skill-id="${skill.id}"
                 onclick="SkillSelectionModal.select('${skill.id}', ${slotIndex})">
                <img src="/media/gamedata/skills/${skill.icon}.png" class="skill-icon">
                <div class="skill-info">
                    <div class="skill-name">BASIC ${skill.name.toUpperCase()}</div>
                    <div class="skill-desc">${skill.description}</div>
                </div>
                <div class="subskill-previews">
                    ${skill.subskill_preview.map(sub =>
                        `<img src="/media/gamedata/skills/${sub}.png" class="subskill-preview-icon">`
                    ).join('')}
                </div>
            </div>
        `;
    },

    filter(searchText) {
        const filtered = this.allSkills.filter(s =>
            s.name.toLowerCase().includes(searchText.toLowerCase())
        );
        document.getElementById('skill-list').innerHTML =
            filtered.map(s => this.renderSkillOption(s, this.slotIndex)).join('');
    },

    select(skillId, slotIndex) {
        SkillManager.addSkill(slotIndex, skillId);
        this.close();
    },

    close() {
        document.getElementById('skill-modal-container').innerHTML = '';
    }
};
```

#### Subskill Selection Modal (Level Up)

```javascript
const SubskillSelectionModal = {
    async open(slotIndex) {
        const skill = heroBuild.skills[slotIndex];
        const nextLevel = skill.level + 1;

        const response = await fetch(
            `/hero/api/skills/${skill.skillId}/level/${nextLevel}/subskills/`
        );
        const data = await response.json();

        this.render(data, slotIndex);
    },

    render(data, slotIndex) {
        const container = document.getElementById('skill-modal-container');
        container.innerHTML = `
            <div class="modal-overlay" onclick="SubskillSelectionModal.close()">
                <div class="subskill-modal" onclick="event.stopPropagation()">
                    <div class="upgraded-skill">
                        <img src="/media/gamedata/skills/${data.skill.icon}.png" class="skill-icon-large">
                        <div class="skill-info">
                            <div class="skill-name">${data.skill.name.toUpperCase()}</div>
                            <div class="skill-desc">${data.skill.description}</div>
                        </div>
                    </div>
                    <div class="subskill-options">
                        ${data.subskills.map(sub => this.renderSubskillOption(sub, slotIndex)).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderSubskillOption(subskill, slotIndex) {
        return `
            <div class="subskill-option"
                 onclick="SubskillSelectionModal.select('${subskill.id}', ${slotIndex})">
                <img src="/media/gamedata/skills/${subskill.icon}.png" class="subskill-icon">
                <div class="subskill-info">
                    <div class="subskill-name">${subskill.name}</div>
                    <div class="subskill-desc">${subskill.description}</div>
                </div>
            </div>
        `;
    },

    select(subskillId, slotIndex) {
        SkillManager.levelUpSkill(slotIndex, subskillId);
        this.close();
    },

    close() {
        document.getElementById('skill-modal-container').innerHTML = '';
    }
};
```

### 2.5 CSS Styling

Add to `builder.html` `{% block extra_styles %}`:

```css
/* Modal Overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

/* Skill Selection Modal */
.skill-modal {
    background: linear-gradient(180deg, #1a2030 0%, #141820 100%);
    border: 2px solid #3a4555;
    border-radius: 12px;
    width: 90%;
    max-width: 700px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #2a3545;
}

.modal-header h2 {
    color: #c9a227;
    font-size: 1.3rem;
    margin: 0 0 15px 0;
    text-transform: uppercase;
}

.skill-search {
    width: 100%;
    padding: 12px 15px;
    background: #252d38;
    border: 1px solid #3a4555;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
}

.skill-search::placeholder {
    color: #5a6575;
}

.skill-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

/* Skill Option */
.skill-option {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    margin: 8px 0;
    background: #1e2530;
    border: 2px solid #2a3545;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
}

.skill-option:hover {
    border-color: #5a7090;
    background: #252d38;
}

.skill-icon {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    border: 1px solid #3a4555;
}

.skill-info {
    flex: 1;
}

.skill-name {
    color: #c9a227;
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 5px;
}

.skill-desc {
    color: #8899aa;
    font-size: 0.9rem;
    line-height: 1.4;
}

.subskill-previews {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.subskill-preview-icon {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    opacity: 0.7;
}

/* Subskill Selection Modal */
.subskill-modal {
    background: linear-gradient(180deg, #1a2030 0%, #141820 100%);
    border: 2px solid #3a4555;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    padding: 20px;
}

.upgraded-skill {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    margin-bottom: 20px;
    background: #1e2530;
    border: 2px solid #c9a227;
    border-radius: 10px;
}

.skill-icon-large {
    width: 70px;
    height: 70px;
    border-radius: 8px;
}

.subskill-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.subskill-option {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #1e2530;
    border: 2px solid #2a3545;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
}

.subskill-option:hover {
    border-color: #5a9090;
    background: #252d38;
}

.subskill-icon {
    width: 50px;
    height: 50px;
    border-radius: 8px;
}

.subskill-name {
    color: #7ec8e3;
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 4px;
}

.subskill-desc {
    color: #8899aa;
    font-size: 0.85rem;
    line-height: 1.3;
}
```

### 2.6 DOM Update Logic

```javascript
// In SkillManager.updateUI()
updateUI() {
    const skillsGrid = document.querySelector('.skills-grid');

    heroBuild.skills.forEach((skill, index) => {
        const slotElement = skillsGrid.children[index];
        const skillMain = slotElement.querySelector('.skill-main');
        const subskillBtns = slotElement.querySelectorAll('.subskill-btn');

        if (skill === null) {
            // Empty slot
            skillMain.innerHTML = '<span class="skill-add-text">+</span>';
            skillMain.onclick = () => SkillSelectionModal.open(index);
            subskillBtns[0].className = 'subskill-btn disabled';
            subskillBtns[1].className = 'subskill-btn disabled';
        } else {
            // Filled slot
            const iconSuffix = skill.level > 1 ? `_${skill.level}` : '';
            skillMain.innerHTML = `<img src="/media/gamedata/skills/${skill.skillId}${iconSuffix}.png">`;

            // First subskill button
            if (skill.level === 1) {
                // Can level up to Advanced
                subskillBtns[0].className = 'subskill-btn';
                subskillBtns[0].innerHTML = '<span class="add-text">+</span>';
                subskillBtns[0].onclick = () => SubskillSelectionModal.open(index);
            } else {
                // Show selected subskill
                subskillBtns[0].className = 'subskill-btn filled';
                subskillBtns[0].innerHTML = `<img src="/media/gamedata/skills/${skill.subskills[0]}.png">`;
            }

            // Second subskill button
            if (skill.level < 2) {
                subskillBtns[1].className = 'subskill-btn disabled';
            } else if (skill.level === 2) {
                // Can level up to Expert
                subskillBtns[1].className = 'subskill-btn';
                subskillBtns[1].innerHTML = '<span class="add-text">+</span>';
                subskillBtns[1].onclick = () => SubskillSelectionModal.open(index);
            } else {
                // Show selected subskill
                subskillBtns[1].className = 'subskill-btn filled';
                subskillBtns[1].innerHTML = `<img src="/media/gamedata/skills/${skill.subskills[1]}.png">`;
            }
        }
    });
}
```

---

## 3. Impact and Risk Analysis

### System Dependencies

- **`core/localizations.py`**: Heavy reliance on `get_skill_info()` function
- **`gamedata/models.py`**: Uses `Skill.raw_data` for subskill IDs
- **Skill Icons**: Requires icons to exist at `/media/gamedata/skills/{skill_id}.png`

### Potential Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Missing subskill icons | Medium | Low | Fallback to placeholder icon; log warning |
| Skill data structure changes | Low | High | Add validation; version raw_data access |
| JavaScript errors break page | Medium | Medium | Wrap in try-catch; graceful degradation |
| Modal accessibility issues | Medium | Low | Add keyboard support (Escape to close) |

### Performance Considerations

- **Skill list API**: Should be fast (~30 skills); add caching if needed
- **DOM updates**: Batch updates to avoid layout thrashing
- **Image loading**: Consider preloading subskill icons on modal open

---

## 4. Testing Strategy

### Unit Tests (Python)

```python
# test_views.py
class TestAvailableSkillsAPI(TestCase):
    def test_excludes_other_faction_skills(self):
        """Temple hero should not see Necromancy skill"""
        response = self.client.get('/hero/api/skills/available/?faction=human')
        skill_ids = [s['id'] for s in response.json()['skills']]
        self.assertNotIn('skill_faction_undead', skill_ids)

    def test_includes_own_faction_skill(self):
        """Human hero should see Ascension skill"""
        response = self.client.get('/hero/api/skills/available/?faction=human')
        skill_ids = [s['id'] for s in response.json()['skills']]
        self.assertIn('skill_faction_humans', skill_ids)

    def test_excludes_already_selected_skills(self):
        """Should not show skills passed in exclude param"""
        response = self.client.get(
            '/hero/api/skills/available/?faction=human&exclude=skill_logistics,skill_tactics'
        )
        skill_ids = [s['id'] for s in response.json()['skills']]
        self.assertNotIn('skill_logistics', skill_ids)

class TestSubskillsAPI(TestCase):
    def test_returns_subskills_for_level_2(self):
        """Level 2 should return Advanced subskills"""
        response = self.client.get('/hero/api/skills/skill_logistics/level/2/subskills/')
        data = response.json()
        self.assertEqual(data['skill']['level'], 2)
        self.assertGreater(len(data['subskills']), 0)

    def test_invalid_level_returns_error(self):
        """Level 1 or 4+ should return error"""
        response = self.client.get('/hero/api/skills/skill_logistics/level/1/subskills/')
        self.assertEqual(response.status_code, 400)
```

### Manual Testing Checklist

- [ ] Add new skill to empty slot
- [ ] Search filters skills correctly (case-insensitive)
- [ ] Other factions' skills are not shown
- [ ] Level up Basic skill shows correct subskills
- [ ] Level up Advanced skill shows correct subskills
- [ ] Subskill icons display correctly after selection
- [ ] Cannot remove starting skills
- [ ] Can remove added skills via right-click
- [ ] Page refresh resets to starting configuration
- [ ] Modal closes on overlay click
- [ ] Modal closes on Escape key
