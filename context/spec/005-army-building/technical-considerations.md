# Technical Considerations: Army Building

## 1. Backend Changes

### 1.1 Unit Model Enhancement

Add `icon_url` property to the existing `Unit` model:

```python
# gamedata/models.py - Unit class

@property
def icon_url(self):
    """Get URL for unit icon, with fallback for missing icons."""
    import os
    icon_path = f"/media/gamedata/units/{self.id_key}.png"
    full_path = f"/Users/eb/PycharmProjects/olden/media/gamedata/units/{self.id_key}.png"
    if os.path.exists(full_path):
        return icon_path
    # Fallback to placeholder based on tier
    return f"/media/gamedata/ui/unit_placeholder_t{self.tier}.png"
```

### 1.2 API Endpoints

#### Extend `api_hero_data` to include starting army:

```python
# In hero_builder/views.py

def api_hero_data(request, hero_slug):
    # ... existing code ...

    # Add starting army
    start_squad = []
    for squad_entry in hero.raw_data.get('startSquad', []):
        unit = Unit.objects.filter(
            version=version,
            id_key=squad_entry['sid']
        ).first()
        if unit:
            start_squad.append({
                'unit_id': unit.id_key,
                'unit_name': unit.display_name,
                'min': squad_entry['min'],
                'max': squad_entry['max'],
                'icon_url': unit.icon_url,
                'tier': unit.tier,
            })

    data['start_squad'] = start_squad
    return JsonResponse(data)
```

#### New endpoint: `api_faction_units`

```python
@require_GET
def api_faction_units(request, faction_slug):
    """Get all units for a faction, grouped by tier."""
    version = GameVersion.objects.filter(is_active=True).first()
    if not version:
        return JsonResponse({'error': 'No active game version'}, status=404)

    faction = get_object_or_404(Faction, version=version, slug=faction_slug)
    units = Unit.objects.filter(version=version, faction=faction).order_by('tier', 'id_key')

    # Group by tier
    units_by_tier = {}
    for unit in units:
        tier_key = f"tier_{unit.tier}"
        if tier_key not in units_by_tier:
            units_by_tier[tier_key] = []
        units_by_tier[tier_key].append({
            'id': unit.id_key,
            'name': unit.display_name,
            'tier': unit.tier,
            'icon_url': unit.icon_url,
            'stats': {
                'hp': unit.hp,
                'offence': unit.offence,
                'defence': unit.defence,
                'damage_min': unit.damage_min,
                'damage_max': unit.damage_max,
                'initiative': unit.initiative,
                'speed': unit.speed,
            },
            'attack_type': unit.attack_type,
            'move_type': unit.move_type,
            'squad_value': unit.squad_value,
            'is_upgrade': '_upg' in unit.id_key,
        })

    return JsonResponse({
        'faction': faction.name,
        'units_by_tier': units_by_tier
    })
```

### 1.3 URL Configuration

```python
# hero_builder/urls.py
urlpatterns = [
    # ... existing ...
    path('api/factions/<slug:faction_slug>/units/', views.api_faction_units, name='api_faction_units'),
]
```

## 2. Frontend Changes

### 2.1 New Partial: `_army.html`

Create new partial for the army panel:

```html
<!-- hero_builder/templates/hero_builder/partials/_army.html -->
{% load json_filters %}

<div class="army-panel" id="army-panel"
     data-faction="{{ hero.faction.slug }}"
     data-start-squad='{{ hero.raw_data.startSquad|to_json }}'>
    <div class="army-header">
        <span class="army-title">ARMY</span>
        <span class="army-value">Value: <span id="total-army-value">0</span></span>
    </div>
    <div class="army-slots">
        {% for i in "1234567"|make_list %}
        <div class="army-slot" data-slot="{{ forloop.counter0 }}">
            <div class="unit-icon-wrapper">
                <span class="add-unit-btn">+</span>
            </div>
            <span class="unit-count"></span>
            <span class="unit-name"></span>
        </div>
        {% endfor %}
    </div>
</div>
```

### 2.2 JavaScript Module: `army-builder.js`

