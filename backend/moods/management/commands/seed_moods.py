# backend/moods/management/commands/seed_moods.py
from django.core.management.base import BaseCommand
from moods.models import Mood, MoodCategory
from django.db import transaction

# --- CATEGORY DATA (for MoodCategory model) ---
CATEGORY_DATA = [
    {
        "value": "very negative",
        "label": "Very Negative",
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757660403/Lonely_bfgeld.svg",
    },
    {
        "value": "negative",
        "label": "Negative",
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757615267/Sad_vlwdhy.svg",
    },
    {
        "value": "neutral",
        "label": "Neutral",
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757617744/Neutral_j2n5gp.svg",
    },
    {
        "value": "positive",
        "label": "Positive",
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757663590/Positive_yaegjw.svg",
    },
    {
        "value": "very positive",
        "label": "Very Positive",
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757664397/Very_Positive_grjod4.svg",
    },
]

# --- MOOD DATA (for Mood model) ---
MOODS_TO_SEED = [
    {
        "name": "Warm",
        "emoji_char": "🔥",
        "category_value": "positive",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589715/Warm_ospuu6.svg",
    },
    {
        "name": "Annoyed",
        "emoji_char": "😒",
        "category_value": "negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757615436/Annoyed_hmbpkc.svg",
    },
    {
        "name": "Sad",
        "emoji_char": "😔",
        "category_value": "negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757615267/Sad_vlwdhy.svg",
    },
    {
        "name": "Playful",
        "emoji_char": "😜",
        "category_value": "positive",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757616036/Playful_p18t2u.svg",
    },
    {
        "name": "Neutral",
        "emoji_char": "😐",
        "category_value": "neutral",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757617744/Neutral_j2n5gp.svg",
    },
    {
        "name": "Irritated",
        "emoji_char": "😠",
        "category_value": "negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757622539/Irritated_ybgvkv.svg",
    },
    {
        "name": "Nervous",
        "emoji_char": "😬",
        "category_value": "negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757623110/Nervous_m9tm4q.svg",
    },
    {
        "name": "Helpless",
        "emoji_char": "😩",
        "category_value": "very negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757624218/Helpless_rmwyq8.svg",
    },
    {
        "name": "Hurt",
        "emoji_char": "🤕",
        "category_value": "very negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757661463/Hurt_ibzurx.svg",
    },
    {
        "name": "Happy",
        "emoji_char": "😃",
        "category_value": "positive",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757659647/Happy_km0lhv.svg",
    },
    {
        "name": "Frustrated",
        "emoji_char": "😤",
        "category_value": "negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589705/Frustated_xagicj.svg",
    },
    {
        "name": "Excited",
        "emoji_char": "🤩",
        "category_value": "very positive",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589704/Excited_tgka5f.svg",
    },
    {
        "name": "Lonely",
        "emoji_char": "😞",
        "category_value": "very negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757660403/Lonely_bfgeld.svg",
    },
    {
        "name": "Disbelief",
        "emoji_char": "😲",
        "category_value": "negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589703/Disbelief_cofhzn.svg",
    },
    {
        "name": "Angry",
        "emoji_char": "😡",
        "category_value": "very negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757661818/Angry_xfltel.svg",
    },
    {
        "name": "Confused",
        "emoji_char": "😕",
        "category_value": "neutral",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589702/Confused_vlone7.svg",
    },
    {
        "name": "Embarrassed",
        "emoji_char": "😳",
        "category_value": "negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589702/Concerned_vofqgv.svg",
    },
    {
        "name": "Disappointed",
        "emoji_char": "😞",
        "category_value": "negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589702/Disappointed_mhmhbm.svg",
    },
    {
        "name": "Relieved",
        "emoji_char": "😌",
        "category_value": "positive",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757660828/Relieved_m34pow.svg",
    },
    {
        "name": "Sick",
        "emoji_char": "🤒",
        "category_value": "negative",
        "is_active": True,
        "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757662446/Sick_dxzthr.svg",
    },
]

# ------------------------------------------


class Command(BaseCommand):
    help = "Seeds the database with initial Mood Categories and Moods."

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write("--- Starting Mood Seeding Process ---")

        # 1. SEED CATEGORIES (must run first)
        self.stdout.write("1. Seeding Mood Categories...")
        category_objects = {}
        for data in CATEGORY_DATA:
            category, created = MoodCategory.objects.update_or_create(
                value=data["value"],
                # CORRECTED: Uses 'icon' instead of 'icon_url'
                defaults={"label": data["label"], "icon": data["icon"]},
            )
            category_objects[category.value] = category
            if created:
                self.stdout.write(f"   Created category: {category.label}")

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded {len(category_objects)} Mood Categories."
            )
        )

        # 2. SEED MOODS
        self.stdout.write("\n2. Seeding Moods...")
        moods_created = 0
        moods_updated = 0

        for mood_data in MOODS_TO_SEED:
            category_value = mood_data.pop("category_value")  # Get the category string
            category_instance = category_objects.get(category_value)

            # Prepare the defaults for update_or_create
            defaults = {
                # CORRECTED: Maps 'emoji' from data to 'emoji_char' on the model
                "emoji_char": mood_data.pop("emoji_char"),
                # CORRECTED: Maps 'image_url' from data to 'icon' on the model
                "icon": mood_data.pop("icon"),
                # CORRECTED: Sets the Foreign Key instance
                "category": category_instance,
                "is_active": mood_data.pop("is_active", True),
            }

            mood, created = Mood.objects.update_or_create(
                name=mood_data["name"], defaults=defaults
            )

            if created:
                moods_created += 1
            else:
                moods_updated += 1

        self.stdout.write(self.style.SUCCESS(f"\n--- Mood Seeding Complete ---"))
        self.stdout.write(f"Created: {moods_created} | Updated: {moods_updated}")
