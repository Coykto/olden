"""
Unit tests for item_utils module.
"""
from unittest.mock import patch
from django.test import TestCase
from core.item_utils import parse_item_bonuses, get_item_display_name


class TestParseItemBonuses(TestCase):
    """Tests for parse_item_bonuses function."""

    def test_simple_stat_bonus(self):
        """Test parsing a simple stat bonus without upgrades."""
        bonuses = [
            {
                "type": "heroStat",
                "parameters": ["defence", "3"]
            }
        ]
        result = parse_item_bonuses(bonuses, level=1)
        self.assertEqual(result, ["+3 Defence"])

    def test_percentage_bonus(self):
        """Test parsing a percentage stat bonus."""
        bonuses = [
            {
                "type": "heroStat",
                "parameters": ["maxHealthPercent", "25"]
            }
        ]
        result = parse_item_bonuses(bonuses, level=1)
        self.assertEqual(result, ["+25% Max Health Percent"])

    def test_upgrade_scaling_level_1(self):
        """Test upgrade scaling at level 1 (no upgrades)."""
        bonuses = [
            {
                "type": "heroStat",
                "parameters": ["spellPower", "1"],
                "upgrade": {
                    "increment": 1,
                    "levelStep": 1
                }
            }
        ]
        result = parse_item_bonuses(bonuses, level=1)
        self.assertEqual(result, ["+1 Spell Power"])

    def test_upgrade_scaling_level_3(self):
        """Test upgrade scaling at level 3."""
        bonuses = [
            {
                "type": "heroStat",
                "parameters": ["spellPower", "1"],
                "upgrade": {
                    "increment": 1,
                    "levelStep": 1
                }
            }
        ]
        # Formula: 1 + (1 * floor((3-1)/1)) = 1 + 2 = 3
        result = parse_item_bonuses(bonuses, level=3)
        self.assertEqual(result, ["+3 Spell Power"])

    def test_upgrade_scaling_level_5(self):
        """Test upgrade scaling at level 5."""
        bonuses = [
            {
                "type": "heroStat",
                "parameters": ["spellPower", "1"],
                "upgrade": {
                    "increment": 1,
                    "levelStep": 1
                }
            }
        ]
        # Formula: 1 + (1 * floor((5-1)/1)) = 1 + 4 = 5
        result = parse_item_bonuses(bonuses, level=5)
        self.assertEqual(result, ["+5 Spell Power"])

    def test_upgrade_scaling_with_level_step_2(self):
        """Test upgrade scaling with levelStep = 2."""
        bonuses = [
            {
                "type": "heroStat",
                "parameters": ["attack", "5"],
                "upgrade": {
                    "increment": 2,
                    "levelStep": 2
                }
            }
        ]
        # Level 1: 5 + (2 * floor((1-1)/2)) = 5 + 0 = 5
        result = parse_item_bonuses(bonuses, level=1)
        self.assertEqual(result, ["+5 Attack"])

        # Level 3: 5 + (2 * floor((3-1)/2)) = 5 + 2 = 7
        result = parse_item_bonuses(bonuses, level=3)
        self.assertEqual(result, ["+7 Attack"])

        # Level 5: 5 + (2 * floor((5-1)/2)) = 5 + 4 = 9
        result = parse_item_bonuses(bonuses, level=5)
        self.assertEqual(result, ["+9 Attack"])

    def test_multiple_bonuses(self):
        """Test parsing multiple bonuses."""
        bonuses = [
            {
                "type": "heroStat",
                "parameters": ["defence", "3"]
            },
            {
                "type": "heroStat",
                "parameters": ["maxHealthPercent", "10"]
            }
        ]
        result = parse_item_bonuses(bonuses, level=1)
        self.assertEqual(result, ["+3 Defence", "+10% Max Health Percent"])

    def test_non_hero_stat_type_ignored(self):
        """Test that non-heroStat bonus types are ignored."""
        bonuses = [
            {
                "type": "someOtherType",
                "parameters": ["defence", "3"]
            }
        ]
        result = parse_item_bonuses(bonuses, level=1)
        self.assertEqual(result, [])

    def test_invalid_parameters_ignored(self):
        """Test that bonuses with invalid parameters are ignored."""
        bonuses = [
            {
                "type": "heroStat",
                "parameters": ["defence"]  # Missing value
            },
            {
                "type": "heroStat",
                "parameters": ["attack", "invalid"]  # Invalid value
            }
        ]
        result = parse_item_bonuses(bonuses, level=1)
        self.assertEqual(result, [])

    def test_camel_case_conversion(self):
        """Test camelCase to Title Case conversion."""
        bonuses = [
            {
                "type": "heroStat",
                "parameters": ["spellPower", "10"]
            }
        ]
        result = parse_item_bonuses(bonuses, level=1)
        self.assertEqual(result, ["+10 Spell Power"])


class TestGetItemDisplayName(TestCase):
    """Tests for get_item_display_name function."""

    @patch('core.item_utils.get_localizations')
    def test_with_localized_name(self, mock_get_localizations):
        """Test getting display name with localization available."""
        mock_get_localizations.return_value = {
            "chain_mail_artifact_name": "Chain Mail of Protection"
        }

        raw_data = {
            "id": "chain_mail_artifact",
            "name": "chain_mail_artifact_name"
        }

        result = get_item_display_name(raw_data)
        self.assertEqual(result, "Chain Mail of Protection")

    @patch('core.item_utils.get_localizations')
    def test_fallback_when_localization_missing(self, mock_get_localizations):
        """Test fallback formatting when localization is not found."""
        mock_get_localizations.return_value = {}

        raw_data = {
            "id": "chain_mail_artifact",
            "name": "chain_mail_artifact_name"
        }

        result = get_item_display_name(raw_data)
        self.assertEqual(result, "Chain Mail")

    @patch('core.item_utils.get_localizations')
    def test_fallback_removes_artifact_suffix(self, mock_get_localizations):
        """Test that fallback removes _artifact suffix."""
        mock_get_localizations.return_value = {}

        raw_data = {
            "id": "magic_sword_artifact",
            "name": "magic_sword_artifact_name"
        }

        result = get_item_display_name(raw_data)
        self.assertEqual(result, "Magic Sword")

    @patch('core.item_utils.get_localizations')
    def test_fallback_removes_item_suffix(self, mock_get_localizations):
        """Test that fallback removes _item suffix."""
        mock_get_localizations.return_value = {}

        raw_data = {
            "id": "healing_potion_item",
            "name": "healing_potion_item_name"
        }

        result = get_item_display_name(raw_data)
        self.assertEqual(result, "Healing Potion")

    @patch('core.item_utils.get_localizations')
    def test_fallback_with_no_id(self, mock_get_localizations):
        """Test fallback when no ID is present."""
        mock_get_localizations.return_value = {}

        raw_data = {
            "name": "some_name"
        }

        result = get_item_display_name(raw_data)
        self.assertEqual(result, "Unknown Item")

    @patch('core.item_utils.get_localizations')
    def test_with_empty_raw_data(self, mock_get_localizations):
        """Test with empty raw_data dict."""
        mock_get_localizations.return_value = {}

        raw_data = {}

        result = get_item_display_name(raw_data)
        self.assertEqual(result, "Unknown Item")
