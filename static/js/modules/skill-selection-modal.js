/**
 * Skill Selection Modal - UI for choosing skills
 */

import { buildUrl, t } from './utils.js';
import { EquipmentManager } from './equipment-manager.js';

export const SkillSelectionModal = {
    allSkills: [],
    slotIndex: null,

    async open(slotIndex) {
        this.slotIndex = slotIndex;

        // Get faction from hero card data attribute
        const heroFaction = document.querySelector('[data-hero-faction]')?.dataset.heroFaction || '';
        const excludeIds = window.SkillManager.getSelectedSkillIds().join(',');

        // Fetch skills from API
        try {
            const response = await fetch(buildUrl(`/api/skills/available/?faction=${heroFaction}&exclude=${excludeIds}`));
            const data = await response.json();
            // Cache descriptions for search (computed once for performance)
            this.allSkills = (data.skills || []).map(skill => {
                // Compute description using transpiled pipeline if available
                const computedDesc = EquipmentManager.formatSkillDescription(skill, 1);
                return {
                    ...skill,
                    _computedDescription: computedDesc,
                    _cachedDescription: (computedDesc || skill.description || '').toLowerCase()
                };
            });
            this.render(this.allSkills);
        } catch (error) {
            console.error('Error fetching skills:', error);
            // Show error state
            const container = document.getElementById('skill-modal-container');
            container.innerHTML = `
                <div class="modal-overlay" onclick="window.SkillSelectionModal.close()">
                    <div class="skill-modal" onclick="event.stopPropagation()">
                        <div class="modal-header">
                            <h2>${t('ui', 'select_skill', 'Select Skill')}</h2>
                            <p style="color: #ff6666;">${t('ui', 'error_loading_skills', 'Error loading skills. Please try again.')}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    render(skills) {
        const container = document.getElementById('skill-modal-container');
        container.innerHTML = `
            <div class="modal-overlay" onclick="window.SkillSelectionModal.close()">
                <div class="skill-modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>${t('ui', 'select_skill', 'Select Skill')}</h2>
                        <input type="text"
                               class="skill-search"
                               placeholder="${t('ui', 'search_skills_placeholder', 'Search skills...')}"
                               oninput="window.SkillSelectionModal.filter(this.value)">
                    </div>
                    <div class="skill-list" id="skill-list">
                        ${skills.map(s => this.renderSkillOption(s)).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderSkillOption(skill) {
        // Use computed description (from transpiled pipeline) or fallback to pre-computed
        const displayDescription = skill._computedDescription || skill.description;
        return `
            <div class="skill-option" data-skill-id="${skill.id}"
                 onclick="window.SkillSelectionModal.select('${skill.id}')">
                <div class="skill-icon-wrapper">
                    <img src="/media/gamedata/skills/${skill.icon}.webp" class="skill-icon" alt="${skill.name}">
                    ${typeof window.AdvancedClassManager !== 'undefined' ? window.AdvancedClassManager.renderSkillIndicators(skill.id) : ''}
                </div>
                <div class="skill-info">
                    <div class="skill-name">${skill.name.toUpperCase()}</div>
                    <div class="skill-desc">${displayDescription}</div>
                </div>
                <div class="subskill-previews">
                    ${(skill.subskill_preview || []).map(sub =>
                        `<div class="subskill-preview-wrapper has-tooltip" data-tooltip-placement="bottom">
                            <img src="/media/gamedata/skills/${sub.icon}.webp" class="subskill-preview-icon" alt="${sub.name}">
                            <div class="tooltip tooltip-skill">
                                <div class="tooltip-title">${sub.name}</div>
                                <div class="tooltip-text">${sub.description}</div>
                            </div>
                        </div>`
                    ).join('')}
                </div>
            </div>
        `;
    },

    filter(searchText) {
        const search = searchText.toLowerCase();
        const filtered = this.allSkills.filter(s =>
            s.name.toLowerCase().includes(search) ||
            (s._cachedDescription && s._cachedDescription.includes(search))
        );
        document.getElementById('skill-list').innerHTML =
            filtered.map(s => this.renderSkillOption(s)).join('');
    },

    select(skillId) {
        const skill = this.allSkills.find(s => s.id === skillId);
        if (skill) {
            window.SkillManager.addSkill(this.slotIndex, skill);
        }
        this.close();
    },

    close() {
        document.getElementById('skill-modal-container').innerHTML = '';
    }
};

// Expose to window for inline onclick handlers
window.SkillSelectionModal = SkillSelectionModal;
