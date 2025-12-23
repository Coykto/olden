"""
Image optimization utility for game assets.

Resizes and compresses images extracted from Unity asset bundles
to web-appropriate sizes, significantly reducing file sizes while
maintaining visual quality.
"""
from pathlib import Path
from typing import Dict, Optional, Tuple
from PIL import Image
from django.conf import settings


class ImageOptimizer:
    """Optimizes extracted game images for web use."""

    # Target max dimensions for each asset category
    # (max_width, max_height) - images will be scaled proportionally
    TARGET_SIZES: Dict[str, Tuple[int, int]] = {
        'heroes': (256, 256),               # Small hero portraits (for lists)
        'units': (128, 128),                # Unit portraits
        'items': (64, 64),                  # Item icons in equipment slots
        'skills': (64, 64),                 # Skill icons
        'advanced_classes': (128, 128),     # Subclass icons
        'spells': (64, 64),                 # Spell icons
        'passives': (32, 32),               # Passive/ability icons
        'resources': (32, 32),              # Resource icons
        'factions': (256, 256),             # Faction and class type icons
        'ui': (64, 64),                     # UI icons (stats, slots)
    }

    # Special size for files matching these patterns (checked before TARGET_SIZES)
    SPECIAL_SIZES: Dict[str, Tuple[int, int]] = {
        '_large': (256, 256),  # Large hero portraits (for modal)
    }

    # PNG compression level (0-9, higher = smaller file but slower)
    PNG_COMPRESS_LEVEL = 9

    # WebP quality (0-100, higher = better quality but larger file)
    WEBP_QUALITY = 85

    def __init__(self, base_dir: Optional[Path] = None, output_format: str = 'png'):
        """
        Initialize the optimizer.

        Args:
            base_dir: Base directory containing extracted images.
                      Defaults to MEDIA_ROOT/gamedata
            output_format: Output format - 'png' or 'webp'
        """
        self.base_dir = base_dir or Path(settings.BASE_DIR) / "media" / "gamedata"
        self.output_format = output_format.lower()

    def optimize_all(self, force: bool = False, dry_run: bool = False) -> Dict[str, Dict]:
        """
        Optimize all extracted game images.

        Args:
            force: Re-optimize even if already optimized
            dry_run: Only report what would be done, don't modify files

        Returns:
            Dict with stats per category
        """
        results = {}

        for category, target_size in self.TARGET_SIZES.items():
            category_path = self.base_dir / category

            if not category_path.exists():
                continue

            stats = self._optimize_directory(
                category_path,
                target_size,
                force=force,
                dry_run=dry_run
            )
            results[category] = stats

        return results

    def optimize_category(
        self,
        category: str,
        force: bool = False,
        dry_run: bool = False
    ) -> Dict:
        """
        Optimize a single category of images.

        Args:
            category: Category name (e.g., 'heroes', 'units')
            force: Re-optimize even if already optimized
            dry_run: Only report what would be done

        Returns:
            Dict with optimization stats
        """
        if category not in self.TARGET_SIZES:
            raise ValueError(f"Unknown category: {category}")

        category_path = self.base_dir / category

        if not category_path.exists():
            return {'error': f"Directory not found: {category_path}"}

        return self._optimize_directory(
            category_path,
            self.TARGET_SIZES[category],
            force=force,
            dry_run=dry_run
        )

    def _optimize_directory(
        self,
        directory: Path,
        target_size: Tuple[int, int],
        force: bool = False,
        dry_run: bool = False
    ) -> Dict:
        """Optimize all images in a directory."""
        stats = {
            'processed': 0,
            'skipped': 0,
            'original_size': 0,
            'optimized_size': 0,
            'errors': []
        }

        # Find all PNG files (including in subdirectories for heroes/large)
        for img_path in directory.rglob("*.png"):
            try:
                original_size = img_path.stat().st_size
                stats['original_size'] += original_size

                # Check for special size patterns (e.g., _large suffix)
                actual_target = target_size
                for pattern, special_size in self.SPECIAL_SIZES.items():
                    if pattern in img_path.stem:
                        actual_target = special_size
                        break

                result = self._optimize_image(
                    img_path,
                    actual_target,
                    force=force,
                    dry_run=dry_run
                )

                if result['optimized']:
                    stats['processed'] += 1
                    stats['optimized_size'] += result['new_size']
                else:
                    stats['skipped'] += 1
                    stats['optimized_size'] += original_size

            except Exception as e:
                stats['errors'].append(f"{img_path.name}: {e}")

        return stats

    def _optimize_image(
        self,
        img_path: Path,
        target_size: Tuple[int, int],
        force: bool = False,
        dry_run: bool = False
    ) -> Dict:
        """
        Optimize a single image.

        Args:
            img_path: Path to the image
            target_size: (max_width, max_height)
            force: Re-optimize even if size is already correct
            dry_run: Only report, don't modify

        Returns:
            Dict with 'optimized' bool and 'new_size' int
        """
        with Image.open(img_path) as img:
            width, height = img.size
            max_w, max_h = target_size

            # Check if resize is needed
            needs_resize = width > max_w or height > max_h

            if not needs_resize and not force:
                return {'optimized': False, 'new_size': img_path.stat().st_size}

            if dry_run:
                # Estimate new size (rough estimate based on dimension reduction)
                ratio = min(max_w / width, max_h / height) if needs_resize else 1
                estimated_size = int(img_path.stat().st_size * (ratio ** 2))
                return {'optimized': True, 'new_size': estimated_size}

            # Resize if needed, maintaining aspect ratio
            if needs_resize:
                img.thumbnail(target_size, Image.Resampling.LANCZOS)

            # Convert RGBA to RGB for WebP if no transparency
            if self.output_format == 'webp':
                if img.mode == 'RGBA':
                    # Check if image actually uses transparency
                    if img.split()[3].getextrema()[0] == 255:
                        # No transparency, convert to RGB
                        img = img.convert('RGB')

            # Save optimized image
            if self.output_format == 'webp':
                new_path = img_path.with_suffix('.webp')
                img.save(
                    new_path,
                    'WEBP',
                    quality=self.WEBP_QUALITY,
                    method=6  # Slowest but best compression
                )
                # Remove original PNG if converting to WebP
                if new_path != img_path:
                    img_path.unlink()
                return {'optimized': True, 'new_size': new_path.stat().st_size}
            else:
                # Optimize PNG
                img.save(
                    img_path,
                    'PNG',
                    optimize=True,
                    compress_level=self.PNG_COMPRESS_LEVEL
                )
                return {'optimized': True, 'new_size': img_path.stat().st_size}


def optimize_images(
    output_format: str = 'png',
    force: bool = False,
    dry_run: bool = False,
    category: Optional[str] = None
) -> Dict:
    """
    Convenience function to optimize extracted game images.

    Args:
        output_format: 'png' or 'webp'
        force: Re-optimize even if already done
        dry_run: Only report what would be done
        category: Optimize only this category, or all if None

    Returns:
        Optimization stats
    """
    optimizer = ImageOptimizer(output_format=output_format)

    if category:
        return optimizer.optimize_category(category, force=force, dry_run=dry_run)
    else:
        return optimizer.optimize_all(force=force, dry_run=dry_run)
