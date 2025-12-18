# Makefile Commands

The project has a `Makefile` at the project root for common build and import tasks.

## Available Commands

| Command | Description |
|---------|-------------|
| `make import` | **Full pipeline**: database import + transpiler |
| `make import-db` | Import game data to database only |
| `make transpile` | Run script transpiler only (generates JS files) |
| `make dev` | Start development server |
| `make clean` | Clean generated files and caches |
| `make backup` | Backup generated JS files before re-transpiling |
| `make restore` | Restore JS files from backup |
| `make install` | Install Python and Node dependencies |
| `make help` | Show available commands |

## When to Use

- **After game update**: Run `make import` to re-import all data and regenerate JS
- **Testing transpiler changes**: Run `make backup` first, then `make transpile`
- **Quick iteration on DB models**: Use `make import-db` (skips transpiler)
- **Quick iteration on transpiler**: Use `make transpile` (skips DB import)

## File Paths

The Makefile uses these paths:
- **Core.zip**: `/Users/eb/Downloads/gamedata/steamapps/common/Heroes of Might & Magic Olden Era Demo/HeroesOE_Data/StreamingAssets/Core.zip`
- **Output dir**: `static/js/generated/`
- **Transpiler**: `transpiler/`

## Generated Files

The transpiler produces:
- `static/js/generated/description_functions.js` (~390KB, 1175 functions)
- `static/js/generated/game_data.js` (~162KB, lookup tables for buffs, abilities, etc.)
