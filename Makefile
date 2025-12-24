# Olden Forge - Build and Import Pipeline
#
# Usage:
#   make import      - Full import: database + transpiler
#   make import-db   - Import game data to database only
#   make transpile   - Run script transpiler only
#   make decompile   - Decompile game C# assemblies
#   make dev         - Start development server
#   make clean       - Clean generated files

# Paths
# GAME_DIR := /Volumes/BOOTCAMP/Program Files (x86)/Steam/steamapps/common/Heroes of Might & Magic Olden Era Demo
GAME_DIR := /Users/eb/Downloads/gamedata/steamapps/common/Heroes of Might & Magic Olden Era Demo
CORE_ZIP := $(GAME_DIR)/HeroesOE_Data/StreamingAssets/Core.zip
MANAGED_DIR := $(GAME_DIR)/HeroesOE_Data/Managed
OUTPUT_DIR := static/js/generated
TRANSPILER_DIR := transpiler
DECOMPILED_DIR := decompiled
GAME_DLL := Hex.dll

# Python
PYTHON := python
MANAGE := $(PYTHON) manage.py

# Node
NPX := npx
TS_NODE := $(NPX) ts-node

.PHONY: all import import-db transpile dev test clean decompile help

# Default target
all: help

# Full import pipeline
import: import-db transpile optimize-images
	@echo ""
	@echo "=========================================="
	@echo "Import complete!"
	@echo "=========================================="

# Import game data to database
import-db:
	@echo ""
	@echo "=========================================="
	@echo "Importing game data to database..."
	@echo "=========================================="
	$(MANAGE) migrate --database=gamedata
	$(MANAGE) import_gamedata --force

# Run script transpiler
transpile:
	@echo ""
	@echo "=========================================="
	@echo "Running script transpiler..."
	@echo "=========================================="
	@mkdir -p $(OUTPUT_DIR)
	cd $(TRANSPILER_DIR) && $(TS_NODE) src/index.ts "$(CORE_ZIP)" "../$(OUTPUT_DIR)/"

# Start development server
dev:
	$(MANAGE) runserver

# Clean generated files
clean:
	@echo "Cleaning generated files..."
	rm -rf $(OUTPUT_DIR)/*.js
	rm -rf __pycache__ */__pycache__ */*/__pycache__
	rm -rf .pytest_cache
	@echo "Done."

# Backup generated files before re-transpiling
backup:
	@echo "Backing up generated files..."
	@mkdir -p $(OUTPUT_DIR)_backup
	@cp -f $(OUTPUT_DIR)/*.js $(OUTPUT_DIR)_backup/ 2>/dev/null || true
	@echo "Backup saved to $(OUTPUT_DIR)_backup/"

# Restore from backup
restore:
	@echo "Restoring from backup..."
	@cp -f $(OUTPUT_DIR)_backup/*.js $(OUTPUT_DIR)/ 2>/dev/null || echo "No backup found"
	@echo "Done."

# Install dependencies
install:
	@echo "Installing Python dependencies..."
	pip install -r requirements.txt
	@echo ""
	@echo "Installing Node dependencies..."
	cd $(TRANSPILER_DIR) && npm install
	@echo ""
	@echo "Done."

optimize-images:
	$(MANAGE) optimize_images --format webp --force

# Decompile game DLLs
decompile:
	@# On macOS, ensure .NET 8 from Homebrew is available (ilspycmd requires .NET 8)
	@if [ "$$(uname)" = "Darwin" ] && [ ! -d "/opt/homebrew/opt/dotnet@8" ]; then \
		echo "Installing .NET 8 runtime (required by ilspycmd)..."; \
		brew install dotnet@8; \
	fi
	@if ! command -v ilspycmd &> /dev/null; then \
		echo "Error: ilspycmd not found. Install with: dotnet tool install -g ilspycmd"; \
		exit 1; \
	fi
	@echo ""
	@echo "=========================================="
	@echo "Decompiling game assemblies..."
	@echo "=========================================="
	@mkdir -p $(DECOMPILED_DIR)
	@echo "Decompiling $(GAME_DLL)..."
	DOTNET_ROOT=/opt/homebrew/opt/dotnet@8/libexec ilspycmd -p "$(MANAGED_DIR)/$(GAME_DLL)" -o "$(DECOMPILED_DIR)/$(basename $(GAME_DLL))"
	@echo ""
	@echo "=========================================="
	@echo "Decompilation complete! Output: $(DECOMPILED_DIR)/"
	@echo "=========================================="

# Help
help:
	@echo "Olden Forge - Build Commands"
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  import          Full import: database + transpiler + images"
	@echo "  import-db       Import game data to database only"
	@echo "  transpile       Run script transpiler only"
	@echo "  optimize-images Convert images to WebP format"
	@echo "  decompile       Decompile game C# assemblies (requires ilspycmd)"
	@echo "  dev             Start development server"
	@echo "  clean           Clean generated files"
	@echo "  backup          Backup generated JS files"
	@echo "  restore         Restore from backup"
	@echo "  install         Install all dependencies"
	@echo "  help            Show this help"
