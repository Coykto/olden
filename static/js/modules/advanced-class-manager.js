/**
 * Advanced Class Manager - Handles advanced class progression and skill requirements
 */

import { heroBuild } from './state.js';
import { buildUrl } from './utils.js';

export const AdvancedClassManager = {
    advancedClasses: [],  // Cached from API
    skillIndicators: {},  // Cached skill -> class mapping
    baseClassName: '',     // Base class name like "Cleric"
    baseClassDescription: '', // Base class description
    baseClassIconUrl: '',  // Original class badge icon URL

    async init() {
        // Get hero faction and class_type from DOM
        const heroCard = document.querySelector('[data-hero-faction]');
        const heroFaction = heroCard?.dataset.heroFaction || '';
        const heroClassType = heroCard?.dataset.heroClassType || '';

        if (!heroFaction || !heroClassType) return;

        // Fetch advanced classes (includes base class info)
        try {
            const response = await fetch(buildUrl(`/api/advanced-classes/?faction=${heroFaction}&class_type=${heroClassType}`));
            const data = await response.json();
            this.advancedClasses = data.advanced_classes || [];
            this.baseClassName = data.base_class_name || heroClassType;
            this.baseClassDescription = data.base_class_description || '';
            this.baseClassIconUrl = data.base_class_icon_url || '';
        } catch (e) {
            console.error('Error fetching advanced classes:', e);
        }

        // Fetch skill indicators
        try {
            const indicatorResponse = await fetch(buildUrl(`/api/advanced-classes/skill-indicators/?faction=${heroFaction}&class_type=${heroClassType}`));
            const indicatorData = await indicatorResponse.json();
            this.skillIndicators = indicatorData.skill_indicators || {};
        } catch (e) {
            console.error('Error fetching skill indicators:', e);
        }

        // Setup tooltip
        this.setupClassBadgeTooltip();

        // Refresh skill UI to add indicators to starting skills
        window.SkillManager.updateUI();
    },

    getSkillIndicators(skillId) {
        return this.skillIndicators[skillId] || [];
    },

    renderSkillIndicators(skillId) {
        const indicators = this.getSkillIndicators(skillId);
        if (indicators.length === 0) return '';

        return `<div class="skill-indicators">
            ${indicators.map(ind => `<img src="${ind.icon_url}" class="skill-indicator-icon" alt="${ind.class_id}">`).join('')}
        </div>`;
    },

    setupClassBadgeTooltip() {
        const wrapper = document.querySelector('.class-badge-wrapper');
        if (!wrapper) return;

        // Create tooltip content
        this.updateTooltip();
    },

    updateTooltip() {
        const wrapper = document.querySelector('.class-badge-wrapper');
        if (!wrapper) return;

        // Remove existing tooltip
        const existing = wrapper.querySelector('.tooltip');
        if (existing) existing.remove();

        // Build tooltip HTML
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip tooltip-class';
        tooltip.innerHTML = this.renderTooltipContent();
        wrapper.appendChild(tooltip);

        // Also update the class badge icon if needed
        this.updateClassBadge();
    },

    renderTooltipContent() {
        // Get specialization data from DOM
        const wrapper = document.querySelector('.class-badge-wrapper');
        const specName = wrapper?.dataset.specName || '';
        const specTemplate = wrapper?.dataset.specTemplate || '';
        const specArgs = JSON.parse(wrapper?.dataset.specArgs || '[]');
        const specRaw = JSON.parse(wrapper?.dataset.specRaw || '{}');

        // Format specialization description using the entity description pipeline
        // Pass the raw specialization data as currentSpecialization context
        let specDesc = specTemplate;
        if (specArgs.length > 0 && typeof window.DescriptionRuntime !== 'undefined') {
            const ctx = { currentSpecialization: specRaw };
            specDesc = window.DescriptionRuntime.formatDescription(specTemplate, specArgs, ctx);
        }

        let html = `
            <div class="tooltip-header">
                <div class="tooltip-title tooltip-title--gold">${specName}</div>
                <div class="tooltip-text">${specDesc}</div>
            </div>
        `;

        // Advanced classes
        if (this.advancedClasses.length > 0) {
            html += '<div class="tooltip-divider"></div>';

            for (const advClass of this.advancedClasses) {
                const progress = this.calculateProgress(advClass);
                // Format advanced class description using the entity description pipeline
                let advDesc = advClass.description;
                if (advClass.description_args?.length > 0 && typeof window.DescriptionRuntime !== 'undefined') {
                    advDesc = window.DescriptionRuntime.formatDescription(advClass.description_template || advClass.description, advClass.description_args, {});
                }
                html += `
                    <div class="advanced-class-section">
                        <div class="advanced-class-header">
                            <img src="${advClass.icon_url}" class="advanced-class-icon" alt="${advClass.name}">
                            <span class="advanced-class-name">${advClass.name}</span>
                            <span class="advanced-class-progress">${progress}/5</span>
                        </div>
                        <div class="advanced-class-progress-bar">
                            <div class="progress-fill" style="width: ${progress * 20}%"></div>
                        </div>
                        <div class="advanced-class-desc">${advDesc}</div>
                    </div>
                `;
            }
        }

        return html;
    },

    calculateProgress(advClass) {
        // For now return 0, will be implemented in Slice 4
        let count = 0;
        for (const condition of advClass.activation_conditions) {
            const skillId = condition.skillSid;
            const requiredLevel = condition.skillLevel;

            // Check if hero has this skill at required level
            const heroSkill = heroBuild.skills.find(s => s && s.skillId === skillId);
            if (heroSkill && heroSkill.level >= requiredLevel) {
                count++;
            }
        }
        return count;
    },

    checkEligibility() {
        // Find first advanced class with 5/5 progress
        for (const advClass of this.advancedClasses) {
            if (this.calculateProgress(advClass) >= 5) {
                return advClass;
            }
        }
        return null;
    },

    updateClassBadge() {
        const classBadge = document.querySelector('.class-badge');
        if (!classBadge) return;

        const achievedClass = this.checkEligibility();

        if (achievedClass) {
            // Update badge to advanced class icon
            classBadge.src = achievedClass.icon_url;
        } else {
            // Revert to base class icon
            classBadge.src = this.baseClassIconUrl;
        }
    }
};

// Expose to window for cross-module access
window.AdvancedClassManager = AdvancedClassManager;