```javascript
// static/js/army-builder.js

class ArmyBuilder {
    constructor(panelElement) {
        this.panel = panelElement;
        this.faction = panelElement.dataset.faction;
        this.slots = Array(7).fill(null); // 7 army slots
        this.factionUnits = null;

        this.init();
    }

    async init() {
        // Load starting squad
        const startSquad = JSON.parse(this.panel.dataset.startSquad || '[]');
        await this.loadFactionUnits();
        this.populateStartingArmy(startSquad);
        this.bindEvents();
    }

    async loadFactionUnits() {
        const response = await fetch(`/builder/api/factions/${this.faction}/units/`);
        const data = await response.json();
        this.factionUnits = data.units_by_tier;
    }

    populateStartingArmy(startSquad) {
        startSquad.forEach((entry, index) => {
            if (index < 7) {
                this.slots[index] = {
                    unitId: entry.sid,
                    count: Math.floor((entry.min + entry.max) / 2), // Use average
                    min: entry.min,
                    max: entry.max
                };
            }
        });
        this.render();
    }

    render() {
        const slotElements = this.panel.querySelectorAll('.army-slot');
        let totalValue = 0;

        slotElements.forEach((slot, index) => {
            const unitData = this.slots[index];
            if (unitData) {
                const unit = this.findUnit(unitData.unitId);
                if (unit) {
                    slot.innerHTML = `
                        <div class="unit-icon-wrapper tooltip-wrapper">
                            <img src="${unit.icon_url}" alt="${unit.name}" class="unit-icon">
                            <div class="tooltip-content">
                                ${this.renderUnitTooltip(unit)}
                            </div>
                        </div>
                        <span class="unit-count">${unitData.count}</span>
                        <span class="unit-name">${unit.name}</span>
                    `;
                    slot.classList.add('filled');
                    totalValue += unit.squad_value * unitData.count;
                }
            } else {
                slot.innerHTML = `
                    <div class="unit-icon-wrapper">
                        <span class="add-unit-btn">+</span>
                    </div>
                    <span class="unit-count"></span>
                    <span class="unit-name"></span>
                `;
                slot.classList.remove('filled');
            }
        });

        document.getElementById('total-army-value').textContent = totalValue.toLocaleString();
    }

    findUnit(unitId) {
        for (const tier of Object.values(this.factionUnits || {})) {
            const unit = tier.find(u => u.id === unitId);
            if (unit) return unit;
        }
        return null;
    }

    renderUnitTooltip(unit) {
        return `
            <div class="tooltip-name">${unit.name} (T${unit.tier})</div>
            <div class="tooltip-stats">
                <div>HP: ${unit.stats.hp}</div>
                <div>ATK: ${unit.stats.offence} | DEF: ${unit.stats.defence}</div>
                <div>DMG: ${unit.stats.damage_min}-${unit.stats.damage_max}</div>
                <div>INIT: ${unit.stats.initiative} | SPD: ${unit.stats.speed}</div>
                <div>Type: ${unit.attack_type} | ${unit.move_type}</div>
            </div>
        `;
    }

    bindEvents() {
        this.panel.addEventListener('click', (e) => {
            const slot = e.target.closest('.army-slot');
            if (slot) {
                const slotIndex = parseInt(slot.dataset.slot);
                if (this.slots[slotIndex]) {
                    this.openUnitEditor(slotIndex);
                } else {
                    this.openUnitSelector(slotIndex);
                }
            }
        });
    }

    openUnitSelector(slotIndex) {
        // Open modal to select unit
        // Implementation: create modal, populate with factionUnits
    }

    openUnitEditor(slotIndex) {
        // Open modal to edit count or remove unit
    }
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const armyPanel = document.getElementById('army-panel');
    if (armyPanel) {
        window.armyBuilder = new ArmyBuilder(armyPanel);
    }
});
```

### 2.3 CSS: `army.css`

```css
/* static/hero_builder/css/army.css */

.army-panel {
    background: var(--panel-bg);
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
}

.army-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.army-title {
    font-size: 14px;
    font-weight: bold;
    color: var(--text-muted);
    letter-spacing: 1px;
}

.army-value {
    font-size: 13px;
    color: var(--text-gold);
}

.army-slots {
    display: flex;
    gap: 8px;
}

.army-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 64px;
    cursor: pointer;
}

.unit-icon-wrapper {
    width: 56px;
    height: 56px;
    background: var(--slot-bg);
    border: 2px solid var(--slot-border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.army-slot.filled .unit-icon-wrapper {
    border-color: var(--slot-border-filled);
}

.unit-icon {
    width: 48px;
    height: 48px;
    object-fit: contain;
}

.add-unit-btn {
    font-size: 24px;
    color: var(--text-muted);
}

.unit-count {
    font-size: 12px;
    font-weight: bold;
    margin-top: 4px;
}

.unit-name {
    font-size: 10px;
    color: var(--text-muted);
    text-align: center;
    max-width: 64px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```

## 3. Integration Points

### 3.1 Builder Template

Add army partial to `builder.html`:

```html
<div class="main-column">
    {% include "hero_builder/partials/_hero_card.html" %}
    {% include "hero_builder/partials/_army.html" %}  <!-- NEW -->
    {% include "hero_builder/partials/_equipment.html" %}
</div>
```

### 3.2 Script Loading

Add army-builder.js to `_scripts.html`:

```html
<script src="{% static 'js/army-builder.js' %}"></script>
```

## 4. Missing Icon Handling

For units without icons (~54 of 84), create placeholder images:
- `/media/gamedata/ui/unit_placeholder_t1.png` through `t7.png`
- Or use a generic placeholder with tier number overlay

Alternative: Check if icons exist in a different location in the game files, or extract them from sprite sheets.

## 5. Implementation Order

1. Add `icon_url` property to Unit model
2. Create `api_faction_units` endpoint
3. Extend `api_hero_data` with start_squad
4. Create `_army.html` partial
5. Create `army.css` styles
6. Create `army-builder.js` module
7. Integrate into builder template
8. Test with Playwright
