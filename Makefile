# Olden Forge - Build and Import Pipeline
#
# Usage:
#   make import      - Full import: database + transpiler
#   make import-db   - Import game data to database only
#   make transpile   - Run script transpiler only
#   make dev         - Start development server
#   make clean       - Clean generated files

# Paths
CORE_ZIP := /Volumes/BOOTCAMP/Program Files (x86)/Steam/steamapps/common/Heroes of Might & Magic Olden Era Demo/HeroesOE_Data/StreamingAssets/Core.zip
OUTPUT_DIR := static/js/generated
TRANSPILER_DIR := transpiler

# Python
PYTHON := python
MANAGE := $(PYTHON) manage.py

# Node
NPX := npx
TS_NODE := $(NPX) ts-node

.PHONY: all import import-db transpile dev test clean help

# Default target
all: help

# Full import pipeline
import: import-db transpile
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

# Help
help:
	@echo "Olden Forge - Build Commands"
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  import      Full import: database + transpiler"
	@echo "  import-db   Import game data to database only"
	@echo "  transpile   Run script transpiler only"
	@echo "  dev         Start development server"
	@echo "  clean       Clean generated files"
	@echo "  backup      Backup generated JS files"
	@echo "  restore     Restore from backup"
	@echo "  install     Install all dependencies"
	@echo "  help        Show this help"
