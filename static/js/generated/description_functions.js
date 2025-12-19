/**
 * Auto-generated description functions from Olden Era .script files
 * Generated at: 2025-12-18T22:25:11.353Z
 * DO NOT EDIT - This file is regenerated during import_gamedata
 */

// @ts-nocheck
/* eslint-disable */

const DescriptionFunctions = {};

// Source: DB/info/info_item/item.script:1
DescriptionFunctions["current_item_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let level = DescriptionRuntime.get(ctx.currentItem, "level");
  let baseData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].parameters[1]");
  let upgData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].upgrade.increment");
  let upgCount = (Number(level) || 0) - (Number(1) || 0);
  let upgValue = (Number(upgData) || 0) * (Number(upgCount) || 0);
  let itemData = (Number(baseData) || 0) + (Number(upgValue) || 0);
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/item.script:15
DescriptionFunctions["current_item_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let level = DescriptionRuntime.get(ctx.currentItem, "level");
  let baseData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[1].parameters[1]");
  let upgData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[1].upgrade.increment");
  let upgCount = (Number(level) || 0) - (Number(1) || 0);
  let upgValue = (Number(upgData) || 0) * (Number(upgCount) || 0);
  let itemData = (Number(baseData) || 0) + (Number(upgValue) || 0);
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/item.script:31
DescriptionFunctions["current_item_increment_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let itemData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].upgrade.increment");
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/item.script:38
DescriptionFunctions["current_item_increment_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let itemData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[1].upgrade.increment");
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/item.script:47
DescriptionFunctions["current_item_param_1_percent"] = DescriptionRuntime.memoize(function(ctx) {
  let level = DescriptionRuntime.get(ctx.currentItem, "level");
  let baseData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].parameters[1]");
  let upgData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].upgrade.increment");
  let upgCount = (Number(level) || 0) - (Number(1) || 0);
  let upgValue = (Number(upgData) || 0) * (Number(upgCount) || 0);
  let itemData = (Number(baseData) || 0) + (Number(upgValue) || 0);
  return DescriptionRuntime.formatModPercentNumeric(itemData);
}, 5);

// Source: DB/info/info_item/item.script:61
DescriptionFunctions["current_item_param_2_percent"] = DescriptionRuntime.memoize(function(ctx) {
  let level = DescriptionRuntime.get(ctx.currentItem, "level");
  let baseData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[1].parameters[1]");
  let upgData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[1].upgrade.increment");
  let upgCount = (Number(level) || 0) - (Number(1) || 0);
  let upgValue = (Number(upgData) || 0) * (Number(upgCount) || 0);
  let itemData = (Number(baseData) || 0) + (Number(upgValue) || 0);
  return DescriptionRuntime.formatModPercentNumeric(itemData);
}, 5);

