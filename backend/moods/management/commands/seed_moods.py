# moods/management/commands/seed_moods.py
from django.core.management.base import BaseCommand
from moods.models import Mood, CATEGORY_CHOICES

class Command(BaseCommand):
    help = 'Seeds the database with initial moods.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding moods...")

        # Create moods directly using your model's structure
        moods_to_seed = [
            {'name': 'Happy', 'emoji': '😃', 'category': 'positive', 'is_active': True},
            {'name': 'Calm', 'emoji': '😌', 'category': 'positive', 'is_active': True},
            {'name': 'Neutral', 'emoji': '😐', 'category': 'neutral', 'is_active': True},
            {'name': 'Sad', 'emoji': '😔', 'category': 'negative', 'is_active': True},
            {'name': 'Angry', 'emoji': '😡', 'category': 'very negative', 'is_active': True},
        ]
        
        for mood_data in moods_to_seed:
            Mood.objects.get_or_create(
                name=mood_data['name'],
                defaults=mood_data
            )
        
        self.stdout.write(self.style.SUCCESS("Successfully seeded moods."))