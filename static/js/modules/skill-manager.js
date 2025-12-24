/**
 * Skill Manager - Manages hero skills, subskills, and skill progression
 */

import { heroBuild } from './state.js';
import { buildUrl, Debug, t } from './utils.js';
import { EquipmentManager } from './equipment-manager.js';

export const SkillManager = {
    init() {
        // Get hero info from DOM
        const heroCard = document.querySelector('[data-hero-faction]');
        heroBuild.heroFaction = heroCard?.dataset.heroFaction || '';
        heroBuild.heroId = heroCard?.dataset.heroId || '';
        heroBuild.heroViewRadius = parseInt(heroCard?.dataset.heroViewRadius || '6', 10);
        heroBuild.baseHeroLevel = parseInt(heroCard?.dataset.heroLevel || '1', 10);
        heroBuild.heroSpecialization = heroCard?.dataset.heroSpec ? JSON.parse(heroCard.dataset.heroSpec) : null;

        // Initialize skills array with 8 slots
        heroBuild.skills = new Array(8).fill(null);
        heroBuild.startingSkillLevels = {};

        // Get starting skills from DOM
        const skillSlots = document.querySelectorAll('.skill-with-subs');
        skillSlots.forEach((slot, index) => {
            const skillMain = slot.querySelector('.skill-main');
            const skillId = skillMain?.dataset.skillId;
            const skillLevel = parseInt(skillMain?.dataset.skillLevel) || 1;

            if (skillId) {
                // Extract name from tooltip if present
                const tooltipName = skillMain.querySelector('.tooltip-title')?.textContent || skillId;
                const tooltipDescEl = skillMain.querySelector('.tooltip-text');

                // Extract description pipeline fields from data attributes
                const descTemplate = tooltipDescEl?.dataset.skillTemplate || '';
                const descArgs = tooltipDescEl?.dataset.skillArgs ? JSON.parse(tooltipDescEl.dataset.skillArgs) : [];
                const rawData = tooltipDescEl?.dataset.skillRaw ? JSON.parse(tooltipDescEl.dataset.skillRaw) : null;

                // Remove level prefix from name if it exists
                const name = tooltipName.replace(/^(Basic|Advanced|Expert)\s+/, '');

                heroBuild.skills[index] = {
                    skillId: skillId,
                    level: skillLevel,
                    subskills: [null, null],
                    subskillNames: [null, null],
                    subskillDescs: [null, null],
                    subskillRawData: [null, null],
                    name: name,
                    description: '', // Will be computed dynamically
                    description_template: descTemplate,
                    description_args: descArgs,
                    raw_data: rawData
                };
                heroBuild.startingSkillIds.push(skillId);
                heroBuild.startingSkillLevels[skillId] = skillLevel;  // Track starting level
            }
        });

        // Fetch full skill data and enrich starting skills with template/args/raw_data
        fetch(buildUrl(`/api/skills/available/?hero_slug=${heroBuild.heroId}`))
            .then(response => response.json())
            .then(data => {
                const skillsMap = {};
                data.skills.forEach(s => { skillsMap[s.id] = s; });

                // Enrich starting skills with full data for dynamic descriptions
                heroBuild.skills.forEach((skill, index) => {
                    if (skill && skillsMap[skill.skillId]) {
                        const fullData = skillsMap[skill.skillId];
                        skill.description_template = fullData.description_template || '';
                        skill.description_args = fullData.description_args || [];
                        skill.raw_data = fullData.raw_data || null;
                    }
                });

                // Re-render UI now that skills have full data
                this.updateUI();
            })
            .catch(err => Debug.warn('Could not enrich starting skills:', err));

        // Set up all click handlers (including subskill buttons for starting skills)
        this.updateUI();
    },

    setupClickHandlers() {
        const skillSlots = document.querySelectorAll('.skill-with-subs');
        skillSlots.forEach((slot, index) => {
            const skillMain = slot.querySelector('.skill-main');

            // Check if it's an empty slot
            if (heroBuild.skills[index] === null) {
                skillMain.style.cursor = 'pointer';
                skillMain.onclick = () => window.SkillSelectionModal.open(index);
            }
        });
    },

    addSkill(slotIndex, skillData) {
        heroBuild.skills[slotIndex] = {
            skillId: skillData.id,
            level: 1,
            subskills: [null, null],
            subskillNames: [null, null],
            subskillDescs: [null, null],
            subskillRawData: [null, null],
            name: skillData.name,
            icon: skillData.icon,
            description: skillData.description || '',
            description_template: skillData.description_template || '',
            description_args: skillData.description_args || [],
            raw_data: skillData.raw_data || null
        };
        this.updateUI();
        // Update all descriptions since skill bonuses may affect them
        EquipmentManager.updateAllDescriptions();
        // Update skill-granted spells
        if (typeof window.SpellBookManager !== 'undefined') {
            window.SpellBookManager.updateSkillGrantedSpells();
        }
    },

    getSelectedSkillIds() {
        return heroBuild.skills
            .filter(s => s !== null)
            .map(s => s.skillId);
    },

    levelUpSkill(slotIndex, subskillId, subskillName, subskillDesc, subskillRawData) {
        const skill = heroBuild.skills[slotIndex];
        if (!skill || skill.level >= 3) return;

        // Store subskill at the appropriate index (0 for Basic→Advanced, 1 for Advanced→Expert)
        const subskillIndex = skill.level - 1;
        skill.subskills[subskillIndex] = subskillId;
        skill.subskillNames[subskillIndex] = subskillName;
        skill.subskillDescs[subskillIndex] = subskillDesc || '';
        skill.subskillRawData[subskillIndex] = subskillRawData || null;

        // Increase level
        skill.level++;

        // Update UI and descriptions (skill level affects bonuses)
        this.updateUI();
        EquipmentManager.updateAllDescriptions();
        // Update skill-granted spells (higher levels may grant more spells)
        if (typeof window.SpellBookManager !== 'undefined') {
            window.SpellBookManager.updateSkillGrantedSpells();
        }
    },

    repickSubskill(slotIndex, subskillSlot, subskillId, subskillName, subskillDesc, subskillRawData) {
        const skill = heroBuild.skills[slotIndex];
        if (!skill) return;

        // Replace the subskill at the specified slot (no level change)
        skill.subskills[subskillSlot] = subskillId;
        skill.subskillNames[subskillSlot] = subskillName;
        skill.subskillDescs[subskillSlot] = subskillDesc || '';
        skill.subskillRawData[subskillSlot] = subskillRawData || null;

        // Update UI and descriptions (subskill bonuses may affect item descriptions)
        this.updateUI();
        EquipmentManager.updateAllDescriptions();
        // Update subskill-granted spells (changing subskill may add/remove spells)
        if (typeof window.SpellBookManager !== 'undefined') {
            window.SpellBookManager.updateSkillGrantedSpells();
        }
    },

    removeSkill(slotIndex) {
        const skill = heroBuild.skills[slotIndex];
        if (!skill) return;

        // Can't remove starting skills
        if (heroBuild.startingSkillIds.includes(skill.skillId)) {
            alert(t('ui', 'cannot_remove_starting_skills', 'Cannot remove starting skills'));
            return;
        }

        // Reset slot
        heroBuild.skills[slotIndex] = null;
        this.updateUI();
        // Update descriptions since skill bonuses are removed
        EquipmentManager.updateAllDescriptions();
        // Update skill-granted spells (removed skill's spells should disappear)
        if (typeof window.SpellBookManager !== 'undefined') {
            window.SpellBookManager.updateSkillGrantedSpells();
        }
    },

    updateUI() {
        const skillSlots = document.querySelectorAll('.skill-with-subs');

        heroBuild.skills.forEach((skill, index) => {
            if (index >= skillSlots.length) return;

            const slot = skillSlots[index];
            const skillMain = slot.querySelector('.skill-main');
            const subskillBtns = slot.querySelectorAll('.subskill-btn');

            if (skill === null) {
                // Empty slot - show plus sign
                skillMain.innerHTML = '<span class="skill-add-text">+</span>';
                skillMain.style.cursor = 'pointer';
                skillMain.onclick = () => window.SkillSelectionModal.open(index);
                skillMain.oncontextmenu = null;
                skillMain.removeAttribute('data-skill-id');

                // Disable both subskill buttons
                subskillBtns.forEach(btn => {
                    btn.className = 'subskill-btn disabled';
                    btn.innerHTML = '';
                    btn.onclick = null;
                });
            } else {
                // Filled slot - show skill icon with tooltip
                const iconSuffix = skill.level > 1 ? `_${skill.level}` : '';

                skillMain.className = 'skill-main has-tooltip';
                skillMain.dataset.tooltipPlacement = 'bottom';
                skillMain.innerHTML = `
                    <img src="/media/gamedata/skills/${skill.skillId}${iconSuffix}.webp" alt="${skill.name || skill.skillId}">
                    ${typeof window.AdvancedClassManager !== 'undefined' ? window.AdvancedClassManager.renderSkillIndicators(skill.skillId) : ''}
                    <div class="tooltip tooltip-skill">
                        <div class="tooltip-title">${skill.name || skill.skillId}</div>
                        ${(() => { const desc = EquipmentManager.formatSkillDescription(skill, skill.level); return desc ? `<div class="tooltip-text">${desc}</div>` : ''; })()}
                    </div>
                `;
                skillMain.dataset.skillId = skill.skillId;
                skillMain.dataset.skillLevel = skill.level;

                // Add right-click to remove (only for non-starting skills)
                if (!heroBuild.startingSkillIds.includes(skill.skillId)) {
                    skillMain.oncontextmenu = (e) => {
                        e.preventDefault();
                        if (confirm(`Remove ${skill.name || skill.skillId}?`)) {
                            window.SkillManager.removeSkill(index);
                        }
                    };
                } else {
                    skillMain.oncontextmenu = null;
                }

                // First subskill button
                if (skill.level === 1) {
                    // Can level up to Advanced
                    subskillBtns[0].className = 'subskill-btn';
                    subskillBtns[0].innerHTML = '<span class="add-text">+</span>';
                    subskillBtns[0].onclick = () => window.SubskillSelectionModal.open(index);
                } else if (!skill.subskills[0]) {
                    // Level 2+ but no first subskill yet (e.g., Lord Edgar starts at Advanced)
                    // Allow selecting first subskill without leveling up
                    subskillBtns[0].className = 'subskill-btn';
                    subskillBtns[0].innerHTML = '<span class="add-text">+</span>';
                    subskillBtns[0].onclick = () => window.SubskillSelectionModal.openForRepick(index, 0);
                } else {
                    // Show selected subskill with tooltip - clickable to repick
                    subskillBtns[0].className = 'subskill-btn filled has-tooltip';
                    subskillBtns[0].dataset.tooltipPlacement = 'bottom';
                    subskillBtns[0].innerHTML = `
                        <img src="/media/gamedata/skills/${skill.subskills[0]}_icon.webp">
                        <div class="tooltip tooltip-skill">
                            <div class="tooltip-title">${skill.subskillNames[0] || skill.subskills[0]}</div>
                            ${skill.subskillDescs[0] ? `<div class="tooltip-text">${skill.subskillDescs[0]}</div>` : ''}
                        </div>
                    `;
                    subskillBtns[0].style.cursor = 'pointer';
                    subskillBtns[0].onclick = () => window.SubskillSelectionModal.openForRepick(index, 0);
                }

                // Second subskill button
                if (skill.level < 2) {
                    // Skill is Basic - second subskill not available
                    subskillBtns[1].className = 'subskill-btn disabled';
                    subskillBtns[1].innerHTML = '';
                    subskillBtns[1].onclick = null;
                } else if (skill.level === 2 && skill.subskills[0]) {
                    // Advanced with first subskill - can level up to Expert
                    subskillBtns[1].className = 'subskill-btn';
                    subskillBtns[1].innerHTML = '<span class="add-text">+</span>';
                    subskillBtns[1].onclick = () => window.SubskillSelectionModal.open(index);
                } else if (skill.level === 2 && !skill.subskills[0]) {
                    // Advanced but no first subskill - must pick first subskill first
                    subskillBtns[1].className = 'subskill-btn disabled';
                    subskillBtns[1].innerHTML = '';
                    subskillBtns[1].onclick = null;
                } else if (skill.level === 3 && !skill.subskills[1]) {
                    // Expert but no second subskill yet - allow selecting without level change
                    subskillBtns[1].className = 'subskill-btn';
                    subskillBtns[1].innerHTML = '<span class="add-text">+</span>';
                    subskillBtns[1].onclick = () => window.SubskillSelectionModal.openForRepick(index, 1);
                } else if (skill.subskills[1]) {
                    // Show selected subskill with tooltip - clickable to repick
                    subskillBtns[1].className = 'subskill-btn filled has-tooltip';
                    subskillBtns[1].dataset.tooltipPlacement = 'bottom';
                    subskillBtns[1].innerHTML = `
                        <img src="/media/gamedata/skills/${skill.subskills[1]}_icon.webp">
                        <div class="tooltip tooltip-skill">
                            <div class="tooltip-title">${skill.subskillNames[1] || skill.subskills[1]}</div>
                            ${skill.subskillDescs[1] ? `<div class="tooltip-text">${skill.subskillDescs[1]}</div>` : ''}
                        </div>
                    `;
                    subskillBtns[1].style.cursor = 'pointer';
                    subskillBtns[1].onclick = () => window.SubskillSelectionModal.openForRepick(index, 1);
                }
            }
        });

        // Update advanced class progress tooltip
        if (typeof window.AdvancedClassManager !== 'undefined') {
            window.AdvancedClassManager.updateTooltip();
        }
    }
};

// Expose to window for cross-module access and inline onclick handlers
window.SkillManager = SkillManager;
