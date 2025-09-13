# backend/moods/management/commands/seed_moods.py
from django.core.management.base import BaseCommand
from moods.models import Mood, CATEGORY_CHOICES

class Command(BaseCommand):
    help = 'Seeds the database with initial moods and associated image URLs.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding moods...")

        moods_to_seed = [
            {'name': 'Warm', 'emoji': '🔥', 'category': 'positive', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757589715/Warm_ospuu6.svg'},
            {'name': 'Annoyed', 'emoji': '😒', 'category': 'negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757615436/Annoyed_hmbpkc.svg'},
            {'name': 'Sad', 'emoji': '😔', 'category': 'negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757615267/Sad_vlwdhy.svg'},
            {'name': 'Playful', 'emoji': '😜', 'category': 'positive', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757616036/Playful_p18t2u.svg'},
            {'name': 'Neutral', 'emoji': '😐', 'category': 'neutral', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757617744/Neutral_j2n5gp.svg'},
            {'name': 'Irritated', 'emoji': '😠', 'category': 'negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757622539/Irritated_ybgvkv.svg'},
            {'name': 'Nervous', 'emoji': '😬', 'category': 'negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757623110/Nervous_m9tm4q.svg'},
            {'name': 'Helpless', 'emoji': '😩', 'category': 'very negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757624218/Helpless_rmwyq8.svg'},
            {'name': 'Hurt', 'emoji': '🤕', 'category': 'very negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757661463/Hurt_ibzurx.svg'},
            {'name': 'Happy', 'emoji': '😃', 'category': 'positive', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757659647/Happy_km0lhv.svg'},
            {'name': 'Frustrated', 'emoji': '😤', 'category': 'negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757589705/Frustated_xagicj.svg'},
            {'name': 'Excited', 'emoji': '🤩', 'category': 'very positive', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757589704/Excited_tgka5f.svg'},
            {'name': 'Lonely', 'emoji': '😞', 'category': 'very negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757660403/Lonely_bfgeld.svg'},
            {'name': 'Disbelief', 'emoji': '😲', 'category': 'negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757589703/Disbelief_cofhzn.svg'},
            {'name': 'Angry', 'emoji': '😡', 'category': 'very negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757661818/Angry_xfltel.svg'},
            {'name': 'Confused', 'emoji': '😕', 'category': 'neutral', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757589702/Confused_vlone7.svg'},
            {'name': 'Embarrassed', 'emoji': '😳', 'category': 'negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757589702/Concerned_vofqgv.svg'},
            {'name': 'Disappointed', 'emoji': '😞', 'category': 'negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757589702/Disappointed_mhmhbm.svg'},
            {'name': 'Relieved', 'emoji': '😌', 'category': 'positive', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757660828/Relieved_m34pow.svg'},
            {'name': 'Sick', 'emoji': '🤒', 'category': 'negative', 'is_active': True,
             'image_url': 'https://res.cloudinary.com/dirn4gqky/image/upload/v1757662446/Sick_dxzthr.svg'},
        ]

        for mood_data in moods_to_seed:
            Mood.objects.update_or_create(
                name=mood_data['name'],
                defaults=mood_data
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded moods with image URLs."))
