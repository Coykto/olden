# Development Workflow

## Running the Website

The website runs on Django at `http://localhost:8000`

### Starting the Server
```bash
uv run python manage.py runserver
```


### Key URLs
- `/` - Home page (faction selection)
- `/faction/{slug}/` - Hero selection for a faction (e.g., `/faction/dungeon/`)
- `/calculator/` - Combat Calculator (to be implemented)
- `/admin/` - Django admin

### Database Commands
```bash
# Run migrations
uv run python manage.py migrate

# Import game data (extracts from game files, stores in DB)
uv run python manage.py import_gamedata --force

# Create migrations after model changes
uv run python manage.py makemigrations gamedata --name description_of_change
```

## Project Structure

- `config/` - Django settings and main URLs
- `gamedata/` - Models for game data (Hero, Unit, Skill, etc.)
- `hero_builder/` - Views and templates for the hero builder UI
- `core/` - Utility modules:
  - `data_reader.py` - Reads game files from Core.zip
  - `asset_extractor.py` - Extracts images from Unity assets
  - `skill_value_extractor.py` - Parses .script files for skill values
  - `combat_value_extractor.py` - Extracts combat data for calculator
  - `localizations.py` - Loads localized strings from game files

## Data Import Decisions

### Campaign Items (2025-12)
Campaign-specific items (IDs starting with `campaign_`) are **excluded** during import.
These are story artifacts not meant for the hero builder (e.g., "Captured Priestesses", "Phoenix Egg").
If needed in the future, remove the `startswith("campaign_")` check in `_import_items()`.

## Game Data Location

- Game installation: `/Users/eb/Downloads/gamedata/steamapps/common/Heroes of Might & Magic Olden Era Demo/`
- Extracted DB: `/tmp/DB/` (extracted from Core.zip during import)
- Localizations: `{game_path}/HeroesOE_Data/StreamingAssets/Lang/english/texts/`
