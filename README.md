# Olden Forge

Hero builder and calculators for Heroes of Might and Magic: Olden Era.

## Requirements

- Python 3.10+
- Heroes of Might and Magic: Olden Era (Steam)

## Setup

```bash
# Install dependencies
uv sync

# Configure game path in config/settings.py
# Update GAME_DATA_PATH to your game installation directory

# Run migrations
uv run python manage.py migrate
```

## Import Game Data

This imports game data (heroes, units, items, skills, spells) and extracts images (portraits, icons) from Unity asset bundles.

```bash
uv run python manage.py import_gamedata

# Force re-import if version already exists
uv run python manage.py import_gamedata --force
```

Images are extracted to `media/gamedata/`.

## Run Server

```bash
uv run python manage.py runserver
```

Visit http://127.0.0.1:8000/ for the hero builder.

## Admin

```bash
# Create admin user
uv run python manage.py createsuperuser
```

Visit http://127.0.0.1:8000/admin/ to manage data.
