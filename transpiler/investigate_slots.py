#!/usr/bin/env python3
"""
Investigate ALL equipment slot icons in game assets.
"""
import UnityPy
import os
import re
from pathlib import Path
from collections import defaultdict

GAME_DATA_PATH = "/Volumes/BOOTCAMP/Program Files (x86)/Steam/steamapps/common/Heroes of Might & Magic Olden Era Demo/HeroesOE_Data"

# Equipment-related keywords to search for
KEYWORDS = [
    'slot', 'equip', 'item', 'armor', 'weapon', 'ring', 'head', 'cloak',
    'belt', 'boots', 'shield', 'neck', 'amulet', 'helmet', 'chest',
    'gloves', 'cape', 'body', 'inventory', 'artifact'
]

def search_textures_in_bundle(bundle_path):
    """Search for equipment-related textures in a bundle."""
    textures = []
    try:
        env = UnityPy.load(bundle_path)
        for obj in env.objects:
            if obj.type.name == "Texture2D":
                try:
                    data = obj.read()
                    # Handle different UnityPy versions
                    name = getattr(data, 'name', getattr(data, 'm_Name', '')).lower()

                    # Check if name contains any keyword
                    if any(keyword in name for keyword in KEYWORDS):
                        textures.append({
                            'name': getattr(data, 'name', getattr(data, 'm_Name', 'unknown')),
                            'width': data.m_Width,
                            'height': data.m_Height,
                            'bundle': os.path.basename(bundle_path)
                        })
                except Exception as e:
                    # Skip individual object errors
                    pass
    except Exception as e:
        print(f"Error reading {bundle_path}: {e}")

    return textures

def main():
    # Find all asset bundles
    asset_files = list(Path(GAME_DATA_PATH).glob("*.assets"))
    print(f"Found {len(asset_files)} asset bundles to search\n")

    all_textures = []

    # Search each bundle
    for i, asset_file in enumerate(asset_files, 1):
        print(f"[{i}/{len(asset_files)}] Searching {asset_file.name}...", end='')
        textures = search_textures_in_bundle(str(asset_file))
        if textures:
            print(f" Found {len(textures)} textures")
            all_textures.extend(textures)
        else:
            print(" (none)")

    print(f"\n{'='*80}")
    print(f"TOTAL FOUND: {len(all_textures)} equipment-related textures")
    print(f"{'='*80}\n")

    # Group by size
    by_size = defaultdict(list)
    for tex in all_textures:
        size = f"{tex['width']}x{tex['height']}"
        by_size[size].append(tex)

    # Print grouped by size
    for size in sorted(by_size.keys(), key=lambda s: int(s.split('x')[0])):
        textures = by_size[size]
        print(f"\n{size} ({len(textures)} textures):")
        print("-" * 80)
        for tex in sorted(textures, key=lambda t: t['name']):
            print(f"  {tex['name']:50} [{tex['bundle']}]")

    # Look for slot-specific patterns
    print(f"\n{'='*80}")
    print("SLOT-SPECIFIC ANALYSIS:")
    print(f"{'='*80}\n")

    slot_names = ['head', 'neck', 'body', 'cloak', 'shield', 'weapon', 'ring', 'belt', 'boots', 'gloves']
    for slot in slot_names:
        matches = [t for t in all_textures if slot in t['name'].lower()]
        if matches:
            print(f"\n{slot.upper()}:")
            for tex in matches:
                print(f"  {tex['name']} ({tex['width']}x{tex['height']}) [{tex['bundle']}]")
        else:
            print(f"\n{slot.upper()}: (none found)")

if __name__ == '__main__':
    main()
