#!/usr/bin/env python3
"""
Verify what slot icons actually exist in resources.assets.
"""
import UnityPy
import os

GAME_DATA_PATH = "/Volumes/BOOTCAMP/Program Files (x86)/Steam/steamapps/common/Heroes of Might & Magic Olden Era Demo/HeroesOE_Data"

def main():
    resources_path = os.path.join(GAME_DATA_PATH, "resources.assets")
    env = UnityPy.load(resources_path)

    print("Equipment slot icons in resources.assets (90x90):")
    print("=" * 80)

    slot_textures = []
    for obj in env.objects:
        if obj.type.name == "Texture2D":
            try:
                data = obj.read()
                name = getattr(data, 'name', getattr(data, 'm_Name', ''))
                width = data.m_Width
                height = data.m_Height

                # Look for 90x90 slot-related textures
                if width == 90 and height == 90:
                    slot_textures.append(name)
            except:
                pass

    for name in sorted(slot_textures):
        print(f"  {name}")

    print("\n" + "=" * 80)
    print(f"TOTAL: {len(slot_textures)} slot icons at 90x90")
    print("=" * 80)

    # Check what our current extraction finds
    print("\n\nChecking current extraction patterns:")
    print("=" * 80)

    slot_names = [
        'head', 'neck', 'body', 'armor', 'cloak', 'shield',
        'weapon', 'ring1', 'ring2', 'belt', 'boots'
    ]

    for slot in slot_names:
        # Try different patterns
        patterns = [
            slot.upper(),
            f"{slot.upper()}_SLOT",
            f"slot_{slot}",
            slot,
        ]

        found = None
        for pattern in patterns:
            if pattern in slot_textures:
                found = pattern
                break

        if found:
            print(f"  {slot:12} -> FOUND: {found}")
        else:
            print(f"  {slot:12} -> NOT FOUND (tried: {', '.join(patterns)})")

if __name__ == '__main__':
    main()