// Source: DB/info/info_item/item.script:75
DescriptionFunctions["current_item_param_1_int"] = DescriptionRuntime.memoize(function(ctx) {
  let itemData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/item.script:82
DescriptionFunctions["current_item_param_1_int_modifier"] = DescriptionRuntime.memoize(function(ctx) {
  let level = DescriptionRuntime.get(ctx.currentItem, "level");
  let baseData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].parameters[3]");
  let upgData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[1].parameters[3]");
  let upgCount = (Number(level) || 0) - (Number(1) || 0);
  let upgValue = (Number(upgData) || 0) * (Number(upgCount) || 0);
  let itemData = (Number(baseData) || 0) + (Number(upgValue) || 0);
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/item.script:96
DescriptionFunctions["current_item_param_2_int_modifier"] = DescriptionRuntime.memoize(function(ctx) {
  let level = DescriptionRuntime.get(ctx.currentItem, "level");
  let baseData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].parameters[3]");
  let upgData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[1].parameters[3]");
  let upgCount = (Number(level) || 0) - (Number(1) || 0);
  let upgValue = (Number(upgData) || 0) * (Number(upgCount) || 0);
  let itemData = (Number(baseData) || 0) + (Number(upgValue) || 0);
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/item.script:110
DescriptionFunctions["current_item_param_1_modifier"] = DescriptionRuntime.memoize(function(ctx) {
  let level = DescriptionRuntime.get(ctx.currentItem, "level");
  let baseData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].parameters[3]");
  let upgData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[1].parameters[3]");
  let upgCount = (Number(level) || 0) - (Number(1) || 0);
  let upgValue = (Number(upgData) || 0) * (Number(upgCount) || 0);
  let itemData = (Number(baseData) || 0) + (Number(upgValue) || 0);
  return DescriptionRuntime.formatModPercentNumeric(itemData);
}, 5);

// Source: DB/info/info_item/item.script:124
DescriptionFunctions["current_item_param_2_modifier"] = DescriptionRuntime.memoize(function(ctx) {
  let itemData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[1].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(itemData);
}, 5);

// Source: DB/info/info_item/item.script:133
DescriptionFunctions["current_item_increment_param_1_percent"] = DescriptionRuntime.memoize(function(ctx) {
  let itemData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].upgrade.increment");
  return DescriptionRuntime.formatModPercentNumeric(itemData);
}, 5);

// Source: DB/info/info_item/item.script:140
DescriptionFunctions["current_item_increment_param_2_percent"] = DescriptionRuntime.memoize(function(ctx) {
  let itemData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[1].upgrade.increment");
  return DescriptionRuntime.formatModPercentNumeric(itemData);
}, 5);

// Source: DB/info/info_item/item.script:149
DescriptionFunctions["current_item_shamaniac_soul_gemwood_mask_artifact_param"] = DescriptionRuntime.memoize(function(ctx) {
  let viewRadius = DescriptionRuntime.get(ctx.currentHero, "heroStat.viewRadius");
  let heroRadius = (Number(viewRadius) || 0) * (Number("3") || 0);
  return DescriptionRuntime.formatModInt(heroRadius);
}, 5);

// Source: DB/info/info_item/item.script:158
DescriptionFunctions["current_item_shamaniac_soul_gemwood_mask_artifact_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let itemData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/item.script:165
DescriptionFunctions["current_item_shamaniac_soul_gemwood_mask_artifact_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let itemData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[1].parameters[2]");
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/item.script:174
DescriptionFunctions["current_item_ethereal_knowledge_third_eye_artifact_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let itemData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/item.script:181
DescriptionFunctions["current_item_ethereal_knowledge_third_eye_artifact_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let itemData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[1].parameters[2]");
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/item.script:190
DescriptionFunctions["current_item_ethereal_knowledge_vortex_dress_artifact_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_item/item.script:195
DescriptionFunctions["current_item_ethereal_knowledge_vortex_dress_artifact_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_item/item.script:202
DescriptionFunctions["current_item_magic_key_ring_artifact_param"] = DescriptionRuntime.memoize(function(ctx) {
  let itemData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].parameters[0]");
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/item.script:211
DescriptionFunctions["current_item_chain_link_artifact_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_item/item.script:216
DescriptionFunctions["current_item_chain_link_artifact_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_item/item.script:223
DescriptionFunctions["excalibur_artifact_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_item/item.script:228
DescriptionFunctions["caduceus_artifact_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_item/item.script:233
DescriptionFunctions["seal_of_silence_artifact_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("0");
}, 5);

// Source: DB/info/info_item/item.script:238
DescriptionFunctions["ancient_idol_artifact_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("40");
}, 5);

// Source: DB/info/info_item/item.script:243
DescriptionFunctions["orb_of_destruction_artifact_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_item/item.script:248
DescriptionFunctions["current_item_bonuses_parameters_2"] = DescriptionRuntime.memoize(function(ctx) {
  let itemData = DescriptionRuntime.get(ctx.currentItem, "config.bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModInt(itemData);
}, 5);

// Source: DB/info/info_item/items_set.script:3
DescriptionFunctions["current_shamaniac_soul_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:12
DescriptionFunctions["current_knights_honor_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:19
DescriptionFunctions["current_knights_honor_item_set_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[1].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:28
DescriptionFunctions["current_ukhtabar_seal_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:37
DescriptionFunctions["current_milos_curse_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:46
DescriptionFunctions["current_paupers_glory_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:53
DescriptionFunctions["current_paupers_glory_item_set_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[1].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:60
DescriptionFunctions["current_paupers_glory_item_set_param_3"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[2].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:69
DescriptionFunctions["current_angelic_alliance_item_set_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[1].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:78
DescriptionFunctions["current_elixir_of_life_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_item/items_set.script:88
DescriptionFunctions["current_elixir_of_life_item_set_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[1].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:97
DescriptionFunctions["current_shadow_of_death_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:104
DescriptionFunctions["current_shadow_of_death_item_set_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[1].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:113
DescriptionFunctions["current_living_arrows_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:122
DescriptionFunctions["current_duelists_pride_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:131
DescriptionFunctions["current_ethereal_knowledge_item_set"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:140
DescriptionFunctions["current_power_of_the_dragon_father_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:149
DescriptionFunctions["current_beelzebubs_blessing_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:158
DescriptionFunctions["current_rule_of_shadow_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:167
DescriptionFunctions["current_warriors_strength_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:174
DescriptionFunctions["current_keepers_fortitude_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:181
DescriptionFunctions["current_wizards_might_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_item/items_set.script:188
DescriptionFunctions["current_scholars_wisdom_item_set_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let setData = DescriptionRuntime.get(ctx.currentItemSet, "config.bonuses[0].heroBonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(setData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:1
DescriptionFunctions["current_skill_assault_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:10
DescriptionFunctions["current_sub_skill_assault_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:17
DescriptionFunctions["current_sub_skill_assault_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:24
DescriptionFunctions["current_sub_skill_assault_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:31
DescriptionFunctions["current_sub_skill_assault_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:38
DescriptionFunctions["current_sub_skill_assault_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:47
DescriptionFunctions["current_skill_protection_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:56
DescriptionFunctions["current_sub_skill_protection_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:63
DescriptionFunctions["current_sub_skill_protection_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:70
DescriptionFunctions["current_sub_skill_protection_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:77
DescriptionFunctions["current_sub_skill_protection_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:84
DescriptionFunctions["current_sub_skill_protection_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:93
DescriptionFunctions["current_skill_leadership_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:102
DescriptionFunctions["current_sub_skill_leadership_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:109
DescriptionFunctions["current_sub_skill_leadership_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:116
DescriptionFunctions["current_sub_skill_leadership_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:121
DescriptionFunctions["current_sub_skill_leadership_4_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:128
DescriptionFunctions["current_sub_skill_leadership_4_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[3].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:135
DescriptionFunctions["current_sub_skill_leadership_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:144
DescriptionFunctions["current_skill_luck_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:153
DescriptionFunctions["current_sub_skill_luck_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:160
DescriptionFunctions["current_sub_skill_luck_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:167
DescriptionFunctions["current_sub_skill_luck_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:174
DescriptionFunctions["current_sub_skill_luck_5_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("150");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:179
DescriptionFunctions["current_sub_skill_luck_5_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:186
DescriptionFunctions["current_skill_economy_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:195
DescriptionFunctions["current_sub_skill_economy_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:202
DescriptionFunctions["current_sub_skill_economy_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[0]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:209
DescriptionFunctions["current_sub_skill_economy_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:216
DescriptionFunctions["current_sub_skill_economy_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:225
DescriptionFunctions["current_skill_logistic_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:234
DescriptionFunctions["current_sub_skill_logistic_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:241
DescriptionFunctions["current_sub_skill_logistic_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:248
DescriptionFunctions["current_sub_skill_logistic_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:255
DescriptionFunctions["current_sub_skill_logistic_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:264
DescriptionFunctions["current_skill_enlightenment_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:273
DescriptionFunctions["current_sub_skill_enlightenment_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:280
DescriptionFunctions["current_sub_skill_enlightenment_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:287
DescriptionFunctions["current_sub_skill_enlightenment_3"] = DescriptionRuntime.memoize(function(ctx) {
  let viewRadius = DescriptionRuntime.get(ctx.currentHero, "heroStat.viewRadius");
  let heroRadius = (Number(viewRadius) || 0) * (Number("3") || 0);
  return DescriptionRuntime.formatModInt(heroRadius);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:296
DescriptionFunctions["current_sub_skill_enlightenment_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:305
DescriptionFunctions["current_skill_sorcery_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:314
DescriptionFunctions["current_sub_skill_sorcery_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:321
DescriptionFunctions["current_sub_skill_sorcery_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:328
DescriptionFunctions["current_sub_skill_sorcery_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:335
DescriptionFunctions["current_sub_skill_sorcery_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:344
DescriptionFunctions["current_skill_magic"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:351
DescriptionFunctions["current_skill_magic_2"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[1].parameters[3]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:358
DescriptionFunctions["current_skill_magic_3"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[2].parameters[2]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:367
DescriptionFunctions["current_sub_skill_magic_day_2"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:374
DescriptionFunctions["current_sub_skill_magic_day_3"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:381
DescriptionFunctions["current_sub_skill_magic_day_4_1"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:388
DescriptionFunctions["current_sub_skill_magic_day_4_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:393
DescriptionFunctions["current_sub_skill_magic_day_5"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:402
DescriptionFunctions["current_sub_skill_magic_night_3"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:409
DescriptionFunctions["current_sub_skill_magic_night_4_1"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:416
DescriptionFunctions["current_sub_skill_magic_night_4_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:421
DescriptionFunctions["current_sub_skill_magic_night_5"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:430
DescriptionFunctions["current_sub_skill_magic_space_2"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:437
DescriptionFunctions["current_sub_skill_magic_space_3"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:444
DescriptionFunctions["current_sub_skill_magic_space_4_1"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:451
DescriptionFunctions["current_sub_skill_magic_space_4_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:456
DescriptionFunctions["current_sub_skill_magic_space_5"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:465
DescriptionFunctions["current_sub_skill_primal_space_2"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:472
DescriptionFunctions["current_sub_skill_primal_space_3"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:479
DescriptionFunctions["current_sub_skill_primal_space_4_1"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:486
DescriptionFunctions["current_sub_skill_primal_space_4_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:491
DescriptionFunctions["current_sub_skill_primal_space_5"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:500
DescriptionFunctions["current_skill_battlemage_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[1].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:509
DescriptionFunctions["current_sub_skill_battlemage_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:514
DescriptionFunctions["current_sub_skill_battlemage_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:519
DescriptionFunctions["current_sub_skill_battlemage_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:524
DescriptionFunctions["current_sub_skill_battlemage_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:531
DescriptionFunctions["current_sub_skill_battlemage_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:540
DescriptionFunctions["current_skill_resistance_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:549
DescriptionFunctions["current_sub_skill_resistance_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:556
DescriptionFunctions["current_sub_skill_resistance_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:563
DescriptionFunctions["current_sub_skill_resistance_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:570
DescriptionFunctions["current_sub_skill_resistance_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:579
DescriptionFunctions["current_skill_diplomacy_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[1].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:588
DescriptionFunctions["current_sub_skill_diplomacy_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:595
DescriptionFunctions["current_sub_skill_diplomacy_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:602
DescriptionFunctions["current_sub_skill_diplomacy_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:609
DescriptionFunctions["current_sub_skill_diplomacy_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:616
DescriptionFunctions["current_sub_skill_diplomacy_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:625
DescriptionFunctions["current_skill_mastery_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:634
DescriptionFunctions["current_sub_skill_mastery_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:641
DescriptionFunctions["current_sub_skill_mastery_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:648
DescriptionFunctions["current_sub_skill_mastery_3_param_old"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:655
DescriptionFunctions["current_sub_skill_mastery_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:662
DescriptionFunctions["current_sub_skill_mastery_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:669
DescriptionFunctions["current_skill_scouting_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:678
DescriptionFunctions["current_sub_skill_scouting_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:685
DescriptionFunctions["current_sub_skill_scouting_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:692
DescriptionFunctions["current_sub_skill_scouting_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:699
DescriptionFunctions["current_sub_skill_scouting_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let viewRadius = DescriptionRuntime.get(ctx.currentHero, "heroStat.viewRadius");
  let heroRadius = (Number(viewRadius) || 0) * (Number("3") || 0);
  return DescriptionRuntime.formatModInt(heroRadius);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:708
DescriptionFunctions["current_sub_skill_scouting_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let viewRadius = DescriptionRuntime.get(ctx.currentHero, "heroStat.viewRadius");
  let heroRadius = (Number(viewRadius) || 0) * (Number("2") || 0);
  return DescriptionRuntime.formatModInt(heroRadius);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:719
DescriptionFunctions["current_skill_formation_param"] = DescriptionRuntime.memoize(function(ctx) {
  let sideBuff = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  let buffData = DescriptionRuntime.get(GameData.sidebuffs?.[sideBuff], "actions[0].damageDealer.buff.sid");
  let skillData = DescriptionRuntime.get(GameData.buffs?.[buffData], "data.stats.offencePerc");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:730
DescriptionFunctions["current_sub_skill_formation_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:737
DescriptionFunctions["current_sub_skill_formation_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:744
DescriptionFunctions["current_sub_skill_formation_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:751
DescriptionFunctions["current_sub_skill_formation_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:760
DescriptionFunctions["current_skill_tactics_param"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[1].parameters[1]");
  let skillData2 = (Number(skillData) || 0) + (Number("1") || 0);
  return DescriptionRuntime.formatModInt(skillData2);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:770
DescriptionFunctions["current_sub_skill_tactics_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:775
DescriptionFunctions["current_sub_skill_tactics_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let sideBuff = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  let buffData = DescriptionRuntime.get(GameData.sidebuffs?.[sideBuff], "actions[0].damageDealer.buff.sid");
  let skillData = DescriptionRuntime.get(GameData.buffs?.[buffData], "data.stats.initiative");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:784
DescriptionFunctions["current_sub_skill_tactics_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:789
DescriptionFunctions["current_sub_skill_tactics_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:796
DescriptionFunctions["current_skill_trainer_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:803
DescriptionFunctions["current_skill_trainer_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[1].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:810
DescriptionFunctions["current_skill_trainer_param_3"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[2].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:817
DescriptionFunctions["current_skill_trainer_param_4"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[3].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:826
DescriptionFunctions["current_sub_skill_trainer_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:833
DescriptionFunctions["current_sub_skill_trainer_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:840
DescriptionFunctions["current_sub_skill_trainer_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:847
DescriptionFunctions["current_sub_skill_trainer_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:856
DescriptionFunctions["current_sub_skill_summoner_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:863
DescriptionFunctions["current_sub_skill_summoner_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:870
DescriptionFunctions["current_sub_skill_summoner_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:877
DescriptionFunctions["current_sub_skill_summoner_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:882
DescriptionFunctions["current_sub_skill_summoner_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:891
DescriptionFunctions["current_skill_siege_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:896
DescriptionFunctions["current_skill_siege_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:901
DescriptionFunctions["current_skill_siege_param_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("150");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:908
DescriptionFunctions["current_sub_skill_siege_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:913
DescriptionFunctions["current_sub_skill_siege_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:918
DescriptionFunctions["current_sub_skill_siege_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:925
DescriptionFunctions["current_skill_pseudo_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:930
DescriptionFunctions["current_skill_pseudo_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill.script:935
DescriptionFunctions["current_skill_pseudo_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:3
DescriptionFunctions["current_skill_warrior_ability_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let abilitySid = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[0]");
  let abilityLevel = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  let minBaseDmg = DescriptionRuntime.get(GameData.abilitys?.[abilitySid], "");
  let maxBaseDmg = DescriptionRuntime.get(GameData.abilitys?.[abilitySid], "");
  let baseDmg = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatInt(baseDmg);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:15
DescriptionFunctions["current_skill_warrior_ability_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let abilitySid = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[0]");
  let abilityLevel = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  let damageMultiplerPerHeroLevel = DescriptionRuntime.get(GameData.abilitys?.[abilitySid], "");
  return DescriptionRuntime.formatModPercentNumeric(damageMultiplerPerHeroLevel);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:26
DescriptionFunctions["current_sub_skill_warrior_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:31
DescriptionFunctions["current_sub_skill_warrior_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("20");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:36
DescriptionFunctions["current_sub_skill_warrior_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:43
DescriptionFunctions["current_sub_skill_warrior_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:52
DescriptionFunctions["current_skill_mage_ability_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  let abilitySid = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[0]");
  let abilityLevel = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  let minBaseDmg = DescriptionRuntime.get(GameData.abilitys?.[abilitySid], "");
  let maxBaseDmg = DescriptionRuntime.get(GameData.abilitys?.[abilitySid], "");
  let baseDmg = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatInt(baseDmg);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:64
DescriptionFunctions["current_skill_mage_ability_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  let abilitySid = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[0]");
  let abilityLevel = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  let minStackDmg = DescriptionRuntime.get(GameData.abilitys?.[abilitySid], "");
  return DescriptionRuntime.formatModInt(minStackDmg);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:75
DescriptionFunctions["current_sub_skill_mage_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:80
DescriptionFunctions["current_sub_skill_mage_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:85
DescriptionFunctions["current_sub_skill_mage_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:90
DescriptionFunctions["current_sub_skill_mage_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:97
DescriptionFunctions["current_sub_skill_mage_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:106
DescriptionFunctions["current_skill_wisdom"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[1].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:115
DescriptionFunctions["current_sub_skill_wisdom_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:122
DescriptionFunctions["current_sub_skill_wisdom_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:129
DescriptionFunctions["current_sub_skill_wisdom_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:136
DescriptionFunctions["current_sub_skill_wisdom_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:143
DescriptionFunctions["current_sub_skill_wisdom_4_param_alt"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("20");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:148
DescriptionFunctions["current_sub_skill_wisdom_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:155
DescriptionFunctions["current_skill_faction_humans"] = DescriptionRuntime.memoize(function(ctx) {
  let sideBuff = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  let buffData = DescriptionRuntime.get(GameData.sidebuffs?.[sideBuff], "actions[0].damageDealer.buff.sid");
  let skillData = DescriptionRuntime.get(GameData.buffs?.[buffData], "data.stats.hpPerc");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:166
DescriptionFunctions["current_sub_skill_faction_humans_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:173
DescriptionFunctions["current_sub_skill_faction_humans_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let sideBuff = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  let buffData = DescriptionRuntime.get(GameData.sidebuffs?.[sideBuff], "actions[0].damageDealer.buff.sid");
  let skillData = DescriptionRuntime.get(GameData.buffs?.[buffData], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:182
DescriptionFunctions["current_sub_skill_faction_humans_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:189
DescriptionFunctions["current_skill_faction_undead"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[1].parameters[1]");
  return DescriptionRuntime.formatModFloatPercentF1(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:198
DescriptionFunctions["current_sub_skill_faction_undead_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:205
DescriptionFunctions["current_sub_skill_faction_undead_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[0]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:213
DescriptionFunctions["current_sub_skill_faction_undead_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModFloatPercentF1(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:220
DescriptionFunctions["current_sub_skill_faction_undead_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:227
DescriptionFunctions["current_sub_skill_faction_undead_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:234
DescriptionFunctions["current_skill_faction_demons"] = DescriptionRuntime.memoize(function(ctx) {
  let abilitySid = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[0]");
  let abilityLevel = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  let summonSid = DescriptionRuntime.get(GameData.abilitys?.[abilitySid], "");
  let summonData = DescriptionRuntime.get(GameData.obstacles?.[summonSid], "onTimeoutMechanic.values[2]");
  return DescriptionRuntime.formatModPercentNumeric(summonData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:246
DescriptionFunctions["current_sub_skill_faction_demons_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:253
DescriptionFunctions["current_sub_skill_faction_demons_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:258
DescriptionFunctions["current_sub_skill_faction_demons_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:265
DescriptionFunctions["current_sub_skill_faction_demons_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:272
DescriptionFunctions["current_sub_skill_faction_demons_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:281
DescriptionFunctions["current_skill_faction_unfrozen_1"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[1].parameters[3]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:288
DescriptionFunctions["current_skill_faction_unfrozen_2"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[2].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:297
DescriptionFunctions["current_sub_skill_faction_unfrozen_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:304
DescriptionFunctions["current_sub_skill_faction_unfrozen_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:311
DescriptionFunctions["current_sub_skill_faction_unfrozen_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:318
DescriptionFunctions["current_sub_skill_faction_unfrozen_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:325
DescriptionFunctions["current_sub_skill_faction_unfrozen_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:334
DescriptionFunctions["current_sub_skill_faction_dungeon_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:341
DescriptionFunctions["current_sub_skill_faction_dungeon_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:346
DescriptionFunctions["current_sub_skill_faction_dungeon_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:353
DescriptionFunctions["current_sub_skill_faction_dungeon_4_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:358
DescriptionFunctions["current_sub_skill_faction_dungeon_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:365
DescriptionFunctions["current_skill_faction_nature"] = DescriptionRuntime.memoize(function(ctx) {
  let skillData = DescriptionRuntime.get(ctx.currentSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(skillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:374
DescriptionFunctions["current_sub_skill_faction_nature_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:381
DescriptionFunctions["current_sub_skill_faction_nature_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_skill_faction.script:388
DescriptionFunctions["current_sub_skill_faction_nature_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  let subSkillData = DescriptionRuntime.get(ctx.currentSubSkill, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(subSkillData);
}, 5);

// Source: DB/info/info_hero_skills/hero_classes.script:1
DescriptionFunctions["current_sub_class_human_might_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("200");
}, 5);

// Source: DB/info/info_hero_skills/hero_classes.script:6
DescriptionFunctions["current_sub_class_human_magic_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("0");
}, 5);

// Source: DB/info/info_hero_skills/hero_classes.script:11
DescriptionFunctions["current_sub_class_unfrozen_magic_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_hero_skills/hero_classes.script:16
DescriptionFunctions["current_sub_class_demons_magic_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("200");
}, 5);

// Source: DB/info/info_hero_skills/hero_classes.script:21
DescriptionFunctions["current_sub_class_demons_magic_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_hero_skills/hero_classes.script:26
DescriptionFunctions["current_sub_class_dungeon_might_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_hero_skills/hero_classes.script:31
DescriptionFunctions["current_sub_class_dungeon_might_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_hero_skills/hero_classes.script:36
DescriptionFunctions["current_sub_class_dungeon_magic_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_hero_skills/hero_classes.script:41
DescriptionFunctions["current_sub_class_dungeon_magic_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10000");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:3
DescriptionFunctions["current_specialization_flat_base_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:10
DescriptionFunctions["current_specialization_flat_base_bonus_1"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[1].parameters[1]");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:17
DescriptionFunctions["current_specialization_flat_increment"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[0].upgrade.increment");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:24
DescriptionFunctions["current_specialization_flat_increment_1"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[1].upgrade.increment");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:31
DescriptionFunctions["current_specialization_flat_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[0].upgrade.levelStep");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:38
DescriptionFunctions["current_specialization_flat_level_step_1"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[1].upgrade.levelStep");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:47
DescriptionFunctions["current_specialization_perc_base_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:54
DescriptionFunctions["current_specialization_perc_base_bonus_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:61
DescriptionFunctions["current_specialization_perc_increment"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[0].upgrade.increment");
  return DescriptionRuntime.formatModPercentNumeric(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:68
DescriptionFunctions["current_specialization_perc_increment_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[0].upgrade.increment");
  return DescriptionRuntime.formatModFloatPercentF1(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:75
DescriptionFunctions["current_specialization_perc_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[0].upgrade.levelStep");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:84
DescriptionFunctions["current_specialization_unit_base_bonus_1"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:91
DescriptionFunctions["current_specialization_unit_base_bonus_2"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[1].parameters[1]");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:98
DescriptionFunctions["current_specialization_unit_base_bonus_3"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[3].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:105
DescriptionFunctions["current_specialization_unit_increment"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[4].upgrade.increment");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:112
DescriptionFunctions["current_specialization_unit_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[4].upgrade.levelStep");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:121
DescriptionFunctions["current_specialization_moral_and_luck_base_bonus_1"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:128
DescriptionFunctions["current_specialization_moral_and_luck_base_bonus_2"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[1].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:135
DescriptionFunctions["current_specialization_moral_and_luck_increment"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[1].upgrade.increment");
  return DescriptionRuntime.formatModPercentNumeric(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:142
DescriptionFunctions["current_specialization_moral_and_luck_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[1].upgrade.levelStep");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:151
DescriptionFunctions["current_specialization_magic_increment"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[1].upgrade.increment");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:158
DescriptionFunctions["current_specialization_magic_step"] = DescriptionRuntime.memoize(function(ctx) {
  let specData = DescriptionRuntime.get(ctx.currentSpecialization, "bonuses[1].upgrade.levelStep");
  return DescriptionRuntime.formatModInt(specData);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:167
DescriptionFunctions["current_specialization_50p"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50%");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:172
DescriptionFunctions["current_specialization_100p"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100%");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:177
DescriptionFunctions["current_specialization_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:182
DescriptionFunctions["current_specialization_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:187
DescriptionFunctions["current_specialization_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:192
DescriptionFunctions["current_specialization_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization.script:197
DescriptionFunctions["current_specialization_5"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_demon.script:1
DescriptionFunctions["current_specialization_demon_hero_3_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_demon.script:8
DescriptionFunctions["current_specialization_demon_hero_5_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("40");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_demon.script:13
DescriptionFunctions["current_specialization_demon_hero_5_spec_bonus_alt"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_demon.script:18
DescriptionFunctions["current_specialization_demon_hero_5_spec_increment"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_demon.script:23
DescriptionFunctions["current_specialization_demon_hero_5_spec_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_demon.script:30
DescriptionFunctions["current_specialization_demon_hero_6_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_demon.script:35
DescriptionFunctions["current_specialization_demon_hero_6_spec_increment"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_demon.script:40
DescriptionFunctions["current_specialization_demon_hero_6_spec_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_dungeon.script:1
DescriptionFunctions["current_specialization_dungeon_hero_3_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("40");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_dungeon.script:6
DescriptionFunctions["current_specialization_dungeon_hero_3_spec_bonus_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let damageBase = DescriptionRuntime.get(GameData.buffs?.["skill_dungeon_hero_3_debuff"], "actions[0].damageDealer.minBaseDmg");
  let damageMultiplerPerHeroLevel = DescriptionRuntime.get(GameData.buffs?.["skill_dungeon_hero_3_debuff"], "actions[0].damageDealer.damageMultiplerPerHeroLevel");
  let heroLevelBase = DescriptionRuntime.get(ctx.currentHero, "level");
  let heroLevel = (Number(heroLevelBase) || 0) - (Number("1") || 0);
  let damageMultipler = (Number(damageMultiplerPerHeroLevel) || 0) * (Number(heroLevel) || 0);
  let damageBonus = (Number(damageBase) || 0) * (Number(damageMultipler) || 0);
  let damage = (Number(damageBase) || 0) + (Number(damageBonus) || 0);
  return DescriptionRuntime.formatModInt(damage);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_dungeon.script:20
DescriptionFunctions["alt_text_dot_damage_amount_level_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(GameData.buffs?.["skill_dungeon_hero_3_debuff"], "actions[0].damageDealer.minBaseDmg");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_dungeon.script:25
DescriptionFunctions["alt_text_dot_damage_amount_level_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(GameData.buffs?.["skill_dungeon_hero_3_debuff"], "actions[0].damageDealer.damageMultiplerPerHeroLevel");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_dungeon.script:30
DescriptionFunctions["current_specialization_dungeon_hero_3_spec_increment"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_dungeon.script:35
DescriptionFunctions["current_specialization_dungeon_hero_3_spec_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_dungeon.script:42
DescriptionFunctions["current_specialization_dungeon_hero_12_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_human.script:1
DescriptionFunctions["current_specialization_human_hero_9_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("40");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_human.script:6
DescriptionFunctions["current_specialization_human_hero_9_spec_bonus_alt"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("20");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_human.script:11
DescriptionFunctions["current_specialization_human_hero_9_spec_increment"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_human.script:16
DescriptionFunctions["current_specialization_human_hero_9_spec_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_human.script:23
DescriptionFunctions["current_specialization_human_hero_10_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_human.script:30
DescriptionFunctions["current_specialization_human_hero_13_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_human.script:35
DescriptionFunctions["current_specialization_human_hero_13_spec_increment"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_human.script:40
DescriptionFunctions["current_specialization_human_hero_13_spec_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_human.script:47
DescriptionFunctions["current_specialization_human_hero_16_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_nature.script:1
DescriptionFunctions["current_specialization_nature_hero_10_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_nature.script:8
DescriptionFunctions["current_specialization_nature_hero_12_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_nature.script:13
DescriptionFunctions["current_specialization_nature_hero_14_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_nature.script:20
DescriptionFunctions["current_specialization_nature_hero_17_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_nature.script:25
DescriptionFunctions["current_specialization_nature_hero_17_spec_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_undead.script:3
DescriptionFunctions["current_specialization_necro_hero_10_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_undead.script:8
DescriptionFunctions["current_specialization_necro_hero_10_spec_increment"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_undead.script:13
DescriptionFunctions["current_specialization_necro_hero_10_spec_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_undead.script:20
DescriptionFunctions["current_specialization_necro_hero_14_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_undead.script:25
DescriptionFunctions["current_specialization_necro_hero_14_spec_increment"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_undead.script:30
DescriptionFunctions["current_specialization_necro_hero_14_spec_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_undead.script:37
DescriptionFunctions["current_specialization_necro_hero_15_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_unfrozen.script:1
DescriptionFunctions["current_specialization_unfrozen_hero_7_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_unfrozen.script:6
DescriptionFunctions["current_specialization_unfrozen_hero_7_spec_increment"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_unfrozen.script:11
DescriptionFunctions["current_specialization_unfrozen_hero_7_spec_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_unfrozen.script:18
DescriptionFunctions["current_specialization_unfrozen_hero_8_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_unfrozen.script:23
DescriptionFunctions["current_specialization_unfrozen_hero_8_spec_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_unfrozen.script:30
DescriptionFunctions["current_specialization_unfrozen_hero_14_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("40");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_unfrozen.script:35
DescriptionFunctions["current_specialization_unfrozen_hero_14_spec_increment"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_unfrozen.script:40
DescriptionFunctions["current_specialization_unfrozen_hero_14_spec_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_unfrozen.script:47
DescriptionFunctions["current_specialization_unfrozen_hero_17_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_unfrozen.script:54
DescriptionFunctions["current_specialization_unfrozen_hero_18_spec_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_unfrozen.script:59
DescriptionFunctions["current_specialization_unfrozen_hero_18_spec_increment"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_hero_skills/hero_specialization_unfrozen.script:64
DescriptionFunctions["current_specialization_unfrozen_hero_18_spec_level_step"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("8");
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:3
DescriptionFunctions["current_magic_upgrade_0_param_mana_cost"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "manaCost[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:8
DescriptionFunctions["current_magic_upgrade_1_param_mana_cost"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "manaCost[1]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:13
DescriptionFunctions["current_magic_upgrade_2_param_mana_cost"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "manaCost[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:18
DescriptionFunctions["current_magic_upgrade_3_param_mana_cost"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "manaCost[3]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:25
DescriptionFunctions["current_magic_upgrade_0_1_param_mana_cost"] = DescriptionRuntime.memoize(function(ctx) {
  let manaCostBase = DescriptionRuntime.get(ctx.currentMagic, "manaCost[0]");
  let manaCostNext = DescriptionRuntime.get(ctx.currentMagic, "manaCost[1]");
  let _return = (Number(manaCostBase) || 0) - (Number(manaCostNext) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:33
DescriptionFunctions["current_magic_upgrade_1_2_param_mana_cost"] = DescriptionRuntime.memoize(function(ctx) {
  let manaCostBase = DescriptionRuntime.get(ctx.currentMagic, "manaCost[1]");
  let manaCostNext = DescriptionRuntime.get(ctx.currentMagic, "manaCost[2]");
  let _return = (Number(manaCostBase) || 0) - (Number(manaCostNext) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:41
DescriptionFunctions["current_magic_upgrade_2_3_param_mana_cost"] = DescriptionRuntime.memoize(function(ctx) {
  let manaCostBase = DescriptionRuntime.get(ctx.currentMagic, "manaCost[2]");
  let manaCostNext = DescriptionRuntime.get(ctx.currentMagic, "manaCost[3]");
  let _return = (Number(manaCostBase) || 0) - (Number(manaCostNext) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:51
DescriptionFunctions["current_magic_upgrade_0_param_damage_base"] = DescriptionRuntime.memoize(function(ctx) {
  let minBaseDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].maxBaseDmg");
  let _return = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:59
DescriptionFunctions["current_magic_upgrade_1_param_damage_base"] = DescriptionRuntime.memoize(function(ctx) {
  let minBaseDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].maxBaseDmg");
  let _return = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:67
DescriptionFunctions["current_magic_upgrade_2_param_damage_base"] = DescriptionRuntime.memoize(function(ctx) {
  let minBaseDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].maxBaseDmg");
  let _return = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:75
DescriptionFunctions["current_magic_upgrade_3_param_damage_base"] = DescriptionRuntime.memoize(function(ctx) {
  let minBaseDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].maxBaseDmg");
  let _return = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:85
DescriptionFunctions["current_magic_upgrade_0_param_damage_per_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let minStackDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].maxStackDmg");
  let _return = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:93
DescriptionFunctions["current_magic_upgrade_1_param_damage_per_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let minStackDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].maxStackDmg");
  let _return = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:101
DescriptionFunctions["current_magic_upgrade_2_param_damage_per_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let minStackDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].maxStackDmg");
  let _return = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:109
DescriptionFunctions["current_magic_upgrade_3_param_damage_per_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let minStackDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].maxStackDmg");
  let _return = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:119
DescriptionFunctions["current_magic_upgrade_0_param_damage_percent_base"] = DescriptionRuntime.memoize(function(ctx) {
  let minPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].minPercentDmg");
  let maxPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].maxPercentDmg");
  let _return = ((Number(minPercentDmg) || 0) + (Number(maxPercentDmg) || 0)) / 2;
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:127
DescriptionFunctions["current_magic_upgrade_1_param_damage_percent_base"] = DescriptionRuntime.memoize(function(ctx) {
  let minPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].minPercentDmg");
  let maxPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].maxPercentDmg");
  let _return = ((Number(minPercentDmg) || 0) + (Number(maxPercentDmg) || 0)) / 2;
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:135
DescriptionFunctions["current_magic_upgrade_2_param_damage_percent_base"] = DescriptionRuntime.memoize(function(ctx) {
  let minPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].minPercentDmg");
  let maxPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].maxPercentDmg");
  let _return = ((Number(minPercentDmg) || 0) + (Number(maxPercentDmg) || 0)) / 2;
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:143
DescriptionFunctions["current_magic_upgrade_3_param_damage_percent_base"] = DescriptionRuntime.memoize(function(ctx) {
  let minPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].minPercentDmg");
  let maxPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].maxPercentDmg");
  let _return = ((Number(minPercentDmg) || 0) + (Number(maxPercentDmg) || 0)) / 2;
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:153
DescriptionFunctions["current_magic_upgrade_0_param_damage_percent_per_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let minStackPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].minStackPercentDmg");
  let maxStackPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].maxStackPercentDmg");
  let _return = ((Number(minStackPercentDmg) || 0) + (Number(maxStackPercentDmg) || 0)) / 2;
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:161
DescriptionFunctions["current_magic_upgrade_1_param_damage_percent_per_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let minStackPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].minStackPercentDmg");
  let maxStackPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].maxStackPercentDmg");
  let _return = ((Number(minStackPercentDmg) || 0) + (Number(maxStackPercentDmg) || 0)) / 2;
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:169
DescriptionFunctions["current_magic_upgrade_2_param_damage_percent_per_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let minStackPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].minStackPercentDmg");
  let maxStackPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].maxStackPercentDmg");
  let _return = ((Number(minStackPercentDmg) || 0) + (Number(maxStackPercentDmg) || 0)) / 2;
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:177
DescriptionFunctions["current_magic_upgrade_3_param_damage_percent_per_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let minStackPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].minStackPercentDmg");
  let maxStackPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].maxStackPercentDmg");
  let _return = ((Number(minStackPercentDmg) || 0) + (Number(maxStackPercentDmg) || 0)) / 2;
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:187
DescriptionFunctions["current_magic_upgrade_0_param_heal_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:192
DescriptionFunctions["current_magic_upgrade_1_param_heal_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:197
DescriptionFunctions["current_magic_upgrade_2_param_heal_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:202
DescriptionFunctions["current_magic_upgrade_3_param_heal_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:209
DescriptionFunctions["current_magic_upgrade_0_param_heal_per_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:214
DescriptionFunctions["current_magic_upgrade_1_param_heal_per_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:219
DescriptionFunctions["current_magic_upgrade_2_param_heal_per_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:224
DescriptionFunctions["current_magic_upgrade_3_param_heal_per_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:231
DescriptionFunctions["current_magic_upgrade_0_param_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.duration");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:236
DescriptionFunctions["current_magic_upgrade_1_param_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.duration");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:241
DescriptionFunctions["current_magic_upgrade_2_param_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.duration");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:246
DescriptionFunctions["current_magic_upgrade_3_param_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.duration");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:253
DescriptionFunctions["current_magic_upgrade_0_param_temp_stack_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:258
DescriptionFunctions["current_magic_upgrade_1_param_temp_stack_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:263
DescriptionFunctions["current_magic_upgrade_2_param_temp_stack_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:268
DescriptionFunctions["current_magic_upgrade_3_param_temp_stack_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:275
DescriptionFunctions["current_magic_upgrade_0_param_temp_stack_perCount"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].targetMechanics[0].values[3]");
  return DescriptionRuntime.formatModFloatPercentF1(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:280
DescriptionFunctions["current_magic_upgrade_1_param_temp_stack_perCount"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].targetMechanics[0].values[3]");
  return DescriptionRuntime.formatModFloatPercentF1(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:285
DescriptionFunctions["current_magic_upgrade_2_param_temp_stack_perCount"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].targetMechanics[0].values[3]");
  return DescriptionRuntime.formatModFloatPercentF1(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:290
DescriptionFunctions["current_magic_upgrade_3_param_temp_stack_perCount"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].targetMechanics[0].values[3]");
  return DescriptionRuntime.formatModFloatPercentF1(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:297
DescriptionFunctions["current_magic_unpgrade_0_param_buff_offence"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:303
DescriptionFunctions["current_magic_unpgrade_1_param_buff_offence"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:309
DescriptionFunctions["current_magic_unpgrade_2_param_buff_offence"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:315
DescriptionFunctions["current_magic_unpgrade_3_param_buff_offence"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:323
DescriptionFunctions["current_magic_unpgrade_0_param_buff_defence"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.defence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:329
DescriptionFunctions["current_magic_unpgrade_1_param_buff_defence"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.defence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:335
DescriptionFunctions["current_magic_unpgrade_2_param_buff_defence"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.defence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:341
DescriptionFunctions["current_magic_unpgrade_3_param_buff_defence"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.defence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:349
DescriptionFunctions["current_magic_unpgrade_0_param_buff_speed"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:355
DescriptionFunctions["current_magic_unpgrade_1_param_buff_speed"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:361
DescriptionFunctions["current_magic_unpgrade_2_param_buff_speed"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:367
DescriptionFunctions["current_magic_unpgrade_3_param_buff_speed"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:375
DescriptionFunctions["current_magic_unpgrade_0_param_buff_initiative"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.initiative");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:381
DescriptionFunctions["current_magic_unpgrade_1_param_buff_initiative"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.initiative");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:387
DescriptionFunctions["current_magic_unpgrade_2_param_buff_initiative"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.initiative");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:393
DescriptionFunctions["current_magic_unpgrade_3_param_buff_initiative"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.initiative");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:401
DescriptionFunctions["current_magic_unpgrade_0_param_buff_moral"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.moral");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:407
DescriptionFunctions["current_magic_unpgrade_1_param_buff_moral"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.moral");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:413
DescriptionFunctions["current_magic_unpgrade_2_param_buff_moral"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.moral");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:419
DescriptionFunctions["current_magic_unpgrade_3_param_buff_moral"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.moral");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:427
DescriptionFunctions["current_magic_unpgrade_0_param_buff_luck"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.luck");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:433
DescriptionFunctions["current_magic_unpgrade_1_param_buff_luck"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.luck");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:439
DescriptionFunctions["current_magic_unpgrade_2_param_buff_luck"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.luck");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:445
DescriptionFunctions["current_magic_unpgrade_3_param_buff_luck"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.luck");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:453
DescriptionFunctions["current_magic_unpgrade_0_param_buff_skipActionChanceModifier"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.skipActionChanceModifier");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:459
DescriptionFunctions["current_magic_unpgrade_1_param_buff_skipActionChanceModifier"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.skipActionChanceModifier");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:465
DescriptionFunctions["current_magic_unpgrade_2_param_buff_skipActionChanceModifier"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.skipActionChanceModifier");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:471
DescriptionFunctions["current_magic_unpgrade_3_param_buff_skipActionChanceModifier"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.skipActionChanceModifier");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:479
DescriptionFunctions["current_magic_unpgrade_0_param_buff_anticritChanceModifier"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.anticritChanceModifier");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:485
DescriptionFunctions["current_magic_unpgrade_1_param_buff_anticritChanceModifier"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.anticritChanceModifier");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:491
DescriptionFunctions["current_magic_unpgrade_2_param_buff_anticritChanceModifier"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.anticritChanceModifier");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:497
DescriptionFunctions["current_magic_unpgrade_3_param_buff_anticritChanceModifier"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.anticritChanceModifier");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:505
DescriptionFunctions["current_magic_unpgrade_0_param_buff_outAllDmgMod"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:511
DescriptionFunctions["current_magic_unpgrade_1_param_buff_outAllDmgMod"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:517
DescriptionFunctions["current_magic_unpgrade_2_param_buff_outAllDmgMod"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:523
DescriptionFunctions["current_magic_unpgrade_3_param_buff_outAllDmgMod"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:531
DescriptionFunctions["current_magic_unpgrade_0_param_buff_inAllDmgMod"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:537
DescriptionFunctions["current_magic_unpgrade_1_param_buff_inAllDmgMod"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:543
DescriptionFunctions["current_magic_unpgrade_2_param_buff_inAllDmgMod"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:549
DescriptionFunctions["current_magic_unpgrade_3_param_buff_inAllDmgMod"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:557
DescriptionFunctions["current_magic_unpgrade_0_param_buff_outAllDmgMod_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].targetMechanics[0].values[0]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:563
DescriptionFunctions["current_magic_unpgrade_1_param_buff_outAllDmgMod_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].targetMechanics[0].values[0]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:569
DescriptionFunctions["current_magic_unpgrade_2_param_buff_outAllDmgMod_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].targetMechanics[0].values[0]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:575
DescriptionFunctions["current_magic_unpgrade_3_param_buff_outAllDmgMod_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].targetMechanics[0].values[0]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:583
DescriptionFunctions["current_magic_unpgrade_0_param_buff_inAllDmgMod_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].targetMechanics[0].values[0]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:589
DescriptionFunctions["current_magic_unpgrade_1_param_buff_inAllDmgMod_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].targetMechanics[0].values[0]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:595
DescriptionFunctions["current_magic_unpgrade_2_param_buff_inAllDmgMod_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].targetMechanics[0].values[0]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:601
DescriptionFunctions["current_magic_unpgrade_3_param_buff_inAllDmgMod_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].targetMechanics[0].values[0]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:609
DescriptionFunctions["current_magic_unpgrade_0_param_buff_hpPerc"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.hpPerc");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:615
DescriptionFunctions["current_magic_unpgrade_1_param_buff_hpPerc"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.hpPerc");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:621
DescriptionFunctions["current_magic_unpgrade_2_param_buff_hpPerc"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.hpPerc");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:627
DescriptionFunctions["current_magic_unpgrade_3_param_buff_hpPerc"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.hpPerc");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:635
DescriptionFunctions["current_magic_unpgrade_0_param_buff_finalHealingBonusPercent"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.finalHealingBonusPercent");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:641
DescriptionFunctions["current_magic_unpgrade_1_param_buff_finalHealingBonusPercent"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.finalHealingBonusPercent");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:647
DescriptionFunctions["current_magic_unpgrade_2_param_buff_finalHealingBonusPercent"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.finalHealingBonusPercent");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:653
DescriptionFunctions["current_magic_unpgrade_3_param_buff_finalHealingBonusPercent"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.finalHealingBonusPercent");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:661
DescriptionFunctions["current_magic_unpgrade_0_param_buff_healthLimitMinPercent"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.healthLimitMinPercent");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:667
DescriptionFunctions["current_magic_unpgrade_1_param_buff_healthLimitMinPercent"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.healthLimitMinPercent");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:673
DescriptionFunctions["current_magic_unpgrade_2_param_buff_healthLimitMinPercent"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.healthLimitMinPercent");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:679
DescriptionFunctions["current_magic_unpgrade_3_param_buff_healthLimitMinPercent"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.healthLimitMinPercent");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:687
DescriptionFunctions["current_magic_unpgrade_0_param_buff_outDmgMods"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:693
DescriptionFunctions["current_magic_unpgrade_1_param_buff_outDmgMods"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:699
DescriptionFunctions["current_magic_unpgrade_2_param_buff_outDmgMods"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:705
DescriptionFunctions["current_magic_unpgrade_3_param_buff_outDmgMods"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:713
DescriptionFunctions["current_magic_unpgrade_0_param_buff_inDmgMods"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:719
DescriptionFunctions["current_magic_unpgrade_1_param_buff_inDmgMods"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:725
DescriptionFunctions["current_magic_unpgrade_2_param_buff_inDmgMods"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:731
DescriptionFunctions["current_magic_unpgrade_3_param_buff_inDmgMods"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:739
DescriptionFunctions["current_magic_unpgrade_0_param_buff_numCounters"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.numCounters");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:745
DescriptionFunctions["current_magic_unpgrade_1_param_buff_numCounters"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.numCounters");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:751
DescriptionFunctions["current_magic_unpgrade_2_param_buff_numCounters"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.numCounters");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:757
DescriptionFunctions["current_magic_unpgrade_3_param_buff_numCounters"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.numCounters");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:765
DescriptionFunctions["current_magic_unpgrade_0_param_buff_tauntRadius"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.tauntRadius");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:771
DescriptionFunctions["current_magic_unpgrade_1_param_buff_tauntRadius"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.tauntRadius");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:777
DescriptionFunctions["current_magic_unpgrade_2_param_buff_tauntRadius"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.tauntRadius");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:783
DescriptionFunctions["current_magic_unpgrade_3_param_buff_tauntRadius"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.tauntRadius");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:791
DescriptionFunctions["current_magic_unpgrade_0_param_buff_actionsDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:797
DescriptionFunctions["current_magic_unpgrade_1_param_buff_actionsDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:803
DescriptionFunctions["current_magic_unpgrade_2_param_buff_actionsDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:809
DescriptionFunctions["current_magic_unpgrade_3_param_buff_actionsDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:817
DescriptionFunctions["current_magic_unpgrade_0_param_assasinate_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:822
DescriptionFunctions["current_magic_unpgrade_1_param_assasinate_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:827
DescriptionFunctions["current_magic_unpgrade_2_param_assasinate_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:832
DescriptionFunctions["current_magic_unpgrade_3_param_assasinate_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:839
DescriptionFunctions["current_magic_unpgrade_0_param_assasinate_buff_base"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:845
DescriptionFunctions["current_magic_unpgrade_1_param_assasinate_buff_base"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:851
DescriptionFunctions["current_magic_unpgrade_2_param_assasinate_buff_base"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:857
DescriptionFunctions["current_magic_unpgrade_3_param_assasinate_buff_base"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:865
DescriptionFunctions["current_magic_unpgrade_0_param_kill_stacks"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:870
DescriptionFunctions["current_magic_unpgrade_1_param_kill_stacks"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:875
DescriptionFunctions["current_magic_unpgrade_2_param_kill_stacks"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:880
DescriptionFunctions["current_magic_unpgrade_3_param_kill_stacks"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:887
DescriptionFunctions["current_magic_unpgrade_0_param_summonRange"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].castTargetParams.distance");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:892
DescriptionFunctions["current_magic_unpgrade_1_param_summonRange"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].castTargetParams.distance");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:897
DescriptionFunctions["current_magic_unpgrade_2_param_summonRange"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].castTargetParams.distance");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:902
DescriptionFunctions["current_magic_unpgrade_3_param_summonRange"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].castTargetParams.distance");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:909
DescriptionFunctions["current_magic_unpgrade_0_param_summonSP"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].targetMechanics[0].values[4]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:914
DescriptionFunctions["current_magic_unpgrade_1_param_summonSP"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].targetMechanics[0].values[4]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:919
DescriptionFunctions["current_magic_unpgrade_2_param_summonSP"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].targetMechanics[0].values[4]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:924
DescriptionFunctions["current_magic_unpgrade_3_param_summonSP"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].targetMechanics[0].values[4]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:931
DescriptionFunctions["current_magic_unpgrade_0_param_minDamagePerEnergyLevel"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].minDamagePerEnergyLevel");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:936
DescriptionFunctions["current_magic_unpgrade_1_param_minDamagePerEnergyLevel"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].minDamagePerEnergyLevel");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:941
DescriptionFunctions["current_magic_unpgrade_2_param_minDamagePerEnergyLevel"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].minDamagePerEnergyLevel");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:946
DescriptionFunctions["current_magic_unpgrade_3_param_minDamagePerEnergyLevel"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].minDamagePerEnergyLevel");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:953
DescriptionFunctions["current_magic_unpgrade_0_param_add_energy"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:958
DescriptionFunctions["current_magic_unpgrade_1_param_add_energy"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:963
DescriptionFunctions["current_magic_unpgrade_2_param_add_energy"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:968
DescriptionFunctions["current_magic_unpgrade_3_param_add_energy"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:975
DescriptionFunctions["current_magic_unpgrade_0_param_levelDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].levelDmg");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:980
DescriptionFunctions["current_magic_unpgrade_1_param_levelDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].levelDmg");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:985
DescriptionFunctions["current_magic_unpgrade_2_param_levelDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].levelDmg");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:990
DescriptionFunctions["current_magic_unpgrade_3_param_levelDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].levelDmg");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:997
DescriptionFunctions["current_magic_unpgrade_0_param_numTargets"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].numTargets");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1002
DescriptionFunctions["current_magic_unpgrade_1_param_numTargets"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].numTargets");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1007
DescriptionFunctions["current_magic_unpgrade_2_param_numTargets"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].numTargets");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1012
DescriptionFunctions["current_magic_unpgrade_3_param_numTargets"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].numTargets");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1019
DescriptionFunctions["current_magic_unpgrade_0_param_blink_range"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].orderedCastParams[0].distanceFromFirst");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1024
DescriptionFunctions["current_magic_unpgrade_1_param_blink_range"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].orderedCastParams[0].distanceFromFirst");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1029
DescriptionFunctions["current_magic_unpgrade_2_param_blink_range"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].orderedCastParams[0].distanceFromFirst");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1034
DescriptionFunctions["current_magic_unpgrade_3_param_blink_range"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].orderedCastParams[0].distanceFromFirst");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1041
DescriptionFunctions["current_magic_unpgrade_0_param_castleDamage_building"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1046
DescriptionFunctions["current_magic_unpgrade_1_param_castleDamage_building"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1051
DescriptionFunctions["current_magic_unpgrade_2_param_castleDamage_building"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1056
DescriptionFunctions["current_magic_unpgrade_3_param_castleDamage_building"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1063
DescriptionFunctions["current_magic_unpgrade_0_param_castleDamage_unit"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1068
DescriptionFunctions["current_magic_unpgrade_1_param_castleDamage_unit"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1073
DescriptionFunctions["current_magic_unpgrade_2_param_castleDamage_unit"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1078
DescriptionFunctions["current_magic_unpgrade_3_param_castleDamage_unit"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1085
DescriptionFunctions["text_description_up_effect_constant_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1090
DescriptionFunctions["text_description_up_effect_constant_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1095
DescriptionFunctions["text_description_up_effect_constant_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1100
DescriptionFunctions["text_description_up_effect_constant_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1105
DescriptionFunctions["text_description_up_effect_constant_5"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1114
DescriptionFunctions["current_magic_unpgrade_0_param_add_move_points"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[0].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1119
DescriptionFunctions["current_magic_unpgrade_1_param_add_move_points"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[1].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1124
DescriptionFunctions["current_magic_unpgrade_2_param_add_move_points"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[2].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1129
DescriptionFunctions["current_magic_unpgrade_3_param_add_move_points"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[3].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1136
DescriptionFunctions["current_magic_unpgrade_0_param_create_portals"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[0].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1141
DescriptionFunctions["current_magic_unpgrade_1_param_create_portals"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[1].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1146
DescriptionFunctions["current_magic_unpgrade_2_param_create_portals"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[2].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1151
DescriptionFunctions["current_magic_unpgrade_3_param_create_portals"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[3].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1158
DescriptionFunctions["current_magic_unpgrade_0_param_farsight_range"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[0].parameters[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1163
DescriptionFunctions["current_magic_unpgrade_1_param_farsight_range"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[1].parameters[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1168
DescriptionFunctions["current_magic_unpgrade_2_param_farsight_range"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[2].parameters[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1173
DescriptionFunctions["current_magic_unpgrade_3_param_farsight_range"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[3].parameters[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1180
DescriptionFunctions["current_magic_unpgrade_0_param_farsight_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[0].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1185
DescriptionFunctions["current_magic_unpgrade_1_param_farsight_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[1].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1190
DescriptionFunctions["current_magic_unpgrade_2_param_farsight_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[2].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1195
DescriptionFunctions["current_magic_unpgrade_3_param_farsight_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[3].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1202
DescriptionFunctions["current_magic_unpgrade_0_param_nairas_veil"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[0].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1207
DescriptionFunctions["current_magic_unpgrade_1_param_nairas_veil"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[1].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1212
DescriptionFunctions["current_magic_unpgrade_2_param_nairas_veil"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[2].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1217
DescriptionFunctions["current_magic_unpgrade_3_param_nairas_veil"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[3].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1224
DescriptionFunctions["current_magic_unpgrade_0_param_assemble_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[0].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1229
DescriptionFunctions["current_magic_unpgrade_1_param_assemble_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[1].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1234
DescriptionFunctions["current_magic_unpgrade_2_param_assemble_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[2].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1239
DescriptionFunctions["current_magic_unpgrade_3_param_assemble_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[3].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1246
DescriptionFunctions["current_magic_unpgrade_0_param_dimension_door_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[0].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1251
DescriptionFunctions["current_magic_unpgrade_1_param_dimension_door_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[1].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1256
DescriptionFunctions["current_magic_unpgrade_2_param_dimension_door_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[2].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1261
DescriptionFunctions["current_magic_unpgrade_3_param_dimension_door_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[3].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1268
DescriptionFunctions["current_magic_unpgrade_0_param_reinforcements_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[0].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1273
DescriptionFunctions["current_magic_unpgrade_1_param_reinforcements_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[1].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1278
DescriptionFunctions["current_magic_unpgrade_2_param_reinforcements_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[2].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1283
DescriptionFunctions["current_magic_unpgrade_3_param_reinforcements_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[3].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1290
DescriptionFunctions["current_magic_unpgrade_0_param_primordial_chaos_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[0].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1295
DescriptionFunctions["current_magic_unpgrade_1_param_primordial_chaos_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[1].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1300
DescriptionFunctions["current_magic_unpgrade_2_param_primordial_chaos_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[2].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1305
DescriptionFunctions["current_magic_unpgrade_3_param_primordial_chaos_radius"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[3].parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1312
DescriptionFunctions["current_magic_unpgrade_0_param_primordial_chaos_power"] = DescriptionRuntime.memoize(function(ctx) {
  let data = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[0].parameters[1]");
  let _return = (Number("1") || 0) - (Number(data) || 0);
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1318
DescriptionFunctions["current_magic_unpgrade_1_param_primordial_chaos_power"] = DescriptionRuntime.memoize(function(ctx) {
  let data = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[1].parameters[1]");
  let _return = (Number("1") || 0) - (Number(data) || 0);
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1324
DescriptionFunctions["current_magic_unpgrade_2_param_primordial_chaos_power"] = DescriptionRuntime.memoize(function(ctx) {
  let data = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[2].parameters[1]");
  let _return = (Number("1") || 0) - (Number(data) || 0);
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_info.script:1330
DescriptionFunctions["current_magic_unpgrade_3_param_primordial_chaos_power"] = DescriptionRuntime.memoize(function(ctx) {
  let data = DescriptionRuntime.get(ctx.currentMagic, "worldMagic.magicSettings[3].parameters[1]");
  let _return = (Number("1") || 0) - (Number(data) || 0);
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle.script:3
DescriptionFunctions["current_magic_buff_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let baseDuration = DescriptionRuntime.get(ctx.currentMagic, "buff.duration");
  let spCount = DescriptionRuntime.get(ctx.currentMagic, "buff.durationPerStack[0]");
  let spBonusDuration = DescriptionRuntime.get(ctx.currentMagic, "buff.durationPerStack[1]");
  let spBonusDurationMul = (Number(count) || 0) * (Number(spBonusDuration) || 0);
  let spBonusDurationMulDiv = (Number(spBonusDurationMul) || 0) / (Number(spCount) || 0);
  let spBonusDurationMulDivFloor = Math.floor(Number(spBonusDurationMulDiv) || 0);
  let fullDuration = (Number(baseDuration) || 0) + (Number(spBonusDurationMulDivFloor) || 0);
  return DescriptionRuntime.formatInt(fullDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle.script:19
DescriptionFunctions["current_magic_trap_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let baseDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  let spCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  let spBonusDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[4]");
  let spBonusDurationMul = (Number(count) || 0) * (Number(spBonusDuration) || 0);
  let spBonusDurationMulDiv = (Number(spBonusDurationMul) || 0) / (Number(spCount) || 0);
  let spBonusDurationMulDivFloor = Math.floor(Number(spBonusDurationMulDiv) || 0);
  let fullDuration = (Number(baseDuration) || 0) + (Number(spBonusDurationMulDivFloor) || 0);
  return DescriptionRuntime.formatInt(fullDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle.script:35
DescriptionFunctions["current_magic_object_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let summonSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let summonData = DescriptionRuntime.get(GameData.obstacles?.[summonSid], "lifetime");
  return DescriptionRuntime.formatInt(summonData);
}, 5);

// Source: DB/info/info_script_magic/magic_battle.script:43
DescriptionFunctions["current_magic_numTargets"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "numTargets");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle.script:48
DescriptionFunctions["current_magic_damage_common"] = DescriptionRuntime.memoize(function(ctx) {
  let minBaseDmg = DescriptionRuntime.get(ctx.currentMagic, "minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(ctx.currentMagic, "maxBaseDmg");
  let minStackDmg = DescriptionRuntime.get(ctx.currentMagic, "minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(ctx.currentMagic, "maxStackDmg");
  let baseDmg = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  let stackDmg = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let dmgCount = (Number(count) || 0) * (Number(stackDmg) || 0);
  let damage = (Number(baseDmg) || 0) + (Number(dmgCount) || 0);
  return DescriptionRuntime.formatInt(damage);
}, 5);

// Source: DB/info/info_script_magic/magic_battle.script:67
DescriptionFunctions["current_magic_damage_max_unit_percent"] = DescriptionRuntime.memoize(function(ctx) {
  let minPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "minPercentDmg");
  let maxPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "maxPercentDmg");
  let minStackPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "minStackPercentDmg");
  let maxStackPercentDmg = DescriptionRuntime.get(ctx.currentMagic, "maxStackPercentDmg");
  let baseDmg = ((Number(minPercentDmg) || 0) + (Number(maxPercentDmg) || 0)) / 2;
  let stackDmg = ((Number(minStackPercentDmg) || 0) + (Number(maxStackPercentDmg) || 0)) / 2;
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let dmgCount = (Number(count) || 0) * (Number(stackDmg) || 0);
  let damage = (Number(baseDmg) || 0) + (Number(dmgCount) || 0);
  return DescriptionRuntime.formatModPercentNumeric(damage);
}, 5);

// Source: DB/info/info_script_magic/magic_battle.script:86
DescriptionFunctions["current_magic_summon"] = DescriptionRuntime.memoize(function(ctx) {
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let baseSummon = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  let spCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  let spBonusSummon = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[4]");
  let fullStacksMul = (Number(count) || 0) * (Number(spBonusSummon) || 0);
  let fullStacksDiv = (Number(fullStacksMul) || 0) / (Number(spCount) || 0);
  let fullStacksDivFloor = Math.floor(Number(fullStacksDiv) || 0);
  let fullStacksSummon = (Number(baseSummon) || 0) + (Number(fullStacksDivFloor) || 0);
  return DescriptionRuntime.formatInt(fullStacksSummon);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:3
DescriptionFunctions["current_magic_baseHeal"] = DescriptionRuntime.memoize(function(ctx) {
  let baseHeal = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[0]");
  return DescriptionRuntime.formatInt(baseHeal);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:10
DescriptionFunctions["current_magic_healPerCount"] = DescriptionRuntime.memoize(function(ctx) {
  let healPerCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  return DescriptionRuntime.formatInt(healPerCount);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:19
DescriptionFunctions["current_magic_baseHeal_percent"] = DescriptionRuntime.memoize(function(ctx) {
  let baseHeal = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModFloatPercentF1(baseHeal);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:26
DescriptionFunctions["current_magic_healPerCount_percent"] = DescriptionRuntime.memoize(function(ctx) {
  let healPerCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  return DescriptionRuntime.formatModPercentNumeric(healPerCount);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:33
DescriptionFunctions["current_magic_baseHeal_percent_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let baseHeal = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModFloatPercentF1(baseHeal);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:40
DescriptionFunctions["current_magic_healPerCount_percent_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let healPerCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  return DescriptionRuntime.formatModFloatPercentF1(healPerCount);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:49
DescriptionFunctions["current_magic_baseBuffDuration"] = DescriptionRuntime.memoize(function(ctx) {
  let baseBuffDuration = DescriptionRuntime.get(ctx.currentMagic, "buff.duration");
  return DescriptionRuntime.formatInt(baseBuffDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:56
DescriptionFunctions["current_magic_durationBuffPerCount"] = DescriptionRuntime.memoize(function(ctx) {
  let bonusBuffDuration = DescriptionRuntime.get(ctx.currentMagic, "buff.durationPerStack[1]");
  return DescriptionRuntime.formatInt(bonusBuffDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:63
DescriptionFunctions["current_magic_countBuffDuration"] = DescriptionRuntime.memoize(function(ctx) {
  let countBuffDuration = DescriptionRuntime.get(ctx.currentMagic, "buff.durationPerStack[0]");
  return DescriptionRuntime.formatInt(countBuffDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:72
DescriptionFunctions["current_magic_addBuffDuration_base"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  return DescriptionRuntime.formatModInt(baseDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:79
DescriptionFunctions["current_magic_addBuffDuration_stackDuration"] = DescriptionRuntime.memoize(function(ctx) {
  let stackDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(stackDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:86
DescriptionFunctions["current_magic_addBuffDuration_perStack"] = DescriptionRuntime.memoize(function(ctx) {
  let perStack = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  return DescriptionRuntime.formatModInt(perStack);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:93
DescriptionFunctions["current_magic_addBuffDuration_base_2"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[1].values[1]");
  return DescriptionRuntime.formatModInt(baseDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:100
DescriptionFunctions["current_magic_addBuffDuration_stackDuration_2"] = DescriptionRuntime.memoize(function(ctx) {
  let stackDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[1].values[2]");
  return DescriptionRuntime.formatModInt(stackDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:107
DescriptionFunctions["current_magic_addBuffDuration_perStack_2"] = DescriptionRuntime.memoize(function(ctx) {
  let perStack = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[1].values[3]");
  return DescriptionRuntime.formatModInt(perStack);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:116
DescriptionFunctions["current_magic_baseDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDamage = DescriptionRuntime.get(ctx.currentMagic, "minBaseDmg");
  return DescriptionRuntime.formatInt(baseDamage);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:123
DescriptionFunctions["current_magic_damagePerCount"] = DescriptionRuntime.memoize(function(ctx) {
  let damagePerCount = DescriptionRuntime.get(ctx.currentMagic, "minStackDmg");
  return DescriptionRuntime.formatInt(damagePerCount);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:132
DescriptionFunctions["current_magic_baseTrapDuration"] = DescriptionRuntime.memoize(function(ctx) {
  let baseTrapDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  return DescriptionRuntime.formatInt(baseTrapDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:139
DescriptionFunctions["current_magic_durationTrapPerCount"] = DescriptionRuntime.memoize(function(ctx) {
  let durationTrapPerCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[4]");
  return DescriptionRuntime.formatInt(durationTrapPerCount);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:146
DescriptionFunctions["current_magic_countTrapDuration"] = DescriptionRuntime.memoize(function(ctx) {
  let countTrapDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  return DescriptionRuntime.formatInt(countTrapDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:155
DescriptionFunctions["current_magic_sightRadius1Multipler"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatInt("1");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:160
DescriptionFunctions["current_magic_sightRadius2Multipler"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatInt("2");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:165
DescriptionFunctions["current_magic_sightRadius3Multipler"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatInt("3");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:170
DescriptionFunctions["current_magic_sightRadius4Multipler"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatInt("4");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:175
DescriptionFunctions["current_magic_sightRadiusMultipler0"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "parameters[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:180
DescriptionFunctions["current_magic_sightRadiusMultipler1"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "parameters[1]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:185
DescriptionFunctions["current_magic_sightRadiusMultipler2"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "parameters[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:190
DescriptionFunctions["current_magic_sightRadiusMultipler3"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "parameters[3]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:197
DescriptionFunctions["alt_text_damage_amount_earths_rage_1_1"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDamage = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[0]");
  return DescriptionRuntime.formatInt(baseDamage);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:204
DescriptionFunctions["alt_text_damage_amount_earths_rage_1_2"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDamage = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  return DescriptionRuntime.formatInt(baseDamage);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:211
DescriptionFunctions["alt_text_damage_amount_earths_rage_2_1"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDamage = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  return DescriptionRuntime.formatInt(baseDamage);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:220
DescriptionFunctions["current_magic_baseTrapDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let summonSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let baseTrapDamage = DescriptionRuntime.get(GameData.traps?.[summonSid], "damageDealer.minBaseDmg");
  return DescriptionRuntime.formatInt(baseTrapDamage);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:228
DescriptionFunctions["current_magic_countTrapDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let summonSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let countTrapDamage = DescriptionRuntime.get(GameData.traps?.[summonSid], "damageDealer.minStackDmg");
  return DescriptionRuntime.formatInt(countTrapDamage);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:238
DescriptionFunctions["current_magic_baseCopyDuration"] = DescriptionRuntime.memoize(function(ctx) {
  let baseCopyDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  return DescriptionRuntime.formatInt(baseCopyDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:245
DescriptionFunctions["current_magic_durationCopyPerCount"] = DescriptionRuntime.memoize(function(ctx) {
  let durationCopyPerCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  return DescriptionRuntime.formatInt(durationCopyPerCount);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:252
DescriptionFunctions["current_magic_countCopyDuration"] = DescriptionRuntime.memoize(function(ctx) {
  let countCopyDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  return DescriptionRuntime.formatInt(countCopyDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:261
DescriptionFunctions["current_magic_basePercentDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let basePercentDamage = DescriptionRuntime.get(ctx.currentMagic, "minPercentDmg");
  return DescriptionRuntime.formatModPercentNumeric(basePercentDamage);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:268
DescriptionFunctions["current_magic_percentDamagePerCount"] = DescriptionRuntime.memoize(function(ctx) {
  let percentDamagePerCount = DescriptionRuntime.get(ctx.currentMagic, "minStackPercentDmg");
  return DescriptionRuntime.formatModPercentNumeric(percentDamagePerCount);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:277
DescriptionFunctions["current_magic_baseDotDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minBaseDmg");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:283
DescriptionFunctions["current_magic_baseDotDamagePerCount"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:291
DescriptionFunctions["current_magic_baseRevengeDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[2]");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:297
DescriptionFunctions["current_magic_baseRevengeDamagePerCount"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[3]");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:305
DescriptionFunctions["current_magic_baseSummon"] = DescriptionRuntime.memoize(function(ctx) {
  let baseSummon = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  return DescriptionRuntime.formatInt(baseSummon);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:312
DescriptionFunctions["current_magic_summonPerCount"] = DescriptionRuntime.memoize(function(ctx) {
  let summonPerCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[4]");
  return DescriptionRuntime.formatInt(summonPerCount);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:321
DescriptionFunctions["current_magic_baseBuffDuration_doreaths_tide"] = DescriptionRuntime.memoize(function(ctx) {
  let baseBuffDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  return DescriptionRuntime.formatInt(baseBuffDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:328
DescriptionFunctions["current_magic_durationBuffPerCount_doreaths_tide"] = DescriptionRuntime.memoize(function(ctx) {
  let bonusBuffDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  return DescriptionRuntime.formatInt(bonusBuffDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:335
DescriptionFunctions["current_magic_countBuffDuration_doreaths_tide"] = DescriptionRuntime.memoize(function(ctx) {
  let countBuffDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[4]");
  return DescriptionRuntime.formatInt(countBuffDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:344
DescriptionFunctions["alt_text_summon_hp"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[5]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.hp");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:350
DescriptionFunctions["alt_text_summon_dmg"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[5]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.damageMin");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:356
DescriptionFunctions["alt_text_summon_hp_base"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatInt("50");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_alts.script:361
DescriptionFunctions["alt_text_summon_dmg_base"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatInt("5");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:1
DescriptionFunctions["current_day_1_magic_healing_water"] = DescriptionRuntime.memoize(function(ctx) {
  let baseHeal = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[0]");
  let perCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let healPerCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let healCount = (Number(count) || 0) * (Number(healPerCount) || 0);
  let healCountPerCount = (Number(healCount) || 0) / (Number(perCount) || 0);
  let fhealCountPerCountFloor = Math.floor(Number(healCountPerCount) || 0);
  let heal = (Number(baseHeal) || 0) + (Number(fhealCountPerCountFloor) || 0);
  return DescriptionRuntime.formatInt(heal);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:18
DescriptionFunctions["current_day_1_magic_healing_water_1"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[1].values[1]");
  let stackDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[1].values[2]");
  let perStack = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[1].values[3]");
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let perSpBonus = (Number(count) || 0) / (Number(perStack) || 0);
  let spDuration = (Number(stackDuration) || 0) * (Number(perSpBonus) || 0);
  let duration = (Number(baseDuration) || 0) + (Number(spDuration) || 0);
  return DescriptionRuntime.formatModInt(duration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:36
DescriptionFunctions["current_day_2_magic_sharp_edge"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:44
DescriptionFunctions["current_day_3_magic_haste"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:52
DescriptionFunctions["current_day_4_magic_favorable_wind"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:60
DescriptionFunctions["current_day_11_magic_masterful_parry"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.numCounters");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:66
DescriptionFunctions["current_day_11_magic_masterful_parry_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:74
DescriptionFunctions["current_day_5_magic_shorten_shadow"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.defence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:82
DescriptionFunctions["current_day_6_magic_cleansing_ray"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:89
DescriptionFunctions["current_day_8_magic_taunt"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.tauntRadius");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:95
DescriptionFunctions["current_day_8_magic_taunt_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:102
DescriptionFunctions["current_day_9_magic_arinas_hymn_1"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.initiative");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:108
DescriptionFunctions["current_day_9_magic_arinas_hymn_2"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.hpPerc");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:116
DescriptionFunctions["current_day_7_magic_inner_light_old"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.energyPerCast");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:122
DescriptionFunctions["current_day_7_magic_inner_light"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let stackDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  let perStack = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let perSpBonus = (Number(count) || 0) / (Number(perStack) || 0);
  let spDuration = (Number(stackDuration) || 0) * (Number(perSpBonus) || 0);
  let duration = (Number(baseDuration) || 0) + (Number(spDuration) || 0);
  return DescriptionRuntime.formatModInt(duration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:140
DescriptionFunctions["current_day_13_vengeance"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let baseDamage = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[2]");
  let stackBonus = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[3]");
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let stackDamage = (Number(stackBonus) || 0) * (Number(count) || 0);
  let _return = (Number(baseDamage) || 0) + (Number(stackDamage) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:152
DescriptionFunctions["current_day_13_vengeance_0_param_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[3]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:158
DescriptionFunctions["current_day_13_vengeance_1_param_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[3]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:164
DescriptionFunctions["current_day_13_vengeance_2_param_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[3]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:170
DescriptionFunctions["current_day_13_vengeance_3_param_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[3]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:178
DescriptionFunctions["current_day_12_magic_radiant_armor"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:186
DescriptionFunctions["current_day_16_magic_arinas_chosen"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.healthLimitMinPercent");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:192
DescriptionFunctions["current_day_16_magic_arinas_chosen_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:197
DescriptionFunctions["current_day_16_magic_arinas_chosen_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_day.script:204
DescriptionFunctions["current_day_13_magic_holy_arms"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:1
DescriptionFunctions["current_night_1_magic_unnatural_calm"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:9
DescriptionFunctions["current_night_2_magic_web"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:17
DescriptionFunctions["current_night_3_magic_enlarge_shadow"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:25
DescriptionFunctions["current_night_4_magic_despair"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let _return = (Number(count) || 0) * (Number(buffData) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:37
DescriptionFunctions["current_night_9_magic_twilight"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:45
DescriptionFunctions["current_night_8_magic_sleep_bonus_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:52
DescriptionFunctions["current_night_5_magic_shade_cloak"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:60
DescriptionFunctions["current_night_7_magic_fatal_decay"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.hpPerc");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:68
DescriptionFunctions["current_night_10_magic_silence_per_level"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:75
DescriptionFunctions["current_night_11_magic_vulnerability"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:83
DescriptionFunctions["current_night_13_magic_berserker"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:91
DescriptionFunctions["current_night_16_magic_shadow_army"] = DescriptionRuntime.memoize(function(ctx) {
  let baseHeal = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  let healPerStack = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let mul = (Number(count) || 0) * (Number(healPerStack) || 0);
  let _return = (Number(baseHeal) || 0) + (Number(mul) || 0);
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:102
DescriptionFunctions["current_night_16_magic_shadow_army_1"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[5]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:109
DescriptionFunctions["current_night_14_magic_nairas_kiss"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.skipActionChanceModifier");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:117
DescriptionFunctions["current_night_14_magic_nairas_kiss_new"] = DescriptionRuntime.memoize(function(ctx) {
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let minBaseDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.maxBaseDmg");
  let minStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.maxStackDmg");
  let baseDmg = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  let stackDmg = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  let mul = (Number(count) || 0) * (Number(stackDmg) || 0);
  let _return = (Number(baseDmg) || 0) + (Number(mul) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:134
DescriptionFunctions["current_night_14_magic_nairas_kiss_new_base"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let minBaseDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.maxBaseDmg");
  let _return = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:143
DescriptionFunctions["current_night_14_magic_nairas_kiss_new_perStack"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let minStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.maxStackDmg");
  let _return = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:152
DescriptionFunctions["current_night_14_magic_nairas_kiss_new_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:157
DescriptionFunctions["current_night_14_magic_nairas_kiss_new_buff_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSP = ctx.currentBuff.getSpellPower?.() ?? 0;
  let baseDamage = DescriptionRuntime.get(ctx.currentBuff, "config.actions[0].damageDealer.minBaseDmg");
  let stackBonus = DescriptionRuntime.get(ctx.currentBuff, "config.actions[0].damageDealer.minStackDmg");
  let stackDamage = (Number(stackBonus) || 0) * (Number(buffSP) || 0);
  let _return = (Number(baseDamage) || 0) + (Number(stackDamage) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:170
DescriptionFunctions["current_night_14_magic_nairas_kiss_new_buff_damage_0_BaseDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let minBaseDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.maxBaseDmg");
  let _return = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:178
DescriptionFunctions["current_night_14_magic_nairas_kiss_new_buff_damage_1_BaseDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let minBaseDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.maxBaseDmg");
  let _return = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:186
DescriptionFunctions["current_night_14_magic_nairas_kiss_new_buff_damage_2_BaseDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let minBaseDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.maxBaseDmg");
  let _return = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:194
DescriptionFunctions["current_night_14_magic_nairas_kiss_new_buff_damage_3_BaseDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let minBaseDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.maxBaseDmg");
  let _return = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:204
DescriptionFunctions["current_night_14_magic_nairas_kiss_new_buff_damage_0_StackDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let minStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.maxStackDmg");
  let _return = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:212
DescriptionFunctions["current_night_14_magic_nairas_kiss_new_buff_damage_1_StackDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let minStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.maxStackDmg");
  let _return = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:220
DescriptionFunctions["current_night_14_magic_nairas_kiss_new_buff_damage_2_StackDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let minStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.maxStackDmg");
  let _return = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:228
DescriptionFunctions["current_night_14_magic_nairas_kiss_new_buff_damage_3_StackDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let minStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.maxStackDmg");
  let _return = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:238
DescriptionFunctions["current_night_15_magic_deaths_call"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:246
DescriptionFunctions["current_buff_magic_deaths_call_effect"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_night.script:253
DescriptionFunctions["current_night_6_magic_deaths_grip_bonus_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_neutral.script:1
DescriptionFunctions["current_day_bonus_magic_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_neutral.script:6
DescriptionFunctions["current_night_bonus_magic_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_neutral.script:11
DescriptionFunctions["current_space_bonus_magic_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_neutral.script:16
DescriptionFunctions["current_primal_bonus_magic_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_neutral.script:21
DescriptionFunctions["current_bonus_magic_astral_summon_hp"] = DescriptionRuntime.memoize(function(ctx) {
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[5]");
  let hp = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.hp");
  let mul = (Number(count) || 0) * (Number(hp) || 0);
  let _return = (Number(mul) || 0) + (Number("50") || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_neutral.script:32
DescriptionFunctions["current_bonus_magic_astral_summon_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[5]");
  let damage = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.damageMin");
  let mul = (Number(count) || 0) * (Number(damage) || 0);
  let _return = (Number(mul) || 0) + (Number("5") || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:1
DescriptionFunctions["current_primal_1_magic_thunderbolt_bonus_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("25");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:6
DescriptionFunctions["current_primal_1_magic_thunderbolt_bonus_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:13
DescriptionFunctions["current_primal_2_magic_thick_hide"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:23
DescriptionFunctions["current_primal_3_magic_wean"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let stackDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  let perStack = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let perSpBonus = (Number(count) || 0) / (Number(perStack) || 0);
  let spDuration = (Number(stackDuration) || 0) * (Number(perSpBonus) || 0);
  let duration = (Number(baseDuration) || 0) + (Number(spDuration) || 0);
  return DescriptionRuntime.formatModInt(duration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:41
DescriptionFunctions["current_primal_5_magic_crystal_crown"] = DescriptionRuntime.memoize(function(ctx) {
  let summonSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let summonData = DescriptionRuntime.get(GameData.obstacles?.[summonSid], "stats.hp");
  return DescriptionRuntime.formatModInt(summonData);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:49
DescriptionFunctions["current_primal_5_magic_crystal_crown_numTargets"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "numTargets");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:54
DescriptionFunctions["current_primal_5_magic_crystal_crown_bonus_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:61
DescriptionFunctions["current_primal_6_magic_ice_bolt"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.initiative");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:69
DescriptionFunctions["current_primal_7_magic_wall_of_flame"] = DescriptionRuntime.memoize(function(ctx) {
  let summonSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let minBaseDmg = DescriptionRuntime.get(GameData.traps?.[summonSid], "damageDealer.minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(GameData.traps?.[summonSid], "damageDealer.maxBaseDmg");
  let minStackDmg = DescriptionRuntime.get(GameData.traps?.[summonSid], "damageDealer.minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(GameData.traps?.[summonSid], "damageDealer.maxStackDmg");
  let baseDmg = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  let stackDmg = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let dmgCount = (Number(count) || 0) * (Number(stackDmg) || 0);
  let damage = (Number(baseDmg) || 0) + (Number(dmgCount) || 0);
  return DescriptionRuntime.formatModInt(damage);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:89
DescriptionFunctions["current_primal_7_magic_wall_of_flame_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:94
DescriptionFunctions["current_primal_7_magic_wall_of_flame_numTargets"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "numTargets");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:99
DescriptionFunctions["current_primal_7_magic_wall_of_flame_bonus_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:106
DescriptionFunctions["current_primal_8_magic_cave_in_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:111
DescriptionFunctions["current_primal_8_magic_cave_in_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:116
DescriptionFunctions["current_primal_8_magic_cave_in_bonus_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:123
DescriptionFunctions["current_primal_9_magic_earths_rage_damage_buildings"] = DescriptionRuntime.memoize(function(ctx) {
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let baseDmg = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[0]");
  let stackDmg = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let damageCount = (Number(count) || 0) * (Number(stackDmg) || 0);
  let damage = (Number(baseDmg) || 0) + (Number(damageCount) || 0);
  return DescriptionRuntime.formatModInt(damage);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:136
DescriptionFunctions["current_primal_9_magic_earths_rage_damage_units"] = DescriptionRuntime.memoize(function(ctx) {
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let baseDmg = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  let stackDmg = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  let damageCount = (Number(count) || 0) * (Number(stackDmg) || 0);
  let damage = (Number(baseDmg) || 0) + (Number(damageCount) || 0);
  return DescriptionRuntime.formatModInt(damage);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:151
DescriptionFunctions["current_primal_10_magic_primordial_purity_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1-3");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:156
DescriptionFunctions["current_primal_10_magic_primordial_purity_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1-4");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:161
DescriptionFunctions["current_primal_10_magic_primordial_purity_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1-5");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:166
DescriptionFunctions["current_primal_10_magic_primordial_purity"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.immunities[0].tags[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:172
DescriptionFunctions["current_primal_10_magic_primordial_purity_effect"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.immunities[0].tags[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:177
DescriptionFunctions["current_primal_10_magic_primordial_purity_3_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:182
DescriptionFunctions["current_primal_10_magic_primordial_purity_4_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:189
DescriptionFunctions["current_primal_12_magic_chain_lightning_bonus"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:194
DescriptionFunctions["current_primal_12_magic_chain_lightning"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:201
DescriptionFunctions["current_primal_14_magic_hksmillas_rampage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_primal.script:211
DescriptionFunctions["current_primal_13_magic_avalanche_bonus_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:1
DescriptionFunctions["current_space_1_magic_early_start"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.initiative");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:9
DescriptionFunctions["current_space_2_magic_energy_explosion"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "minDamagePerEnergyLevel");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:16
DescriptionFunctions["current_space_3_magic_energyze"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:23
DescriptionFunctions["current_space_9_magic_impending_fate"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "levelDmg");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:30
DescriptionFunctions["current_space_4_magic_optical_illusion"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:38
DescriptionFunctions["current_space_5_magic_trap_jaws"] = DescriptionRuntime.memoize(function(ctx) {
  let summonSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let summonData = DescriptionRuntime.get(GameData.traps?.[summonSid], "damageDealer.minPercentDmg");
  return DescriptionRuntime.formatModPercentNumeric(summonData);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:46
DescriptionFunctions["current_space_5_magic_trap_jaws_numTargets"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "numTargets");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:51
DescriptionFunctions["current_space_5_magic_trap_jaws_bonus_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:56
DescriptionFunctions["current_space_5_magic_trap_jaws_bonus_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("200");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:61
DescriptionFunctions["current_space_5_magic_trap_jaws_bonus_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("400");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:68
DescriptionFunctions["current_space_6_magic_blink"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "orderedCastParams[0].distanceFromFirst");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:75
DescriptionFunctions["current_space_10_magic_mirror_copy_1"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[0]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:82
DescriptionFunctions["current_space_10_magic_mirror_copy_2"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[0]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:89
DescriptionFunctions["current_space_10_magic_mirror_copy_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let baseDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let spCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  let spBonusDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  let spBonusDurationMul = (Number(count) || 0) * (Number(spBonusDuration) || 0);
  let spBonusDurationMulDiv = (Number(spBonusDurationMul) || 0) / (Number(spCount) || 0);
  let spBonusDurationMulDivFloor = Math.floor(Number(spBonusDurationMulDiv) || 0);
  let fullDuration = (Number(baseDuration) || 0) + (Number(spBonusDurationMulDivFloor) || 0);
  return DescriptionRuntime.formatInt(fullDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:107
DescriptionFunctions["current_space_11_magic_decimate"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:115
DescriptionFunctions["current_space_12_magic_rewind"] = DescriptionRuntime.memoize(function(ctx) {
  let baseHeal = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[0]");
  let perCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let healPerCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[2]");
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let healCount = (Number(count) || 0) * (Number(healPerCount) || 0);
  let healCountPerCount = (Number(healCount) || 0) / (Number(perCount) || 0);
  let fhealCountPerCountFloor = Math.floor(Number(healCountPerCount) || 0);
  let heal = (Number(baseHeal) || 0) + (Number(fhealCountPerCountFloor) || 0);
  return DescriptionRuntime.formatInt(heal);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:134
DescriptionFunctions["current_space_16_magic_reality_distortion"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:140
DescriptionFunctions["current_space_16_magic_reality_distortion_0_param_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[0].buff.sid");
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  let _return = (Number("1.01") || 0) - (Number(buffData) || 0);
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:147
DescriptionFunctions["current_space_16_magic_reality_distortion_1_param_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[1].buff.sid");
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  let _return = (Number("1.01") || 0) - (Number(buffData) || 0);
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:154
DescriptionFunctions["current_space_16_magic_reality_distortion_2_param_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[2].buff.sid");
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  let _return = (Number("1.01") || 0) - (Number(buffData) || 0);
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:161
DescriptionFunctions["current_space_16_magic_reality_distortion_3_param_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "battleMagic.magicDealers[3].buff.sid");
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[0]");
  let _return = (Number("1.01") || 0) - (Number(buffData) || 0);
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:170
DescriptionFunctions["current_space_14_magic_doreaths_tide"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[1]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:176
DescriptionFunctions["current_space_14_magic_doreaths_tide_bonus_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:181
DescriptionFunctions["current_space_14_magic_doreaths_tide_bonus_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:186
DescriptionFunctions["current_space_14_magic_doreaths_tide_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let count = ctx.currentHero?.getSpellPower?.(ctx.currentMagic?.school) ?? 0;
  let baseDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[3]");
  let spCount = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[4]");
  let spBonusDuration = DescriptionRuntime.get(ctx.currentMagic, "targetMechanics[0].values[5]");
  let spBonusDurationMul = (Number(count) || 0) * (Number(spBonusDuration) || 0);
  let spBonusDurationMulDiv = (Number(spBonusDurationMul) || 0) / (Number(spCount) || 0);
  let spBonusDurationMulDivFloor = Math.floor(Number(spBonusDurationMulDiv) || 0);
  let fullDuration = (Number(baseDuration) || 0) + (Number(spBonusDurationMulDivFloor) || 0);
  return DescriptionRuntime.formatModInt(fullDuration);
}, 5);

// Source: DB/info/info_script_magic/magic_battle_space.script:204
DescriptionFunctions["current_space_15_magic_trap_snare_numTargets"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "numTargets");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_day.script:1
DescriptionFunctions["current_day_18_magic_farsight_1"] = DescriptionRuntime.memoize(function(ctx) {
  let baseRadius = DescriptionRuntime.get(ctx.currentMagic, "parameters[0]");
  let bonusRadius = DescriptionRuntime.get(ctx.currentMagic, "parameters[1]");
  let level = (ctx.currentMagic.upgradeLevel ?? 0) + 1;
  let levelSub = (Number(level) || 0) - (Number(1) || 0);
  let bonusRadiusMul = (Number(bonusRadius) || 0) * (Number(levelSub) || 0);
  let finalRadius = (Number(baseRadius) || 0) + (Number(bonusRadiusMul) || 0);
  return DescriptionRuntime.formatModInt(baseRadius);
}, 5);

// Source: DB/info/info_script_magic/magic_world_day.script:15
DescriptionFunctions["current_day_18_magic_farsight_2"] = DescriptionRuntime.memoize(function(ctx) {
  let baseRadius = DescriptionRuntime.get(ctx.currentMagic, "parameters[2]");
  let viewRadius = DescriptionRuntime.get(ctx.currentHero, "heroStat.viewRadius");
  let heroRadius = (Number(viewRadius) || 0) * (Number(baseRadius) || 0);
  return DescriptionRuntime.formatModInt(heroRadius);
}, 5);

// Source: DB/info/info_script_magic/magic_world_day.script:25
DescriptionFunctions["current_day_18_magic_farsight_3"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "usageLimit");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_day.script:30
DescriptionFunctions["current_day_18_magic_farsight_per_level"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "parameters[1]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:1
DescriptionFunctions["text_description_need_level_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:6
DescriptionFunctions["text_description_need_level_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:11
DescriptionFunctions["text_description_need_level_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("6");
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:16
DescriptionFunctions["text_description_need_level_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("9");
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:21
DescriptionFunctions["text_description_need_level_5"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("12");
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:28
DescriptionFunctions["current_neutral_1_magic_back_to_garrison_usageLimit"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "usageLimit");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:35
DescriptionFunctions["current_neutral_1_magic_back_to_city"] = DescriptionRuntime.memoize(function(ctx) {
  let viewRadius = DescriptionRuntime.get(ctx.currentHero, "heroStat.viewRadius");
  let heroRadius = (Number(viewRadius) || 0) * (Number("3") || 0);
  return DescriptionRuntime.formatModInt(heroRadius);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:44
DescriptionFunctions["current_neutral_1_magic_back_to_city_usageLimit"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "usageLimit");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:51
DescriptionFunctions["current_neutral_1_magic_mana_transfer"] = DescriptionRuntime.memoize(function(ctx) {
  let viewRadius = DescriptionRuntime.get(ctx.currentHero, "heroStat.viewRadius");
  let heroRadius = (Number(viewRadius) || 0) * (Number("3") || 0);
  return DescriptionRuntime.formatModInt(heroRadius);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:60
DescriptionFunctions["current_neutral_1_magic_mana_transfer_usageLimit"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "usageLimit");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:65
DescriptionFunctions["current_neutral_1_magic_mana_transfer_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:70
DescriptionFunctions["current_neutral_1_magic_mana_transfer_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("20");
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:77
DescriptionFunctions["current_neutral_1_magic_units_replace_usageLimit"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "usageLimit");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:84
DescriptionFunctions["current_neutral_1_magic_mana_restore_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:89
DescriptionFunctions["current_neutral_1_magic_mana_restore_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:98
DescriptionFunctions["current_neutral_magic_second_sight_1"] = DescriptionRuntime.memoize(function(ctx) {
  let baseMove = DescriptionRuntime.get(ctx.currentMagic, "parameters[0]");
  let bonusMove = DescriptionRuntime.get(ctx.currentMagic, "parameters[1]");
  let level = (ctx.currentMagic.upgradeLevel ?? 0) + 1;
  let levelSub = (Number(level) || 0) - (Number(1) || 0);
  let bonusMoveMul = (Number(bonusMove) || 0) * (Number(levelSub) || 0);
  let finalMove = (Number(baseMove) || 0) + (Number(bonusMoveMul) || 0);
  return DescriptionRuntime.formatModInt(finalMove);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:112
DescriptionFunctions["current_neutral_magic_second_sight_2"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "usageLimit");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:119
DescriptionFunctions["current_neutral_magic_shadow_form"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentMagic, "parameters[0]");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:125
DescriptionFunctions["current_neutral_magic_shadow_form_bonus_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("20");
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:130
DescriptionFunctions["current_neutral_magic_shadow_form_bonus_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("40");
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:137
DescriptionFunctions["current_neutral_magic_dimension_door_1"] = DescriptionRuntime.memoize(function(ctx) {
  let baseRadius = DescriptionRuntime.get(ctx.currentMagic, "parameters[0]");
  let bonusRadius = DescriptionRuntime.get(ctx.currentMagic, "parameters[1]");
  let level = (ctx.currentMagic.upgradeLevel ?? 0) + 1;
  let levelSub = (Number(level) || 0) - (Number(1) || 0);
  let bonusRadiusMul = (Number(bonusRadius) || 0) * (Number(levelSub) || 0);
  let finalRadius = (Number(baseRadius) || 0) + (Number(bonusRadiusMul) || 0);
  return DescriptionRuntime.formatModInt(baseRadius);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:151
DescriptionFunctions["current_neutral_magic_dimension_door_2"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "usageLimit");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:158
DescriptionFunctions["current_neutral_magic_light_gate_1"] = DescriptionRuntime.memoize(function(ctx) {
  let baseRadius = DescriptionRuntime.get(ctx.currentMagic, "parameters[0]");
  let bonusRadius = DescriptionRuntime.get(ctx.currentMagic, "parameters[1]");
  let level = (ctx.currentMagic.upgradeLevel ?? 0) + 1;
  let levelSub = (Number(level) || 0) - (Number(1) || 0);
  let bonusRadiusMul = (Number(bonusRadius) || 0) * (Number(levelSub) || 0);
  let finalRadius = (Number(baseRadius) || 0) + (Number(bonusRadiusMul) || 0);
  return DescriptionRuntime.formatModInt(baseRadius);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:172
DescriptionFunctions["current_neutral_magic_light_gate_2"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "usageLimit");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:179
DescriptionFunctions["current_neutral_magic_town_portal"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "usageLimit");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:184
DescriptionFunctions["current_neutral_magic_town_portal_bonus_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_world_neutral.script:189
DescriptionFunctions["current_neutral_magic_town_portal_bonus_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_world_night.script:1
DescriptionFunctions["current_night_17_magic_read_minds_1"] = DescriptionRuntime.memoize(function(ctx) {
  let viewRadius = DescriptionRuntime.get(ctx.currentHero, "heroStat.viewRadius");
  let heroRadius = (Number(viewRadius) || 0) * (Number("3") || 0);
  return DescriptionRuntime.formatModInt(heroRadius);
}, 5);

// Source: DB/info/info_script_magic/magic_world_night.script:10
DescriptionFunctions["current_night_17_magic_read_minds_level_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_magic/magic_world_night.script:17
DescriptionFunctions["current_night_18_magic_nairas_veil"] = DescriptionRuntime.memoize(function(ctx) {
  let baseRadius = DescriptionRuntime.get(ctx.currentMagic, "parameters[0]");
  let bonusRadius = DescriptionRuntime.get(ctx.currentMagic, "parameters[1]");
  let level = (ctx.currentMagic.upgradeLevel ?? 0) + 1;
  let levelSub = (Number(level) || 0) - (Number(1) || 0);
  let bonusRadiusMul = (Number(bonusRadius) || 0) * (Number(levelSub) || 0);
  let finalRadius = (Number(baseRadius) || 0) + (Number(bonusRadiusMul) || 0);
  return DescriptionRuntime.formatModInt(finalRadius);
}, 5);

// Source: DB/info/info_script_magic/magic_world_primal.script:3
DescriptionFunctions["current_primal_18_magic_primordial_chaos_1"] = DescriptionRuntime.memoize(function(ctx) {
  let baseRadius = DescriptionRuntime.get(ctx.currentMagic, "parameters[0]");
  let viewRadius = DescriptionRuntime.get(ctx.currentHero, "heroStat.viewRadius");
  let heroRadius = (Number(viewRadius) || 0) * (Number(baseRadius) || 0);
  return DescriptionRuntime.formatModInt(heroRadius);
}, 5);

// Source: DB/info/info_script_magic/magic_world_primal.script:13
DescriptionFunctions["current_primal_18_magic_primordial_chaos_2"] = DescriptionRuntime.memoize(function(ctx) {
  let data = DescriptionRuntime.get(ctx.currentMagic, "parameters[1]");
  let _return = (Number("1") || 0) - (Number(data) || 0);
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_primal.script:19
DescriptionFunctions["current_primal_18_magic_primordial_chaos_3"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "usageLimit");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_space.script:1
DescriptionFunctions["current_space_18_magic_assemble_1"] = DescriptionRuntime.memoize(function(ctx) {
  let baseRadius = DescriptionRuntime.get(ctx.currentMagic, "parameters[0]");
  let viewRadius = DescriptionRuntime.get(ctx.currentHero, "heroStat.viewRadius");
  let heroRadius = (Number(viewRadius) || 0) * (Number(baseRadius) || 0);
  return DescriptionRuntime.formatModInt(heroRadius);
}, 5);

// Source: DB/info/info_script_magic/magic_world_space.script:11
DescriptionFunctions["current_space_18_magic_assemble_2"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "usageLimit");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_magic/magic_world_space.script:18
DescriptionFunctions["current_space_17_magic_reinforcements_1"] = DescriptionRuntime.memoize(function(ctx) {
  let baseRadius = DescriptionRuntime.get(ctx.currentMagic, "parameters[0]");
  let viewRadius = DescriptionRuntime.get(ctx.currentHero, "heroStat.viewRadius");
  let heroRadius = (Number(viewRadius) || 0) * (Number(baseRadius) || 0);
  return DescriptionRuntime.formatModInt(heroRadius);
}, 5);

// Source: DB/info/info_script_magic/magic_world_space.script:29
DescriptionFunctions["current_space_17_magic_reinforcements_2"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentMagic, "usageLimit");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:4
DescriptionFunctions["current_unit_ability_buff_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let baseDuration = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.duration");
  let unitsCount = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.durationPerStack[0]");
  let unitsBonusDuration = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.durationPerStack[1]");
  let fullStacksMul = (Number(currentStacks) || 0) * (Number(unitsBonusDuration) || 0);
  let fullStacksDiv = (Number(fullStacksMul) || 0) / (Number(unitsCount) || 0);
  let fullStacksDivFloor = Math.floor(Number(fullStacksDiv) || 0);
  let fullStacksAdd = (Number(baseDuration) || 0) + (Number(fullStacksDivFloor) || 0);
  return DescriptionRuntime.formatInt(fullStacksAdd);
}, 5);

// Source: DB/info/info_script_unit/units.script:24
DescriptionFunctions["current_unit_passive_buff_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let baseDuration = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.duration");
  let unitsCount = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.durationPerStack[0]");
  let unitsBonusDuration = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.durationPerStack[1]");
  let fullStacksMul = (Number(currentStacks) || 0) * (Number(unitsBonusDuration) || 0);
  let fullStacksDiv = (Number(fullStacksMul) || 0) / (Number(unitsCount) || 0);
  let fullStacksDivFloor = Math.floor(Number(fullStacksDiv) || 0);
  let fullStacksAdd = (Number(baseDuration) || 0) + (Number(fullStacksDivFloor) || 0);
  return DescriptionRuntime.formatInt(fullStacksAdd);
}, 5);

// Source: DB/info/info_script_unit/units.script:44
DescriptionFunctions["current_unit_ability_min_stat_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let damageMin = DescriptionRuntime.get(ctx.currentUnit, "damageMin");
  let damageMax = DescriptionRuntime.get(ctx.currentUnit, "damageMax");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let statDmgMult = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.statDmgMult");
  let damageMult = (Number(statDmgMult) || 0) * (Number(damageMin) || 0);
  let damage = (Number(currentStacks) || 0) * (Number(damageMult) || 0);
  return DescriptionRuntime.formatInt(damage);
}, 5);

// Source: DB/info/info_script_unit/units.script:63
DescriptionFunctions["current_unit_ability_max_stat_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let damageMin = DescriptionRuntime.get(ctx.currentUnit, "damageMin");
  let damageMax = DescriptionRuntime.get(ctx.currentUnit, "damageMax");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let statDmgMult = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.statDmgMult");
  let damageMult = (Number(statDmgMult) || 0) * (Number(damageMax) || 0);
  let damage = (Number(currentStacks) || 0) * (Number(damageMult) || 0);
  return DescriptionRuntime.formatInt(damage);
}, 5);

// Source: DB/info/info_script_unit/units.script:82
DescriptionFunctions["current_unit_ability_avg_stat_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let minDmg = DescriptionFunctions["current_unit_ability_min_stat_damage"]?.(ctx) ?? null;
  let maxDmg = DescriptionFunctions["current_unit_ability_max_stat_damage"]?.(ctx) ?? null;
  return DescriptionRuntime.formatInt("1");
}, 5);

// Source: DB/info/info_script_unit/units.script:90
DescriptionFunctions["current_unit_ability_common_self_heal"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let baseHeal = DescriptionRuntime.get(ctx.currentAbility, "selfMechanics[0].values[0]");
  let unitsCount = DescriptionRuntime.get(ctx.currentAbility, "selfMechanics[0].values[1]");
  let unitsBonusHeal = DescriptionRuntime.get(ctx.currentAbility, "selfMechanics[0].values[2]");
  let fullStacksMul = (Number(currentStacks) || 0) * (Number(unitsBonusHeal) || 0);
  let fullStacksDiv = (Number(fullStacksMul) || 0) / (Number(unitsCount) || 0);
  let fullStacksDivFloor = Math.floor(Number(fullStacksDiv) || 0);
  let fullStacksHeal = (Number(baseHeal) || 0) + (Number(fullStacksDivFloor) || 0);
  return DescriptionRuntime.formatInt(fullStacksHeal);
}, 5);

// Source: DB/info/info_script_unit/units.script:110
DescriptionFunctions["current_unit_ability_common_heal"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let baseHeal = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[0]");
  let unitsCount = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[1]");
  let unitsBonusHeal = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[2]");
  let fullStacksMul = (Number(currentStacks) || 0) * (Number(unitsBonusHeal) || 0);
  let fullStacksDiv = (Number(fullStacksMul) || 0) / (Number(unitsCount) || 0);
  let fullStacksDivFloor = Math.floor(Number(fullStacksDiv) || 0);
  let fullStacksHeal = (Number(baseHeal) || 0) + (Number(fullStacksDivFloor) || 0);
  return DescriptionRuntime.formatInt(fullStacksHeal);
}, 5);

// Source: DB/info/info_script_unit/units.script:130
DescriptionFunctions["current_unit_ability_percent_self_heal"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let hp = DescriptionRuntime.get(ctx.currentUnit, "unit.stats.hp");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let baseHeal = DescriptionRuntime.get(ctx.currentAbility, "selfMechanics[0].values[2]");
  let healMul = (Number(hp) || 0) * (Number(baseHeal) || 0);
  return DescriptionRuntime.formatInt(healMul);
}, 5);

// Source: DB/info/info_script_unit/units.script:146
DescriptionFunctions["current_unit_ability_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let statDmgMult = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.statDmgMult");
  let minBaseDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.maxBaseDmg");
  let minStackDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.maxStackDmg");
  let baseDmg = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  let stackDmg = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  let stackDmgMul = (Number(currentStacks) || 0) * (Number(stackDmg) || 0);
  let damage = (Number(baseDmg) || 0) + (Number(stackDmgMul) || 0);
  return DescriptionRuntime.formatInt(damage);
}, 5);

// Source: DB/info/info_script_unit/units.script:171
DescriptionFunctions["current_unit_ability_damage_per_buff"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let minBuffNumDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.minBuffNumDmg");
  let maxBuffNumDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.maxBuffNumDmg");
  let minBuffNumStackDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.minBuffNumStackDmg");
  let maxBuffNumStackDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.maxBuffNumStackDmg");
  let minDebuffNumDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.minDebuffNumDmg");
  let maxDebuffNumDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.maxDebuffNumDmg");
  let minDebuffNumStackDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.minDebuffNumStackDmg");
  let maxDebuffNumStackDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.maxDebuffNumStackDmg");
  let buffNumDmg = ((Number(minBuffNumDmg) || 0) + (Number(maxBuffNumDmg) || 0)) / 2;
  let buffNumStackDmg = ((Number(minBuffNumStackDmg) || 0) + (Number(maxBuffNumStackDmg) || 0)) / 2;
  let debuffNumDmg = ((Number(minDebuffNumDmg) || 0) + (Number(maxDebuffNumDmg) || 0)) / 2;
  let debuffNumStackDmg = ((Number(minDebuffNumStackDmg) || 0) + (Number(maxDebuffNumStackDmg) || 0)) / 2;
  let buffNumStackDmgMul = (Number(currentStacks) || 0) * (Number(buffNumStackDmg) || 0);
  let debuffNumStackDmgMul = (Number(currentStacks) || 0) * (Number(debuffNumStackDmg) || 0);
  let fullBuffNumDmg = (Number(buffNumDmg) || 0) + (Number(buffNumStackDmgMul) || 0);
  let fullDebuffNumDmg = (Number(debuffNumDmg) || 0) + (Number(debuffNumStackDmg) || 0);
  let damage = (Number(fullBuffNumDmg) || 0) + (Number(fullDebuffNumDmg) || 0);
  return DescriptionRuntime.formatInt(damage);
}, 5);

// Source: DB/info/info_script_unit/units.script:203
DescriptionFunctions["current_unit_ability_summon_count"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let baseSummon = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[2]");
  let unitsCount = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[3]");
  let unitsBonusSummon = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[4]");
  let fullStacksMul = (Number(currentStacks) || 0) * (Number(unitsBonusSummon) || 0);
  let fullStacksDiv = (Number(fullStacksMul) || 0) / (Number(unitsCount) || 0);
  let fullStacksDivFloor = Math.floor(Number(fullStacksDiv) || 0);
  let fullStacksSummon = (Number(baseSummon) || 0) + (Number(fullStacksDivFloor) || 0);
  return DescriptionRuntime.formatInt(fullStacksSummon);
}, 5);

// Source: DB/info/info_script_unit/units.script:223
DescriptionFunctions["current_unit_ability_trap_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let baseDuration = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[2]");
  let spCount = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[3]");
  let spBonusDuration = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[4]");
  let spBonusDurationMul = (Number(currentStacks) || 0) * (Number(spBonusDuration) || 0);
  let spBonusDurationMulDiv = (Number(spBonusDurationMul) || 0) / (Number(spCount) || 0);
  let spBonusDurationMulDivFloor = Math.floor(Number(spBonusDurationMulDiv) || 0);
  let fullDuration = (Number(baseDuration) || 0) + (Number(spBonusDurationMulDivFloor) || 0);
  return DescriptionRuntime.formatInt(fullDuration);
}, 5);

// Source: DB/info/info_script_unit/units.script:243
DescriptionFunctions["current_unit_ability_buff_revenge_damage_param"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let baseDamage = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[2]");
  let stackBonus = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[3]");
  let stackDamage = (Number(stackBonus) || 0) * (Number(currentStacks) || 0);
  let _return = (Number(baseDamage) || 0) + (Number(stackDamage) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:259
DescriptionFunctions["current_unit_ability_buff_damage_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.damageMin");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:265
DescriptionFunctions["current_unit_ability_buff_hp_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.hp");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:271
DescriptionFunctions["current_unit_ability_buff_hpPerc_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.hpPerc");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:277
DescriptionFunctions["current_unit_ability_buff_offence_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:283
DescriptionFunctions["current_unit_ability_buff_defence_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.defence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:289
DescriptionFunctions["current_unit_ability_buff_speed_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:295
DescriptionFunctions["current_unit_ability_buff_initiative_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.initiative");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:301
DescriptionFunctions["current_unit_ability_buff_moral_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.moral");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:307
DescriptionFunctions["current_unit_ability_buff_luck_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.luck");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:313
DescriptionFunctions["current_unit_ability_buff_outDmgMods_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:319
DescriptionFunctions["current_unit_ability_buff_inDmgMods_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:325
DescriptionFunctions["current_unit_ability_buff_inAllDmgMod_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:331
DescriptionFunctions["current_unit_ability_buff_outAllDmgMod_param"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:341
DescriptionFunctions["current_ability_selfMechanics_values_0"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentAbility, "selfMechanics[0].values[0]");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:346
DescriptionFunctions["current_unit_damagePerHex"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "damagePerHex");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:351
DescriptionFunctions["current_unit_anticrit"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "anticrit");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:356
DescriptionFunctions["current_unit_globalPassives_morale"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "globalPassives[0].data.stats.moral");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:361
DescriptionFunctions["current_unit_globalPassives_luck"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "globalPassives[0].data.stats.luck");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:366
DescriptionFunctions["current_unit_globalPassives_mana"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "passives[0].data.sideModifiers[0].heroStat.manaCostBonus");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:371
DescriptionFunctions["current_unit_passives_attackPen"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "passives[0].data.stats.attackPen");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:376
DescriptionFunctions["current_unit_passives_armorPen"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "passives[0].data.stats.armorPen");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:381
DescriptionFunctions["unic_unit_vampirism_passive"] = DescriptionRuntime.memoize(function(ctx) {
  let vampirism = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].selfMechanics[0].values[1]");
  return DescriptionRuntime.formatModPercentNumeric(vampirism);
}, 5);

// Source: DB/info/info_script_unit/units.script:388
DescriptionFunctions["current_unit_energyPerTakeDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "energyPerTakeDamage");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:393
DescriptionFunctions["current_unit_energyPerRound"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "energyPerRound");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:398
DescriptionFunctions["current_unit_energyPerCast"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "energyPerCast");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:406
DescriptionFunctions["current_unit_inDmgMods_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "inDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:411
DescriptionFunctions["current_unit_inDmgMods_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "inDmgMods.list[1].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:416
DescriptionFunctions["current_unit_inDmgMods_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "inDmgMods.list[2].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:421
DescriptionFunctions["current_unit_outDmgMods_1_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:426
DescriptionFunctions["current_unit_outDmgMods_2_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "outDmgMods.list[1].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:431
DescriptionFunctions["current_unit_outDmgMods_3_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "outDmgMods.list[2].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:440
DescriptionFunctions["base_class_caster_energy"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "maxEnergy");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:445
DescriptionFunctions["base_class_caster_start_energy"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "startEnergy");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units.script:450
DescriptionFunctions["base_passive_luck_moral_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_script_unit/units.script:455
DescriptionFunctions["base_passive_luck_moral_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_script_unit/units.script:460
DescriptionFunctions["base_passive_luck_moral_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("0");
}, 5);

// Source: DB/info/info_script_unit/units.script:465
DescriptionFunctions["base_passive_luck_moral_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_script_unit/units.script:470
DescriptionFunctions["base_passive_luck_moral_5"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_script_unit/units.script:475
DescriptionFunctions["base_passive_ranged_attack_distance"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_script_unit/units.script:480
DescriptionFunctions["base_passive_ranged_penalty"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_script_unit/units.script:485
DescriptionFunctions["base_passive_ranged_penalty_max"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_script_unit/units.script:490
DescriptionFunctions["base_passive_ranged_penalty_melee"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_script_unit/units.script:495
DescriptionFunctions["base_passive_patterns_penalty"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_script_unit/units.script:500
DescriptionFunctions["base_level_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_unit/units.script:505
DescriptionFunctions["base_level_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_script_unit/units.script:510
DescriptionFunctions["base_level_param_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_script_unit/units.script:515
DescriptionFunctions["base_level_param_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_script_unit/units.script:520
DescriptionFunctions["base_level_param_5"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_script_unit/units.script:525
DescriptionFunctions["base_level_param_6"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("6");
}, 5);

// Source: DB/info/info_script_unit/units.script:530
DescriptionFunctions["base_level_param_7"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("7");
}, 5);

// Source: DB/info/info_script_unit/units.script:535
DescriptionFunctions["base_level_param_8"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("8");
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:9
DescriptionFunctions["current_unit_ability_baseBuffDuration"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDuration = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.duration");
  return DescriptionRuntime.formatInt(baseDuration);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:16
DescriptionFunctions["current_unit_ability_perStackBuffDuration_unitsCount"] = DescriptionRuntime.memoize(function(ctx) {
  let unitsCount = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.durationPerStack[0]");
  return DescriptionRuntime.formatInt(unitsCount);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:23
DescriptionFunctions["current_unit_ability_perStackBuffDuration_unitsBonusDuration"] = DescriptionRuntime.memoize(function(ctx) {
  let unitsBonusDuration = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.durationPerStack[0]");
  return DescriptionRuntime.formatInt(unitsBonusDuration);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:32
DescriptionFunctions["current_unit_passive_baseBuffDuration"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDuration = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.duration");
  return DescriptionRuntime.formatInt(baseDuration);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:39
DescriptionFunctions["current_unit_passive_perStackBuffDuration_unitsCount"] = DescriptionRuntime.memoize(function(ctx) {
  let unitsCount = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.durationPerStack[0]");
  return DescriptionRuntime.formatInt(unitsCount);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:46
DescriptionFunctions["current_unit_passive_perStackBuffDuration_unitsBonusDuration"] = DescriptionRuntime.memoize(function(ctx) {
  let unitsBonusDuration = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.durationPerStack[1]");
  return DescriptionRuntime.formatInt(unitsBonusDuration);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:55
DescriptionFunctions["current_unit_ability_trap_baseBuffDuration"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDuration = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[2]");
  return DescriptionRuntime.formatInt(baseDuration);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:64
DescriptionFunctions["current_unit_passive_bonusDamage_base"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:69
DescriptionFunctions["current_unit_passive_bonusDamage_perStack"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.targetMechanics[0].values[1]");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:76
DescriptionFunctions["current_unit_minStatDamage_alt_05"] = DescriptionRuntime.memoize(function(ctx) {
  let damageMin = DescriptionRuntime.get(ctx.currentUnit, "stats.damageMin");
  let _return = (Number(damageMin) || 0) * (Number("0.5") || 0);
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:83
DescriptionFunctions["current_unit_maxStatDamage_alt_05"] = DescriptionRuntime.memoize(function(ctx) {
  let damageMax = DescriptionRuntime.get(ctx.currentUnit, "stats.damageMax");
  let _return = (Number(damageMax) || 0) * (Number("0.5") || 0);
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:90
DescriptionFunctions["current_unit_minStatDamage_alt_10"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "stats.damageMin");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:95
DescriptionFunctions["current_unit_maxStatDamage_alt_10"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "stats.damageMax");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:100
DescriptionFunctions["current_unit_minStatDamage_alt_15"] = DescriptionRuntime.memoize(function(ctx) {
  let damageMin = DescriptionRuntime.get(ctx.currentUnit, "stats.damageMin");
  let _return = (Number(damageMin) || 0) * (Number("1.5") || 0);
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:107
DescriptionFunctions["current_unit_maxStatDamage_alt_15"] = DescriptionRuntime.memoize(function(ctx) {
  let damageMax = DescriptionRuntime.get(ctx.currentUnit, "stats.damageMax");
  let _return = (Number(damageMax) || 0) * (Number("1.5") || 0);
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:114
DescriptionFunctions["current_unit_minStatDamage_alt_20"] = DescriptionRuntime.memoize(function(ctx) {
  let damageMin = DescriptionRuntime.get(ctx.currentUnit, "stats.damageMin");
  let _return = (Number(damageMin) || 0) * (Number("2") || 0);
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:121
DescriptionFunctions["current_unit_maxStatDamage_alt_20"] = DescriptionRuntime.memoize(function(ctx) {
  let damageMax = DescriptionRuntime.get(ctx.currentUnit, "stats.damageMax");
  let _return = (Number(damageMax) || 0) * (Number("2") || 0);
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:128
DescriptionFunctions["unic_unit_petSelfHeal"] = DescriptionRuntime.memoize(function(ctx) {
  let unitsBonusStacks = DescriptionRuntime.get(ctx.currentAbility, "selfMechanics[0].values[2]");
  return DescriptionRuntime.formatModPercentNumeric(unitsBonusStacks);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:136
DescriptionFunctions["current_unit_vampireAbility1"] = DescriptionRuntime.memoize(function(ctx) {
  let stackDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatInt(stackDmg);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:143
DescriptionFunctions["current_unit_vampireAbility2"] = DescriptionRuntime.memoize(function(ctx) {
  let stackDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[2]");
  return DescriptionRuntime.formatInt(stackDmg);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:150
DescriptionFunctions["current_unit_abilitySummonCount"] = DescriptionRuntime.memoize(function(ctx) {
  let unitsBonusSummon = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[4]");
  return DescriptionRuntime.formatInt(unitsBonusSummon);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:157
DescriptionFunctions["current_unit_abilityCommonHeal"] = DescriptionRuntime.memoize(function(ctx) {
  let unitsBonusHeal = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[2]");
  return DescriptionRuntime.formatInt(unitsBonusHeal);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:164
DescriptionFunctions["current_unit_ability_RevengeDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let baseDamage = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[2]");
  let stackBonus = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.targetMechanics[0].values[3]");
  return DescriptionRuntime.formatModInt(stackBonus);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:173
DescriptionFunctions["unic_unit_twinkleManaAbility"] = DescriptionRuntime.memoize(function(ctx) {
  let unitsBonusMana = DescriptionRuntime.get(ctx.currentAbility, "selfMechanics[0].values[4]");
  return DescriptionRuntime.formatModInt(unitsBonusMana);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:181
DescriptionFunctions["current_unit_abilityDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let maxStackDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.maxStackDmg");
  return DescriptionRuntime.formatInt(maxStackDmg);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:188
DescriptionFunctions["current_unit_abilityBaseDamage"] = DescriptionRuntime.memoize(function(ctx) {
  let maxStackDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.minBaseDmg");
  return DescriptionRuntime.formatInt(maxStackDmg);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:195
DescriptionFunctions["current_unit_startTurnDamage_active"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  return DescriptionRuntime.formatModInt(buffData);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:204
DescriptionFunctions["current_unit_startTurnDamage_passive"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.sid");
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  return DescriptionRuntime.formatModInt(buffData);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:213
DescriptionFunctions["unic_unit_hiveQueenAbility2"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let minStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "timeoutActions[0].damageDealer.minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "timeoutActions[0].damageDealer.maxStackDmg");
  let stackDmg = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  let _return = Math.floor(Number(stackDmg) || 0);
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:224
DescriptionFunctions["unic_unit_SchismCalling"] = DescriptionRuntime.memoize(function(ctx) {
  let percent = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[1]");
  return DescriptionRuntime.formatModPercentNumeric(percent);
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:231
DescriptionFunctions["unic_unit_alt_text_phoenix_res_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_unit/units_alts.script:236
DescriptionFunctions["unic_unit_alt_text_phoenix_res_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50%");
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:1
DescriptionFunctions["unic_unit_demon_defence_passive"] = DescriptionRuntime.memoize(function(ctx) {
  let passiveBonus = DescriptionRuntime.get(ctx.currentUnit, "conditionalPassives[0].stats.defence");
  return DescriptionRuntime.formatModInt(passiveBonus);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:8
DescriptionFunctions["unic_unit_demon_offence_passive"] = DescriptionRuntime.memoize(function(ctx) {
  let passiveBonus = DescriptionRuntime.get(ctx.currentUnit, "conditionalPassives[0].stats.offence");
  return DescriptionRuntime.formatModInt(passiveBonus);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:15
DescriptionFunctions["unic_unit_demon_anticrit_passive"] = DescriptionRuntime.memoize(function(ctx) {
  let passiveBonus = DescriptionRuntime.get(ctx.currentUnit, "conditionalPassives[1].stats.anticrit");
  return DescriptionRuntime.formatModPercentNumeric(passiveBonus);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:22
DescriptionFunctions["unic_unit_demon_crit_passive"] = DescriptionRuntime.memoize(function(ctx) {
  let passiveBonus = DescriptionRuntime.get(ctx.currentUnit, "conditionalPassives[1].stats.crit");
  return DescriptionRuntime.formatModPercentNumeric(passiveBonus);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:29
DescriptionFunctions["unic_unit_lava_larva_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let heroLevelBase = DescriptionRuntime.get(ctx.currentHero, "level");
  let heroLevel = (Number(heroLevelBase) || 0) - (Number("1") || 0);
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let statDmgMult = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.statDmgMult");
  let minBaseDmg = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.maxBaseDmg");
  let minStackDmg = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.maxStackDmg");
  let damageMultiplerPerHeroLevel = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.damageMultiplerPerHeroLevel");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let baseDmg = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  let stackDmg = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  let heroMultiplier = (Number(heroLevel) || 0) * (Number(damageMultiplerPerHeroLevel) || 0);
  let stackDmgMul = (Number(heroMultiplier) || 0) * (Number(baseDmg) || 0);
  let damage = (Number(baseDmg) || 0) + (Number(stackDmgMul) || 0);
  return DescriptionRuntime.formatModInt(damage);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:58
DescriptionFunctions["unic_unit_lava_larva_passive_1_base"] = DescriptionRuntime.memoize(function(ctx) {
  let minBaseDmg = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.maxBaseDmg");
  let _return = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:66
DescriptionFunctions["unic_unit_lava_larva_passive_1_base_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let minBaseDmg = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.minBaseDmg");
  let maxBaseDmg = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.maxBaseDmg");
  let avg = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  let _return = (Number(avg) || 0) * (Number("2") || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:76
DescriptionFunctions["unic_unit_lava_larva_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDmg = DescriptionFunctions["unic_unit_lava_larva_passive_1"]?.(ctx) ?? null;
  let _return = (Number(baseDmg) || 0) * (Number("2") || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:83
DescriptionFunctions["unic_unit_trick_demon_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "stats.damagePerDeltaLevel");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:88
DescriptionFunctions["unic_unit_locust_ability_1"] = DescriptionRuntime.memoize(function(ctx) {
  let shootRange = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.shootRange");
  return DescriptionRuntime.formatModInt(shootRange);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:95
DescriptionFunctions["unic_unit_locust_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "selfDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:101
DescriptionFunctions["unic_unit_locust_ability_3"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "selfDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:107
DescriptionFunctions["unic_unit_wasp_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.duration");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:112
DescriptionFunctions["unic_unit_wasp_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:117
DescriptionFunctions["unic_unit_godslayer_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "stats.outDamageIfLevelAbove");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:122
DescriptionFunctions["unic_unit_olgoi_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.targetMechanics[0].values[1]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:127
DescriptionFunctions["unic_unit_olgoi_ability_1"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:132
DescriptionFunctions["unic_unit_hive_queen_passive_1_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("25");
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:137
DescriptionFunctions["unic_unit_hive_queen_passive_1_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("25");
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:142
DescriptionFunctions["unic_unit_hive_queen_passive_1_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:147
DescriptionFunctions["unic_unit_hive_queen_passive_1_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("20");
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:152
DescriptionFunctions["unic_unit_hive_queen_passive_1_5"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:157
DescriptionFunctions["unic_unit_hive_queen_passive_1_6"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:162
DescriptionFunctions["unic_unit_hive_queen_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("25");
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:167
DescriptionFunctions["unic_unit_hive_queen_passive_4"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "stats.damagePerDeltaLevelLower");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:172
DescriptionFunctions["unic_unit_hive_queen_ability_1"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[3]");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:177
DescriptionFunctions["unic_unit_hive_queen_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let minStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "timeoutActions[0].damageDealer.minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(GameData.buffs?.[buffSid], "timeoutActions[0].damageDealer.maxStackDmg");
  let stackDmg = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  let damage = (Number(currentStacks) || 0) * (Number(stackDmg) || 0);
  let _return = Math.floor(Number(damage) || 0);
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:195
DescriptionFunctions["unic_unit_hive_queen_ability_3"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_demon.script:203
DescriptionFunctions["current_buff_hive_queen_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  let charges = DescriptionRuntime.get(ctx.currentBuff, "charges");
  let minStackDmg = DescriptionRuntime.get(ctx.currentBuff, "config.timeoutActions[0].damageDealer.minStackDmg");
  let maxStackDmg = DescriptionRuntime.get(ctx.currentBuff, "config.timeoutActions[0].damageDealer.maxStackDmg");
  let stackDmg = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  let damage = (Number(charges) || 0) * (Number(stackDmg) || 0);
  let _return = Math.floor(Number(damage) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:1
DescriptionFunctions["unic_unit_dungeon_alt_attack"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:6
DescriptionFunctions["unic_unit_trogl_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:12
DescriptionFunctions["unic_unit_trogl_passive_1_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.duration");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:17
DescriptionFunctions["unic_unit_trogl_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:23
DescriptionFunctions["unic_unit_trogl_passive_2_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.buff.duration");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:28
DescriptionFunctions["unic_unit_assassin_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "stats.crit");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:33
DescriptionFunctions["unic_unit_assassin_passive_1_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:38
DescriptionFunctions["unic_unit_assassin_passive_3"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.luck");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:44
DescriptionFunctions["unic_unit_blade_dancer_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.defence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:50
DescriptionFunctions["unic_unit_minos_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "stats.additionalActionChanceModifier");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:55
DescriptionFunctions["unic_unit_minos_passive_1_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:60
DescriptionFunctions["unic_unit_minos_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.moral");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:66
DescriptionFunctions["unic_unit_minos_passive_3_1"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "passives[1].actions[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:72
DescriptionFunctions["unic_unit_minos_passive_3_2"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "passives[1].actions[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:78
DescriptionFunctions["unic_unit_medusa_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.initiative");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:84
DescriptionFunctions["unic_unit_medusa_passive_1_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.duration");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:89
DescriptionFunctions["unic_unit_hydra_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:95
DescriptionFunctions["unic_unit_hydra_passive_1_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.duration");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:100
DescriptionFunctions["unic_unit_hydra_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("25");
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:108
DescriptionFunctions["unic_unit_hydra_passive_2_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.buff.duration");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:113
DescriptionFunctions["unic_unit_hydra_passive_4"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:119
DescriptionFunctions["unic_unit_black_dragon_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "globalPassives[0].data.stats.moral");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:124
DescriptionFunctions["unic_unit_black_dragon_ability_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_script_unit/units_dungeon.script:129
DescriptionFunctions["unic_unit_medusa_stone_description"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_script_unit/units_human.script:1
DescriptionFunctions["unic_unit_esquire_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.defence");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_human.script:7
DescriptionFunctions["unic_unit_esquire_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "aura.data.stats.inDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_human.script:12
DescriptionFunctions["unic_unit_crossbowman_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_unit/units_human.script:17
DescriptionFunctions["unic_unit_crossbowman_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_script_unit/units_human.script:22
DescriptionFunctions["unic_unit_lightweaver_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.damageMin");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_human.script:28
DescriptionFunctions["unic_unit_sunlight_cavalry_passive_3"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "passives[1].actions[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.offence");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_human.script:34
DescriptionFunctions["unic_unit_angel_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.statDmgMult");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:1
DescriptionFunctions["unic_unit_twinkle_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:6
DescriptionFunctions["unic_unit_elem_active"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.maxEnergy");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:12
DescriptionFunctions["unic_unit_twinkle_ability_1"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let baseMana = DescriptionRuntime.get(ctx.currentAbility, "selfMechanics[0].values[2]");
  let unitsCount = DescriptionRuntime.get(ctx.currentAbility, "selfMechanics[0].values[3]");
  let unitsBonusMana = DescriptionRuntime.get(ctx.currentAbility, "selfMechanics[0].values[4]");
  let fullStacksMul = (Number(currentStacks) || 0) * (Number(unitsBonusMana) || 0);
  let fullStacksDiv = (Number(fullStacksMul) || 0) / (Number(unitsCount) || 0);
  let fullStacksDivFloor = Math.floor(Number(fullStacksDiv) || 0);
  let fullStacksMana = (Number(baseMana) || 0) + (Number(fullStacksDivFloor) || 0);
  return DescriptionRuntime.formatModInt(fullStacksMana);
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:32
DescriptionFunctions["unic_unit_twinkle_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[2]");
  return DescriptionRuntime.formatString(_return);
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:37
DescriptionFunctions["unic_unit_twinkle_ability_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:45
DescriptionFunctions["unic_unit_ent_passive_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:55
DescriptionFunctions["unic_unit_ent_passive_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:65
DescriptionFunctions["unic_unit_ent_ability_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:70
DescriptionFunctions["unic_unit_aqualotl_ability_4"] = DescriptionRuntime.memoize(function(ctx) {
  let shootRange = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.shootRange");
  return DescriptionRuntime.formatInt(shootRange);
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:77
DescriptionFunctions["unic_unit_druid_ability_1"] = DescriptionRuntime.memoize(function(ctx) {
  let manaPerEnergy = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[1]");
  return DescriptionRuntime.formatInt(manaPerEnergy);
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:84
DescriptionFunctions["unic_unit_druid_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:89
DescriptionFunctions["unic_unit_druid_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let _return = (Number(currentStacks) || 0) * (Number(buffData) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:104
DescriptionFunctions["unic_unit_qilin_passive_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:109
DescriptionFunctions["unic_unit_qilin_passive_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:114
DescriptionFunctions["unic_unit_qilin_ability_6"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:120
DescriptionFunctions["unic_unit_phoenix_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let startStacksPerc = (Number(maxStacks) || 0) / (Number(2) || 0);
  let startStacksPercFloor = Math.floor(Number(startStacksPerc) || 0);
  let currentStacks = (Number(startStacksPercFloor) || 0) + (Number(1) || 0);
  return DescriptionRuntime.formatString(currentStacks);
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:133
DescriptionFunctions["unic_unit_phoenix_passive_2_add"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:138
DescriptionFunctions["unic_unit_phoenix_passive_3"] = DescriptionRuntime.memoize(function(ctx) {
  let heal = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModPercentNumeric(heal);
}, 5);

// Source: DB/info/info_script_unit/units_nature.script:145
DescriptionFunctions["unic_unit_phoenix_ability_4"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let _return = (Number(currentStacks) || 0) * (Number(buffData) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:1
DescriptionFunctions["unic_unit_lich_dragon_passive"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("25");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:9
DescriptionFunctions["unic_unit_lich_dragon_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:14
DescriptionFunctions["unic_unit_obsidian_dragon_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("25");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:19
DescriptionFunctions["unic_unit_obsidian_dragon_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:24
DescriptionFunctions["unic_unit_obsidian_dragon_passive_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("75");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:29
DescriptionFunctions["unic_unit_coatl_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "stats.maxInComingNegativeBuffDuration");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:34
DescriptionFunctions["unic_unit_star_child_ability_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:39
DescriptionFunctions["unic_unit_fairy_dragon_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:44
DescriptionFunctions["unic_unit_goblin_rogue_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("300");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:49
DescriptionFunctions["unic_unit_gorilla_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("150");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:54
DescriptionFunctions["unic_unit_giant_frog_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.sid");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let _return = (Number(currentStacks) || 0) * (Number(buffData) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:69
DescriptionFunctions["unic_unit_giant_turtle_ability_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:74
DescriptionFunctions["unic_unit_gorilla_ability_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:79
DescriptionFunctions["unic_unit_dragon_hunter_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:84
DescriptionFunctions["unic_unit_kitten_horn_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:89
DescriptionFunctions["unic_unit_peasant_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_script_unit/units_neutral.script:94
DescriptionFunctions["unic_unit_peasant_passive_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:2
DescriptionFunctions["unic_unit_flicker_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.sid");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let _return = (Number(currentStacks) || 0) * (Number(buffData) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:17
DescriptionFunctions["unic_unit_pet_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.defence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:23
DescriptionFunctions["unic_unit_pet_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.defence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:29
DescriptionFunctions["unic_unit_pet_passive_3"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.sid");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let _return = (Number(currentStacks) || 0) * (Number(buffData) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:44
DescriptionFunctions["unic_unit_pet_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let unitsBonusStacks = DescriptionRuntime.get(ctx.currentAbility, "selfMechanics[0].values[2]");
  let fullStacksMul = (Number(currentStacks) || 0) * (Number(unitsBonusStacks) || 0);
  return DescriptionRuntime.formatModInt(fullStacksMul);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:59
DescriptionFunctions["unic_unit_pet_ability_2_add"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentAbility, "selfMechanics[0].values[2]");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:64
DescriptionFunctions["unic_unit_graverobber_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let energy = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(energy);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:71
DescriptionFunctions["unic_unit_graverobber_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.sid");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let _return = (Number(currentStacks) || 0) * (Number(buffData) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:86
DescriptionFunctions["unic_unit_lich_passive_1"] = DescriptionRuntime.memoize(function(ctx) {
  let heal = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].selfMechanics[0].values[1]");
  return DescriptionRuntime.formatModPercentNumeric(heal);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:93
DescriptionFunctions["unic_unit_lich_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:98
DescriptionFunctions["unic_unit_avatar_of_war_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "passives[4].actions[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:104
DescriptionFunctions["unic_unit_avatar_of_war_passive_3"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:109
DescriptionFunctions["unic_unit_avatar_of_war_passive_4"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentUnit, "passives[0].actions[0].damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:115
DescriptionFunctions["current_unit_vampire_ability_1_1"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let baseDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[0]");
  let stackDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[1]");
  let stackDmgMul = (Number(currentStacks) || 0) * (Number(stackDmg) || 0);
  let damage = (Number(baseDmg) || 0) + (Number(stackDmgMul) || 0);
  return DescriptionRuntime.formatInt(damage);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:133
DescriptionFunctions["current_unit_vampire_ability_1_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:146
DescriptionFunctions["current_unit_vampire_ability_2_1"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let baseDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[0]");
  let stackDmg = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[1]");
  let stackDmgMul = (Number(baseDmg) || 0) * (Number(currentStacks) || 0);
  return DescriptionRuntime.formatInt(stackDmgMul);
}, 5);

// Source: DB/info/info_script_unit/units_undead.script:162
DescriptionFunctions["current_unit_vampire_ability_2_2"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let baseHeal = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[2]");
  let stackHeal = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[3]");
  let stackHealMul = (Number(baseHeal) || 0) * (Number(currentStacks) || 0);
  return DescriptionRuntime.formatInt(stackHealMul);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:1
DescriptionFunctions["unic_unit_substitute_by_hp_percent"] = DescriptionRuntime.memoize(function(ctx) {
  let percent = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[1]");
  return DescriptionRuntime.formatModPercentNumeric(percent);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:8
DescriptionFunctions["unic_unit_substitute_by_hp_unit"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  return DescriptionRuntime.formatModInt(currentStacks);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:19
DescriptionFunctions["unic_unit_unfrozen_cultist_ability_1"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let buffData = DescriptionRuntime.get(GameData.buffs?.[buffSid], "actions[0].damageDealer.minStackDmg");
  let _return = (Number(currentStacks) || 0) * (Number(buffData) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:34
DescriptionFunctions["unic_unit_unfrozen_cultist_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  let counterstrikes = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(counterstrikes);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:41
DescriptionFunctions["unic_unit_frostworm_rider_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:46
DescriptionFunctions["unic_unit_frostworm_rider_passive_3"] = DescriptionRuntime.memoize(function(ctx) {
  let magicDamage = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(magicDamage);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:53
DescriptionFunctions["unic_unit_frostworm_rider_passive_3_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let duration = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.duration");
  return DescriptionRuntime.formatModInt(duration);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:60
DescriptionFunctions["unic_unit_frostworm_rider_ability_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:65
DescriptionFunctions["unic_unit_succubus_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:70
DescriptionFunctions["unic_unit_succubus_passive_2_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let duration = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.duration");
  return DescriptionRuntime.formatModInt(duration);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:77
DescriptionFunctions["unic_unit_succubus_ability_3"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.minDamagePerEnergyLevel");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:82
DescriptionFunctions["unic_unit_arbitrator_passive_2"] = DescriptionRuntime.memoize(function(ctx) {
  let fullStacks = DescriptionRuntime.get(ctx.currentUnit, "fullStacks");
  let startStacks = DescriptionRuntime.get(ctx.currentUnit, "startBattleFullStacks");
  let currentStacks = (Number(fullStacks) || 0) + (Number(1) || 0);
  let maxStacks = (Number(startStacks) || 0) + (Number(1) || 0);
  let magicDamagePerStack = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.targetMechanics[0].values[1]");
  let magicDamage = (Number(currentStacks) || 0) * (Number(magicDamagePerStack) || 0);
  return DescriptionRuntime.formatModInt(magicDamage);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:97
DescriptionFunctions["unic_unit_arbitrator_passive_2_buff"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:102
DescriptionFunctions["unic_unit_arbitrator_passive_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("20");
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:107
DescriptionFunctions["unic_unit_arbitrator_passive_2_duration"] = DescriptionRuntime.memoize(function(ctx) {
  let duration = DescriptionRuntime.get(ctx.currentUnit, "defaultAttacks[0].damageDealer.buff.duration");
  return DescriptionRuntime.formatModInt(duration);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:114
DescriptionFunctions["unic_unit_arbitrator_ability_1"] = DescriptionRuntime.memoize(function(ctx) {
  let shootRange = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.orderedCastParams[0].distanceFromFirst");
  return DescriptionRuntime.formatInt(shootRange);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:121
DescriptionFunctions["unic_unit_arbitrator_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  let shootRange = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.orderedCastParams[0].distanceFromFirst");
  return DescriptionRuntime.formatInt(shootRange);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:128
DescriptionFunctions["unic_unit_arbitrator_ability_4"] = DescriptionRuntime.memoize(function(ctx) {
  let shootRange = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.orderedCastParams[0].distanceFromFirst");
  return DescriptionRuntime.formatInt(shootRange);
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:135
DescriptionFunctions["unic_unit_unspeakable_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("200");
}, 5);

// Source: DB/info/info_script_unit/units_unfrozen.script:140
DescriptionFunctions["unic_unit_unspeakable_ability_2_alt"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:3
DescriptionFunctions["current_buff_outDmgMods_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:8
DescriptionFunctions["current_buff_inDmgMods_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.inDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:13
DescriptionFunctions["current_buff_inAllDmgMod_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.inAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:18
DescriptionFunctions["current_buff_outAllDmgMod_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.outAllDmgMod");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:23
DescriptionFunctions["current_buff_finalHealingBonusPercent_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.finalHealingBonusPercent");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:28
DescriptionFunctions["current_buff_skipActionChanceModifier_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.skipActionChanceModifier");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:33
DescriptionFunctions["current_buff_speed_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:38
DescriptionFunctions["current_buff_speed_param_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "dataConfig.data.stats.speed");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:43
DescriptionFunctions["current_buff_stacks"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = ctx.currentBuff.getStacks?.() ?? 1;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:48
DescriptionFunctions["current_buff_sp"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = ctx.currentBuff.getSpellPower?.() ?? 0;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:53
DescriptionFunctions["current_buff_sum_min_dmg"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = ctx.currentBuff.getSumMinDmg?.() ?? 0;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:58
DescriptionFunctions["current_buff_sum_max_dmg"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = ctx.currentBuff.getSumMaxDmg?.() ?? 0;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:63
DescriptionFunctions["current_buff_dot_dmg"] = DescriptionRuntime.memoize(function(ctx) {
  let minDmg = DescriptionFunctions["current_buff_sum_min_dmg"]?.(ctx) ?? null;
  let maxDmg = DescriptionFunctions["current_buff_sum_max_dmg"]?.(ctx) ?? null;
  let _return = ((Number(minDmg) || 0) + (Number(maxDmg) || 0)) / 2;
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:71
DescriptionFunctions["current_buff_hot_dmg"] = DescriptionRuntime.memoize(function(ctx) {
  let buffStacks = ctx.currentBuff.getStacks?.() ?? 1;
  let buffSP = ctx.currentBuff.getSpellPower?.() ?? 0;
  let baseHeal = DescriptionRuntime.get(ctx.currentBuff, "config.actions[0].damageDealer.targetMechanics[0].values[0]");
  let stackBonus = DescriptionRuntime.get(ctx.currentBuff, "config.actions[0].damageDealer.targetMechanics[0].values[2]");
  let stackHeal = (Number(stackBonus) || 0) * (Number(buffSP) || 0);
  let heal = (Number(baseHeal) || 0) + (Number(stackHeal) || 0);
  let _return = (Number(heal) || 0) * (Number(buffStacks) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:84
DescriptionFunctions["current_buff_revenge_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSP = ctx.currentBuff.getSpellPower?.() ?? 0;
  let baseDamage = DescriptionRuntime.get(ctx.currentBuff, "config.actions[0].damageDealer.targetMechanics[0].values[2]");
  let stackBonus = DescriptionRuntime.get(ctx.currentBuff, "config.actions[0].damageDealer.targetMechanics[0].values[3]");
  let stackDamage = (Number(stackBonus) || 0) * (Number(buffSP) || 0);
  let _return = (Number(baseDamage) || 0) + (Number(stackDamage) || 0);
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:95
DescriptionFunctions["current_buff_initiative_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.initiative");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:100
DescriptionFunctions["current_buff_offence_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:105
DescriptionFunctions["current_buff_offence_param_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "dataConfig.data.stats.offence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:110
DescriptionFunctions["current_buff_defence_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.defence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:115
DescriptionFunctions["current_buff_defence_param_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "dataConfig.data.stats.defence");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:120
DescriptionFunctions["current_buff_damageMin_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.damageMin");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:125
DescriptionFunctions["current_buff_damageMax_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.damageMax");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:130
DescriptionFunctions["current_buff_moral_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.moral");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:135
DescriptionFunctions["current_buff_luck_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.luck");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:140
DescriptionFunctions["current_buff_hp_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.hp");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:145
DescriptionFunctions["current_buff_hpPerc_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.hpPerc");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:150
DescriptionFunctions["current_buff_maxEnergy_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.maxEnergy");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:155
DescriptionFunctions["current_buff_numCounters_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.numCounters");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:160
DescriptionFunctions["current_buff_tauntRadius_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.tauntRadius");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:165
DescriptionFunctions["current_buff_healthLimitMinPercent_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.healthLimitMinPercent");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:170
DescriptionFunctions["current_buff_energyPerRound_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.energyPerRound");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:175
DescriptionFunctions["current_buff_energyPerCast_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.data.stats.energyPerCast");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:180
DescriptionFunctions["current_buff_mimicStats_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.mimicStats[0].bonusFloat");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:185
DescriptionFunctions["current_buff_magic_holy_arms_effect_param"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.actions[0].damageDealer.targetMechanics[0].values[0]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:190
DescriptionFunctions["current_buff_magic_arinas_chosen_effect_description_special_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_script_buffs/buffs.script:195
DescriptionFunctions["current_buff_ent_passive"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.currentBuff, "config.actions[0].damageDealer.targetMechanics[0].values[2]");
  return DescriptionRuntime.formatModInt(_return);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:5
DescriptionFunctions["hero_ability_baseDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDmg = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatInt(baseDmg);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:15
DescriptionFunctions["hero_ability_damageMultiplerPerHeroLevel"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatFloat(damageMultiplerPerHeroLevel);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:22
DescriptionFunctions["hero_ability_damageMultiplerPerHeroLevelPerc"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatModPercentNumeric(damageMultiplerPerHeroLevel);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:29
DescriptionFunctions["sentry_ability_baseDmg"] = DescriptionRuntime.memoize(function(ctx) {
  let minBaseDmg = DescriptionRuntime.get(ctx.currentSentry, "config.stats.damageMin");
  let maxBaseDmg = DescriptionRuntime.get(ctx.currentSentry, "config.stats.damageMax");
  let baseDmg = ((Number(minBaseDmg) || 0) + (Number(maxBaseDmg) || 0)) / 2;
  return DescriptionRuntime.formatInt(baseDmg);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:39
DescriptionFunctions["sentry_ability_damageMultiplierPerBuilding"] = DescriptionRuntime.memoize(function(ctx) {
  let damageMultiplierPerBuilding = DescriptionRuntime.get(ctx.currentSentry, "config.stats.damageMultiplierPerBuilding");
  return DescriptionRuntime.formatFloat(damageMultiplierPerBuilding);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:46
DescriptionFunctions["sentry_ability_damageMultiplierPerBuildingPerc"] = DescriptionRuntime.memoize(function(ctx) {
  let damageMultiplierPerBuilding = DescriptionRuntime.get(ctx.currentSentry, "config.stats.damageMultiplierPerBuilding");
  return DescriptionRuntime.formatModPercentNumeric(damageMultiplierPerBuilding);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:53
DescriptionFunctions["hero_ability_skill_damage_ability"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDmg = DescriptionFunctions["hero_ability_baseDmg"]?.(ctx) ?? null;
  let damageMultiplerPerHeroLevel = DescriptionFunctions["hero_ability_damageMultiplerPerHeroLevel"]?.(ctx) ?? null;
  let heroLevelBase = DescriptionRuntime.get(ctx.currentHero, "level");
  let heroLevel = (Number(heroLevelBase) || 0) - (Number("1") || 0);
  let heroOFF = DescriptionRuntime.get(ctx.currentHero, "heroStat.offence");
  let heroDEF = DescriptionRuntime.get(ctx.currentHero, "heroStat.defence");
  let heroSP = DescriptionRuntime.get(ctx.currentHero, "heroStat.spellPower");
  let heroINT = DescriptionRuntime.get(ctx.currentHero, "heroStat.intelligence");
  let summHeroStat = (Number(heroOFF) || 0) + (Number(heroDEF) || 0) + (Number(heroSP) || 0) + (Number(heroINT) || 0);
  let stackDmg = ((Number(minStackDmg) || 0) + (Number(maxStackDmg) || 0)) / 2;
  let statDmg = ((Number(minStatDmg) || 0) + (Number(maxStatDmg) || 0)) / 2;
  let damageStackBonus = (Number(heroSP) || 0) * (Number(stackDmg) || 0);
  let damageStatBonus = (Number(summHeroStat) || 0) * (Number(statDmg) || 0);
  let damageBase = (Number(baseDmg) || 0) + (Number(damageStatBonus) || 0) + (Number(damageStackBonus) || 0);
  let damageMultipler = (Number(damageMultiplerPerHeroLevel) || 0) * (Number(heroLevel) || 0);
  let damageBonus = (Number(damageMultipler) || 0) * (Number(damageBase) || 0);
  let damage = (Number(damageBase) || 0) + (Number(damageBonus) || 0);
  return DescriptionRuntime.formatInt(damage);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:87
DescriptionFunctions["hero_ability_attack_siege_ability"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDmg = DescriptionFunctions["hero_ability_baseDmg"]?.(ctx) ?? null;
  let damageMultiplerPerHeroLevel = DescriptionFunctions["hero_ability_damageMultiplerPerHeroLevel"]?.(ctx) ?? null;
  let heroLevelBase = DescriptionRuntime.get(ctx.currentHero, "level");
  let heroLevel = (Number(heroLevelBase) || 0) - (Number("1") || 0);
  let heroSP = DescriptionRuntime.get(ctx.currentHero, "heroStat.spellPower");
  let damageMultipler = (Number(damageMultiplerPerHeroLevel) || 0) * (Number(heroLevel) || 0);
  let damageBonus = (Number(damageMultipler) || 0) * (Number(baseDmg) || 0);
  let damage = (Number(baseDmg) || 0) + (Number(damageBonus) || 0);
  return DescriptionRuntime.formatInt(damage);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:106
DescriptionFunctions["hero_ability_attack_siege_tower_ability"] = DescriptionRuntime.memoize(function(ctx) {
  let baseDmg = DescriptionFunctions["sentry_ability_baseDmg"]?.(ctx) ?? null;
  let damageMultiplierPerBuilding = DescriptionFunctions["sentry_ability_damageMultiplierPerBuilding"]?.(ctx) ?? null;
  let minBaseDmg = DescriptionRuntime.get(ctx.currentSentry, "config.stats.damageMin");
  let maxBaseDmg = DescriptionRuntime.get(ctx.currentSentry, "config.stats.damageMax");
  let buildingLevel = ctx.currentCity?.buildingsCount ?? 0;
  let damageMultipler = (Number(damageMultiplierPerBuilding) || 0) * (Number(buildingLevel) || 0);
  let damageBonus = (Number(damageMultipler) || 0) * (Number(baseDmg) || 0);
  let damage = (Number(baseDmg) || 0) + (Number(damageBonus) || 0);
  return DescriptionRuntime.formatInt(damage);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:123
DescriptionFunctions["hero_ability_skill_faction_dungeon_ability"] = DescriptionRuntime.memoize(function(ctx) {
  let buffData = DescriptionRuntime.get(GameData.sidebuffs?.[buffSid], "actions[0].damageDealer.buff.sid");
  let skillData = DescriptionRuntime.get(GameData.buffs?.[buffData], "data.stats.offence");
  return DescriptionRuntime.formatInt(skillData);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:132
DescriptionFunctions["hero_ability_skill_faction_humans_ability"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.inDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:138
DescriptionFunctions["hero_ability_skill_faction_demon_ability_1"] = DescriptionRuntime.memoize(function(ctx) {
  let summonData = DescriptionRuntime.get(GameData.obstacles?.[summonSid], "onTimeoutMechanic.values[2]");
  return DescriptionRuntime.formatModPercentNumeric(summonData);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:146
DescriptionFunctions["hero_ability_skill_faction_demon_ability_2"] = DescriptionRuntime.memoize(function(ctx) {
  let summonData = DescriptionRuntime.get(GameData.obstacles?.[summonSid], "stats.hp");
  return DescriptionRuntime.formatModInt(summonData);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:154
DescriptionFunctions["hero_ability_sub_skill_faction_undead_5_ability"] = DescriptionRuntime.memoize(function(ctx) {
  let heroSP = DescriptionRuntime.get(ctx.currentHero, "heroStat.spellPower");
  let healStackBonus = (Number(heroSP) || 0) * (Number(perStackHeal) || 0);
  let heal = (Number(baseHeal) || 0) + (Number(healStackBonus) || 0);
  return DescriptionRuntime.formatInt(heal);
}, 5);

// Source: DB/info/info_hero_ability/hero_ability.script:167
DescriptionFunctions["hero_ability_skill_faction_nature_ability"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_laws/laws.script:1
DescriptionFunctions["current_law_modPercent_bonuses_0_parameters_0"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[0]");
  return DescriptionRuntime.formatModPercentNumeric(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:8
DescriptionFunctions["current_law_modPercent_bonuses_0_parameters_1"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:15
DescriptionFunctions["current_law_modPercent_bonuses_0_parameters_2"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModPercentNumeric(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:22
DescriptionFunctions["current_law_modPercent_bonuses_0_parameters_3"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:29
DescriptionFunctions["current_law_modPercent_bonuses_1_parameters_0"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[1].parameters[0]");
  return DescriptionRuntime.formatModPercentNumeric(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:36
DescriptionFunctions["current_law_modPercent_bonuses_1_parameters_1"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[1].parameters[1]");
  return DescriptionRuntime.formatModPercentNumeric(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:43
DescriptionFunctions["current_law_modPercent_bonuses_1_parameters_2"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[1].parameters[2]");
  return DescriptionRuntime.formatModPercentNumeric(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:50
DescriptionFunctions["current_law_modPercent_bonuses_1_parameters_3"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[1].parameters[3]");
  return DescriptionRuntime.formatModPercentNumeric(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:59
DescriptionFunctions["current_law_modInt_bonuses_0_parameters_0"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[0]");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:66
DescriptionFunctions["current_law_modInt_bonuses_0_parameters_1"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:73
DescriptionFunctions["current_law_modInt_bonuses_0_parameters_2"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:80
DescriptionFunctions["current_law_modInt_bonuses_0_parameters_3"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:87
DescriptionFunctions["current_law_modInt_bonuses_1_parameters_0"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[1].parameters[0]");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:94
DescriptionFunctions["current_law_modInt_bonuses_1_parameters_1"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[1].parameters[1]");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:101
DescriptionFunctions["current_law_modInt_bonuses_2_parameters_0"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[2].parameters[0]");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:108
DescriptionFunctions["current_law_modInt_bonuses_2_parameters_1"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[2].parameters[1]");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:115
DescriptionFunctions["current_law_modInt_bonuses_3_parameters_1"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[3].parameters[1]");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:122
DescriptionFunctions["current_law_modInt_bonuses_1_parameters_2"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[1].parameters[2]");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:129
DescriptionFunctions["current_law_modInt_bonuses_1_parameters_3"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[1].parameters[3]");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:138
DescriptionFunctions["current_law_modInt_bonuses_0_upgrade_increment"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].upgrade.increment");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:145
DescriptionFunctions["current_law_modInt_bonuses_0_upgrade_levelStep"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].upgrade.levelStep");
  return DescriptionRuntime.formatModInt(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:154
DescriptionFunctions["current_law_modFloatPercentF1_bonuses_0_parameters_0"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[0]");
  return DescriptionRuntime.formatModFloatPercentF1(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:161
DescriptionFunctions["current_law_modFloatPercentF1_bonuses_0_parameters_1"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModFloatPercentF1(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:168
DescriptionFunctions["current_law_modFloatPercentF2_bonuses_0_parameters_1"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[1]");
  return DescriptionRuntime.formatModFloatPercentF1(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:175
DescriptionFunctions["current_law_modFloatPercentF1_bonuses_0_parameters_2"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[2]");
  return DescriptionRuntime.formatModFloatPercentF1(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:182
DescriptionFunctions["current_law_modFloatPercentF1_bonuses_0_parameters_3"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[0].parameters[3]");
  return DescriptionRuntime.formatModFloatPercentF1(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:189
DescriptionFunctions["current_law_modFloatPercentF1_bonuses_1_parameters_0"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[1].parameters[0]");
  return DescriptionRuntime.formatModFloatPercentF1(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:196
DescriptionFunctions["current_law_modFloatPercentF1_bonuses_1_parameters_1"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[1].parameters[1]");
  return DescriptionRuntime.formatModFloatPercentF1(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:203
DescriptionFunctions["current_law_modFloatPercentF1_bonuses_1_parameters_2"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[1].parameters[2]");
  return DescriptionRuntime.formatModFloatPercentF1(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:210
DescriptionFunctions["current_law_modFloatPercentF1_bonuses_1_parameters_3"] = DescriptionRuntime.memoize(function(ctx) {
  let lawData = DescriptionRuntime.get(ctx.currentLaw, "bonuses[1].parameters[3]");
  return DescriptionRuntime.formatModFloatPercentF1(lawData);
}, 5);

// Source: DB/info/info_laws/laws.script:219
DescriptionFunctions["current_law_dungeon_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1.5");
}, 5);

// Source: DB/info/info_laws/laws.script:224
DescriptionFunctions["current_fraction_law_demon_6_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100%");
}, 5);

// Source: DB/info/info_laws/laws.script:229
DescriptionFunctions["current_unfrozen_fraction_law_21_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("6");
}, 5);

// Source: DB/info/info_city/city_building.script:1
DescriptionFunctions["current_city_main_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("500");
}, 5);

// Source: DB/info/info_city/city_building.script:6
DescriptionFunctions["current_city_main_param_1_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1000");
}, 5);

// Source: DB/info/info_city/city_building.script:11
DescriptionFunctions["current_city_main_param_1_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1500");
}, 5);

// Source: DB/info/info_city/city_building.script:16
DescriptionFunctions["current_city_main_param_1_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2000");
}, 5);

// Source: DB/info/info_city/city_building.script:21
DescriptionFunctions["current_city_main_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1000");
}, 5);

// Source: DB/info/info_city/city_building.script:26
DescriptionFunctions["current_city_main_param_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2000");
}, 5);

// Source: DB/info/info_city/city_building.script:31
DescriptionFunctions["current_city_main_param_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3000");
}, 5);

// Source: DB/info/info_city/city_building.script:36
DescriptionFunctions["current_city_main_param_5"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_city/city_building.script:43
DescriptionFunctions["current_city_wall_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_city/city_building.script:48
DescriptionFunctions["current_city_wall_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_city/city_building.script:57
DescriptionFunctions["current_city_graal_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("100");
}, 5);

// Source: DB/info/info_city/city_building.script:64
DescriptionFunctions["current_city_magic_param_0_level"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_city/city_building.script:69
DescriptionFunctions["current_city_magic_param_1_level"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_city/city_building.script:74
DescriptionFunctions["current_city_magic_param_2_level"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_city/city_building.script:79
DescriptionFunctions["current_city_magic_param_3_level"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_city/city_building.script:84
DescriptionFunctions["current_city_magic_param_4_level"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_city/city_building.script:89
DescriptionFunctions["current_city_magic_param_5_level"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5");
}, 5);

// Source: DB/info/info_city/city_building.script:94
DescriptionFunctions["current_city_magic_param_1_count"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_city/city_building.script:99
DescriptionFunctions["current_city_magic_param_2_count"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_city/city_building.script:104
DescriptionFunctions["current_city_magic_param_3_count"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_city/city_building.script:109
DescriptionFunctions["current_city_magic_param_4_count"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_city/city_building.script:114
DescriptionFunctions["current_city_magic_param_5_count"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_city/city_building.script:121
DescriptionFunctions["current_city_bank_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1000");
}, 5);

// Source: DB/info/info_city/city_building.script:126
DescriptionFunctions["current_city_treasury_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3000");
}, 5);

// Source: DB/info/info_city/city_building.script:131
DescriptionFunctions["current_city_depot_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_city/city_building.script:138
DescriptionFunctions["current_city_Undead_Build_Unic_Graal_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_city/city_building.script:143
DescriptionFunctions["current_city_Undead_Build_Unic_Graal_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_city/city_building.script:150
DescriptionFunctions["current_city_Demon_Build_Unic_Graal_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("10");
}, 5);

// Source: DB/info/info_city/city_building.script:155
DescriptionFunctions["current_city_Demon_Build_Unic_Graal_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_city/city_building.script:160
DescriptionFunctions["current_city_Demon_Build_Unic_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_city/city_building.script:167
DescriptionFunctions["current_city_Unfrozen_Build_Unic_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_city/city_building.script:174
DescriptionFunctions["current_city_Nature_Build_Unic_Graal"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_city/city_building.script:179
DescriptionFunctions["current_city_Nature_Build_Unic_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_city/city_building.script:186
DescriptionFunctions["current_city_Human_Build_Unic_Graal_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1000");
}, 5);

// Source: DB/info/info_city/city_building.script:191
DescriptionFunctions["current_city_Human_Build_Unic_Graal_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_city/city_building.script:196
DescriptionFunctions["current_city_Human_Build_Unic_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("20");
}, 5);

// Source: DB/info/info_city/city_building.script:203
DescriptionFunctions["current_city_siege_walls_5_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("150");
}, 5);

// Source: DB/info/info_city/city_building.script:208
DescriptionFunctions["current_city_siege_walls_6_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_city/city_building.script:213
DescriptionFunctions["current_city_siege_walls_9_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("300");
}, 5);

// Source: DB/info/info_map_object/map_object.script:1
DescriptionFunctions["current_map_object_mine_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_map_object/map_object.script:6
DescriptionFunctions["current_map_object_mine_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_map_object/map_object.script:11
DescriptionFunctions["current_map_object_mine_param_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1000");
}, 5);

// Source: DB/info/info_map_object/map_object.script:17
DescriptionFunctions["current_map_object_storage_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("6-10");
}, 5);

// Source: DB/info/info_map_object/map_object.script:22
DescriptionFunctions["current_map_object_storage_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3-5");
}, 5);

// Source: DB/info/info_map_object/map_object.script:27
DescriptionFunctions["current_map_object_storage_param_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2500-3500");
}, 5);

// Source: DB/info/info_map_object/map_object.script:32
DescriptionFunctions["current_map_object_storage_param_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("20-40");
}, 5);

// Source: DB/info/info_map_object/map_object.script:38
DescriptionFunctions["current_map_object_resource_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("400-800");
}, 5);

// Source: DB/info/info_map_object/map_object.script:43
DescriptionFunctions["current_map_object_resource_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5-8");
}, 5);

// Source: DB/info/info_map_object/map_object.script:48
DescriptionFunctions["current_map_object_resource_param_3"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3-5");
}, 5);

// Source: DB/info/info_map_object/map_object.script:53
DescriptionFunctions["current_map_object_resource_param_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("8-12");
}, 5);

// Source: DB/info/info_map_object/map_object.script:59
DescriptionFunctions["current_map_object_chest_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1000-2000");
}, 5);

// Source: DB/info/info_map_object/map_object.script:64
DescriptionFunctions["current_map_object_chest_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2000");
}, 5);

// Source: DB/info/info_map_object/map_object.script:70
DescriptionFunctions["current_map_object_celestial_sphere_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_map_object/map_object.script:75
DescriptionFunctions["current_map_object_lost_library_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("6000-10000");
}, 5);

// Source: DB/info/info_map_object/map_object.script:80
DescriptionFunctions["current_map_object_hero_stats_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_map_object/map_object.script:85
DescriptionFunctions["current_map_object_hero_stats_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_map_object/map_object.script:90
DescriptionFunctions["current_map_object_hero_stats_param_2_cost"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1000");
}, 5);

// Source: DB/info/info_map_object/map_object.script:95
DescriptionFunctions["current_map_object_maze_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/info_map_object/map_object.script:100
DescriptionFunctions["current_map_object_trial_scales_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_map_object/map_object.script:105
DescriptionFunctions["current_map_object_college_of_wonder_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_map_object/map_object.script:110
DescriptionFunctions["current_map_object_college_of_wonder_param_cost"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("5000");
}, 5);

// Source: DB/info/info_map_object/map_object.script:115
DescriptionFunctions["current_map_object_hero_buff_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_map_object/map_object.script:120
DescriptionFunctions["current_map_object_pile_of_books_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("25");
}, 5);

// Source: DB/info/info_map_object/map_object.script:125
DescriptionFunctions["current_map_object_mysterious_stone_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_map_object/map_object.script:130
DescriptionFunctions["current_map_object_temple_of_magic_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_map_object/map_object.script:135
DescriptionFunctions["current_map_object_altar_of_magic_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_map_object/map_object.script:140
DescriptionFunctions["current_map_object_altar_of_magic_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_map_object/map_object.script:145
DescriptionFunctions["current_map_object_university_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_map_object/map_object.script:150
DescriptionFunctions["current_map_object_university_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2500");
}, 5);

// Source: DB/info/info_map_object/map_object.script:155
DescriptionFunctions["current_map_object_mystical_tower_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/info_map_object/map_object.script:160
DescriptionFunctions["current_map_object_huntsmans_camp_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_map_object/map_object.script:165
DescriptionFunctions["current_map_object_huntsmans_camp_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("50");
}, 5);

// Source: DB/info/info_map_object/map_object.script:170
DescriptionFunctions["current_map_object_stables_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("20");
}, 5);

// Source: DB/info/info_map_object/map_object.script:175
DescriptionFunctions["current_map_object_fountain_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("40");
}, 5);

// Source: DB/info/info_map_object/map_object.script:180
DescriptionFunctions["current_map_object_learning_stone_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1000");
}, 5);

// Source: DB/info/info_map_object/map_object.script:185
DescriptionFunctions["current_map_object_insaras_eye_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("250");
}, 5);

// Source: DB/info/info_map_object/map_object.script:190
DescriptionFunctions["current_map_object_monty_hall_param_1"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_map_object/map_object.script:195
DescriptionFunctions["current_map_object_monty_hall_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_map_object/map_object.script:200
DescriptionFunctions["current_map_object_random_hire_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("3");
}, 5);

// Source: DB/info/info_map_object/map_object.script:205
DescriptionFunctions["current_map_object_hire_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("1");
}, 5);

// Source: DB/info/info_map_object/map_object.script:210
DescriptionFunctions["current_map_insaras_eye_param"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("250");
}, 5);

// Source: DB/info/quests.script:1
DescriptionFunctions["test_subquest_current_value"] = DescriptionRuntime.memoize(function(ctx) {
  let currentCounterValue = ctx.questCounters?.["gold_piles_collected"] ?? 0;
  return DescriptionRuntime.formatInt(currentCounterValue);
}, 5);

// Source: DB/info/quests.script:8
DescriptionFunctions["test_subquest_goal_value"] = DescriptionRuntime.memoize(function(ctx) {
  let goalValue = DescriptionRuntime.get(ctx.currentQuest, "");
  return DescriptionRuntime.formatInt(goalValue);
}, 5);

// Source: DB/info/quests.script:15
DescriptionFunctions["test_subquest_left_to_kill"] = DescriptionRuntime.memoize(function(ctx) {
  let leftToKill = DescriptionRuntime.get(ctx.currentQuest, "");
  return DescriptionRuntime.formatInt(leftToKill);
}, 5);

// Source: DB/info/quests.script:23
DescriptionFunctions["M2_Q2_tethers_cleared"] = DescriptionRuntime.memoize(function(ctx) {
  let currentCounterValue = ctx.questCounters?.["tethers_visited"] ?? 0;
  return DescriptionRuntime.formatInt(currentCounterValue);
}, 5);

// Source: DB/info/quests.script:30
DescriptionFunctions["M2_Q2_tethers_to_clear"] = DescriptionRuntime.memoize(function(ctx) {
  let goalValue = DescriptionRuntime.get(ctx.currentQuest, "");
  return DescriptionRuntime.formatInt(goalValue);
}, 5);

// Source: DB/info/quests.script:38
DescriptionFunctions["M3_Q6_villages_visited"] = DescriptionRuntime.memoize(function(ctx) {
  let currentCounterValue = ctx.questCounters?.["villages_visited"] ?? 0;
  return DescriptionRuntime.formatInt(currentCounterValue);
}, 5);

// Source: DB/info/quests.script:46
DescriptionFunctions["M4_Q5_houses_visited"] = DescriptionRuntime.memoize(function(ctx) {
  let currentCounterValue = ctx.questCounters?.["pagan_dwelling_visited"] ?? 0;
  return DescriptionRuntime.formatInt(currentCounterValue);
}, 5);

// Source: DB/info/quests.script:54
DescriptionFunctions["M5_Q3_graves_marked"] = DescriptionRuntime.memoize(function(ctx) {
  let currentCounterValue = ctx.questCounters?.["graves_marked"] ?? 0;
  return DescriptionRuntime.formatInt(currentCounterValue);
}, 5);

// Source: DB/info/quests.script:61
DescriptionFunctions["M5_Q2_left_to_kill"] = DescriptionRuntime.memoize(function(ctx) {
  let leftToKill = DescriptionRuntime.get(ctx.currentQuest, "");
  return DescriptionRuntime.formatInt(leftToKill);
}, 5);

// Source: DB/info/quests.script:68
DescriptionFunctions["M5_Q6_crystal_mines_captured"] = DescriptionRuntime.memoize(function(ctx) {
  let currentCounterValue = ctx.questCounters?.["crystal_mines_captured"] ?? 0;
  return DescriptionRuntime.formatInt(currentCounterValue);
}, 5);

// Source: DB/info/quests.script:75
DescriptionFunctions["M9_Q2a_amplifiers_destroyed"] = DescriptionRuntime.memoize(function(ctx) {
  let currentCounterValue = ctx.questCounters?.["total_amplifiers_destroyed"] ?? 0;
  return DescriptionRuntime.formatInt(currentCounterValue);
}, 5);

// Source: DB/info/quests.script:82
DescriptionFunctions["M9_Q5_sylvan_killed"] = DescriptionRuntime.memoize(function(ctx) {
  let currentCounterValue = ctx.questCounters?.["sylvan_killed"] ?? 0;
  return DescriptionRuntime.formatInt(currentCounterValue);
}, 5);

// Source: DB/info/quests.script:90
DescriptionFunctions["M10_Q3_villages_saved"] = DescriptionRuntime.memoize(function(ctx) {
  let currentCounterValue = ctx.questCounters?.["villages_visited"] ?? 0;
  return DescriptionRuntime.formatInt(currentCounterValue);
}, 5);

// Source: DB/info/tutorial.script:1
DescriptionFunctions["tutorial_C2_1"] = DescriptionRuntime.memoize(function(ctx) {
  let value = DescriptionRuntime.get(ctx.currentSide, "crystals");
  return DescriptionRuntime.formatInt(value);
}, 5);

// Source: DB/info/tutorial.script:8
DescriptionFunctions["tutorial_C2_2"] = DescriptionRuntime.memoize(function(ctx) {
  let value = DescriptionRuntime.get(ctx.currentSide, "gemstones");
  return DescriptionRuntime.formatInt(value);
}, 5);

// Source: DB/info/tutorial.script:15
DescriptionFunctions["tutorial_C2_3"] = DescriptionRuntime.memoize(function(ctx) {
  let value = DescriptionRuntime.get(ctx.currentSide, "mercury");
  return DescriptionRuntime.formatInt(value);
}, 5);

// Source: DB/info/tutorial.script:22
DescriptionFunctions["tutorial_C2_1_goal"] = DescriptionRuntime.memoize(function(ctx) {
  let value = DescriptionRuntime.get(ctx.currentQuest, "");
  return DescriptionRuntime.formatInt(value);
}, 5);

// Source: DB/info/tutorial.script:29
DescriptionFunctions["tutorial_C2_2_goal"] = DescriptionRuntime.memoize(function(ctx) {
  let value = DescriptionRuntime.get(ctx.currentQuest, "");
  return DescriptionRuntime.formatInt(value);
}, 5);

// Source: DB/info/tutorial.script:36
DescriptionFunctions["tutorial_C2_3_goal"] = DescriptionRuntime.memoize(function(ctx) {
  let value = DescriptionRuntime.get(ctx.currentQuest, "");
  return DescriptionRuntime.formatInt(value);
}, 5);

// Source: DB/info/concept.script:1
DescriptionFunctions["test"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("test");
}, 5);

// Source: DB/info/concept.script:6
DescriptionFunctions["current_arena_param_4"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("4");
}, 5);

// Source: DB/info/concept.script:11
DescriptionFunctions["current_arena_param_2"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatString("2");
}, 5);

// Source: DB/info/concept.script:23
DescriptionFunctions["crossbowman_ability_1_add_damage"] = DescriptionRuntime.memoize(function(ctx) {
  let buffSid = DescriptionRuntime.get(ctx.currentAbility, "damageDealer.buff.sid");
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/concept.script:49
DescriptionFunctions["crossbowman_ability_1_duration"] = DescriptionRuntime.memoize(function(ctx) {
  return DescriptionRuntime.formatInt("2");
}, 5);

// Source: DB/info/concept.script:38
DescriptionFunctions["crossbowman_ability_1_description"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(GameData.buffs?.[buffSid], "data.stats.outDmgMods.list[0].v");
  return DescriptionRuntime.formatModPercentNumeric(_return);
}, 5);

// Source: DB/info/concept.script:52
DescriptionFunctions["map_object_test_gold"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.eventBank, "rewardSet.rewards[0].parameters[1]");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/concept.script:57
DescriptionFunctions["map_object_test_gem"] = DescriptionRuntime.memoize(function(ctx) {
  let _return = DescriptionRuntime.get(ctx.eventBank, "rewardSet.rewards[0].parameters[3]");
  return DescriptionRuntime.formatInt(_return);
}, 5);

// Source: DB/info/concept.script:71
DescriptionFunctions["text_red_damage_with_icon"] = DescriptionRuntime.memoize(function(ctx) {
  let r = "<icon=damage><color=red>[sid_from_locale]<color>";
  return null;
}, 5);

// Source: DB/info/concept.script:77
DescriptionFunctions["unit_a1_value"] = DescriptionRuntime.memoize(function(ctx) {
  let damage = Number("ability.1.damage") || 0;
  let r = (Number(damage) || 0) * (Number(damageMultipler) || 0);
  r = (Number(r) || 0) * (Number(meleDamageMultiler) || 0);
  r = (Number(r) || 0) + (Number(flatDamage) || 0);
  return null;
}, 5);

// Source: DB/info/concept.script:95
DescriptionFunctions["unit_a1_alt"] = DescriptionRuntime.memoize(function(ctx) {
  let damage = Number("ability.1.damage") || 0;
  let r = (Number(r) || 0) + (Number(flatDamage) || 0);
  let t = "{r} = {damage} * {damageMultipler}";
  return null;
}, 5);

// Source: DB/info/concept.script:118
DescriptionFunctions["unit_a1_text"] = DescriptionRuntime.memoize(function(ctx) {
  let textPrefix = DescriptionFunctions["text_red_damage_with_icon"]?.(ctx) ?? null;
  let value = DescriptionFunctions["unit_a1_value"]?.(ctx) ?? null;
  let r = "{textPrefix}<color=red>{value}<color>";
  return null;
}, 5);

// Export for use in browser and Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = { DescriptionFunctions };
}