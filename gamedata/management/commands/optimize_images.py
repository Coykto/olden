"""
Management command to optimize extracted game images for web use.

Usage:
    python manage.py optimize_images                    # Optimize all (PNG)
    python manage.py optimize_images --format webp     # Convert to WebP
    python manage.py optimize_images --dry-run         # Preview changes
    python manage.py optimize_images --category heroes # Optimize one category
    python manage.py optimize_images --force           # Re-optimize all
"""
from django.core.management.base import BaseCommand

from core.image_optimizer import ImageOptimizer


class Command(BaseCommand):
    help = 'Optimize extracted game images for web use'

    def add_arguments(self, parser):
        parser.add_argument(
            '--format',
            choices=['png', 'webp'],
            default='png',
            help='Output format: png (default) or webp'
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Re-optimize even if already done'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Only report what would be done, without modifying files'
        )
        parser.add_argument(
            '--category',
            help='Optimize only this category (heroes, units, items, etc.)'
        )

    def handle(self, *args, **options):
        output_format = options['format']
        force = options['force']
        dry_run = options['dry_run']
        category = options.get('category')

        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN - no files will be modified\n'))

        optimizer = ImageOptimizer(output_format=output_format)

        self.stdout.write(f"Optimizing images (format: {output_format})...\n")
        self.stdout.write(f"Target sizes: {optimizer.TARGET_SIZES}\n")

        if category:
            if category not in optimizer.TARGET_SIZES:
                self.stdout.write(self.style.ERROR(
                    f"Unknown category: {category}\n"
                    f"Available: {', '.join(optimizer.TARGET_SIZES.keys())}"
                ))
                return

            results = {category: optimizer.optimize_category(category, force=force, dry_run=dry_run)}
        else:
            results = optimizer.optimize_all(force=force, dry_run=dry_run)

        # Print results
        total_original = 0
        total_optimized = 0
        total_processed = 0

        for cat, stats in results.items():
            if 'error' in stats:
                self.stdout.write(self.style.WARNING(f"  {cat}: {stats['error']}"))
                continue

            original_mb = stats['original_size'] / (1024 * 1024)
            optimized_mb = stats['optimized_size'] / (1024 * 1024)
            savings = stats['original_size'] - stats['optimized_size']
            savings_pct = (savings / stats['original_size'] * 100) if stats['original_size'] > 0 else 0

            total_original += stats['original_size']
            total_optimized += stats['optimized_size']
            total_processed += stats['processed']

            self.stdout.write(
                f"  {cat}: {stats['processed']} optimized, {stats['skipped']} skipped "
                f"({original_mb:.1f}MB -> {optimized_mb:.1f}MB, -{savings_pct:.0f}%)"
            )

            if stats['errors']:
                for error in stats['errors']:
                    self.stdout.write(self.style.WARNING(f"    Error: {error}"))

        # Print totals
        if total_original > 0:
            total_original_mb = total_original / (1024 * 1024)
            total_optimized_mb = total_optimized / (1024 * 1024)
            total_savings = total_original - total_optimized
            total_savings_pct = (total_savings / total_original * 100)

            self.stdout.write("")
            self.stdout.write(self.style.SUCCESS(
                f"Total: {total_processed} images optimized\n"
                f"Size: {total_original_mb:.1f}MB -> {total_optimized_mb:.1f}MB "
                f"(saved {total_savings / (1024 * 1024):.1f}MB, -{total_savings_pct:.0f}%)"
            ))
