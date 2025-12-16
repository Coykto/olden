from django.contrib import admin
from gamedata.models import (
    GameVersion,
    Faction,
    Unit,
    Hero,
    Skill,
    Item,
    Spell,
    UnitAbility,
    CombatModifier,
    AdvancedClass,
)


@admin.register(GameVersion)
class GameVersionAdmin(admin.ModelAdmin):
    list_display = ['build_id', 'game_updated_at', 'imported_at', 'is_active']
    list_filter = ['is_active']
    search_fields = ['build_id', 'notes']


@admin.register(Faction)
class FactionAdmin(admin.ModelAdmin):
    list_display = ['id_key', 'name', 'version', 'faction_skill']
    list_filter = ['version']
    search_fields = ['id_key', 'name']


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ['id_key', 'faction', 'tier', 'version']
    list_filter = ['version', 'faction', 'tier']
    search_fields = ['id_key', 'display_name']


@admin.register(Hero)
class HeroAdmin(admin.ModelAdmin):
    list_display = ['id_key', 'display_name', 'faction', 'class_type', 'version']
    list_filter = ['version', 'faction', 'class_type']
    search_fields = ['id_key', 'display_name']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['id_key', 'skill_type', 'version']
    list_filter = ['version', 'skill_type']
    search_fields = ['id_key']


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['id_key', 'slot', 'rarity', 'version']
    list_filter = ['version', 'slot', 'rarity']
    search_fields = ['id_key']


@admin.register(Spell)
class SpellAdmin(admin.ModelAdmin):
    list_display = ['id_key', 'school', 'level', 'version']
    list_filter = ['version', 'school', 'level']
    search_fields = ['id_key']


@admin.register(UnitAbility)
class UnitAbilityAdmin(admin.ModelAdmin):
    list_display = ['id_key', 'ability_type', 'version']
    list_filter = ['version', 'ability_type']
    search_fields = ['id_key']


@admin.register(CombatModifier)
class CombatModifierAdmin(admin.ModelAdmin):
    list_display = ['source_id', 'source_type', 'modifier_type', 'value', 'level', 'version']
    list_filter = ['version', 'source_type', 'modifier_type']
    search_fields = ['source_id']


@admin.register(AdvancedClass)
class AdvancedClassAdmin(admin.ModelAdmin):
    list_display = ['id_key', 'faction', 'class_type', 'version']
    list_filter = ['version', 'faction', 'class_type']
    search_fields = ['id_key']
