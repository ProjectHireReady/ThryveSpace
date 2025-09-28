from django.core.management.base import BaseCommand
from moods.models import MoodCategory, CATEGORY_CHOICES

class Command(BaseCommand):
    help = 'Seeds the database with initial MoodCategory entries.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding Mood Categories...")
        
        categories_to_seed = [
            # The value and label are taken from CATEGORY_CHOICES
            # You must provide the icon_url here based on your cloud storage
            {"value": "very negative", "label": "Very Negative", "icon_url": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757660403/Lonely_bfgeld.svg"},
            {"value": "negative", "label": "Negative", "icon_url": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757615267/Sad_vlwdhy.svg"},
            {"value": "neutral", "label": "Neutral", "icon_url": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757617744/Neutral_j2n5gp.svg"},
            {"value": "positive", "label": "Positive", "icon_url": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757663590/Positive_yaegjw.svg"},
            {"value": "very positive", "label": "Very Positive", "icon_url": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757664397/Very_Positive_grjod4.svg"},
        ]

        created_count = 0
        for data in categories_to_seed:
            MoodCategory.objects.update_or_create(
                value=data['value'],
                defaults={'label': data['label'], 'icon_url': data['icon_url']}
            )
            created_count += 1
            
        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created_count} Mood Categories."))