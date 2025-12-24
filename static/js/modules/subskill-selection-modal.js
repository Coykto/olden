/**
 * Subskill Selection Modal - UI for choosing subskills when leveling up skills
 */

import { heroBuild } from './state.js';
import { buildUrl } from './utils.js';
import { EquipmentManager } from './equipment-manager.js';

export const SubskillSelectionModal = {
    slotIndex: null,
    subskillSlot: null,  // 0 or 1, for repicking
    isRepick: false,
    currentSubskills: [],  // Store fetched subskills for raw_data access

    async open(slotIndex) {
        this.slotIndex = slotIndex;
        this.subskillSlot = null;
        this.isRepick = false;
        const skill = heroBuild.skills[slotIndex];
        if (!skill) return;

        const nextLevel = skill.level + 1;
        if (nextLevel > 3) return;  // Already at max level

        try {
            const response = await fetch(buildUrl(`/api/skills/${skill.skillId}/level/${nextLevel}/subskills/`));
            if (!response.ok) throw new Error('Failed to fetch subskills');
            const data = await response.json();
            this.render(data);
        } catch (error) {
            console.error('Error loading subskills:', error);
        }
    },

    async openForRepick(slotIndex, subskillSlot) {
        this.slotIndex = slotIndex;
        this.subskillSlot = subskillSlot;
        this.isRepick = true;
        const skill = heroBuild.skills[slotIndex];
        if (!skill) return;

        // subskillSlot 0 = level 2 subskills, subskillSlot 1 = level 3 subskills
        const level = subskillSlot + 2;

        try {
            const response = await fetch(buildUrl(`/api/skills/${skill.skillId}/level/${level}/subskills/`));
            if (!response.ok) throw new Error('Failed to fetch subskills');
            const data = await response.json();
            this.render(data);
        } catch (error) {
            console.error('Error loading subskills:', error);
        }
    },

    render(data) {
        // Store subskills for raw_data access in select()
        this.currentSubskills = data.subskills;

        // Get the skill from heroBuild to use its template/args for dynamic formatting
        const skill = heroBuild.skills[this.slotIndex];
        // Compute description dynamically at the new level
        const skillDesc = skill ?
            EquipmentManager.formatSkillDescription(skill, data.skill.level) :
            data.skill.description;

        const container = document.getElementById('skill-modal-container');
        container.innerHTML = `
            <div class="modal-overlay" onclick="window.SubskillSelectionModal.close()">
                <div class="subskill-modal" onclick="event.stopPropagation()">
                    <div class="upgraded-skill">
                        <img src="/media/gamedata/skills/${data.skill.icon}.webp" class="skill-icon-large">
                        <div class="skill-info">
                            <div class="skill-name">${data.skill.name.toUpperCase()}</div>
                            <div class="skill-desc">${skillDesc}</div>
                        </div>
                    </div>
                    <div class="subskill-options">
                        ${data.subskills.map(sub => this.renderSubskillOption(sub)).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderSubskillOption(subskill) {
        // Compute description dynamically using the Entity Description Pipeline
        const subskillDesc = EquipmentManager.formatSubskillDescription(subskill);

        return `
            <div class="subskill-option" onclick="window.SubskillSelectionModal.select('${subskill.id}')">
                <img src="/media/gamedata/skills/${subskill.icon}.webp" class="subskill-icon">
                <div class="subskill-info">
                    <div class="subskill-name">${subskill.name}</div>
                    <div class="subskill-desc">${subskillDesc}</div>
                </div>
            </div>
        `;
    },

    select(subskillId) {
        // Find the full subskill data from stored subskills
        const subskill = this.currentSubskills.find(s => s.id === subskillId);
        const subskillName = subskill?.name || subskillId;
        const subskillDesc = subskill ? EquipmentManager.formatSubskillDescription(subskill) : '';
        const subskillRawData = subskill?.raw_data || null;

        if (this.isRepick) {
            window.SkillManager.repickSubskill(this.slotIndex, this.subskillSlot, subskillId, subskillName, subskillDesc, subskillRawData);
        } else {
            window.SkillManager.levelUpSkill(this.slotIndex, subskillId, subskillName, subskillDesc, subskillRawData);
        }
        this.close();
    },

    close() {
        document.getElementById('skill-modal-container').innerHTML = '';
    }
};

// Expose to window for inline onclick handlers
window.SubskillSelectionModal = SubskillSelectionModal;
