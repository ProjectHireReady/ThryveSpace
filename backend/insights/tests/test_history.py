# insights/tests/test_history.py
from django.core.cache import cache
from datetime import datetime, timedelta
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

from notes.models import Note
from moods.models import Mood

User = get_user_model()


class WeeklyInsightsTests(APITestCase):
    def setUp(self):
        cache.clear() 
        self.user = User.objects.create_user(username="u1", password="pass1234")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

        # create moods for different categories and dates
        monday = timezone.localdate() - timedelta(days=timezone.localdate().weekday())
        # create moods and notes on Monday and Wednesday for this user
        mood_pos = Mood.objects.create(name="happy", emoji="🙂", category="positive")
        mood_neg = Mood.objects.create(name="sad", emoji="☹️", category="negative")

        # Note on Monday
        n1 = Note.objects.create(user=self.user, mood=mood_pos, note="Good day")
        n1.created_at = datetime.combine(monday, timezone.now().time()).replace(
            tzinfo=timezone.get_current_timezone()
        )

        n1.save()

        # Note on Wednesday
        wednesday = monday + timedelta(days=2)
        n2 = Note.objects.create(user=self.user, mood=mood_neg, note="Bad day")
        n2.created_at = datetime.combine(wednesday, timezone.now().time()).replace(
            tzinfo=timezone.get_current_timezone()
        )

        n2.save()

    def test_weekly_insights_graph_and_timeline(self):
        url = reverse("mood_history")
        res = self.client.get(f"{url}?week_offset=0")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("graph", data)
        self.assertIn("timeline", data)
        self.assertEqual(len(data["graph"]), 7)
        # graph should contain mood_value for monday and wednesday and None for other days
        values = [p["mood_value"] for p in data["graph"]]
        self.assertTrue(any(v is not None for v in values))
        # timeline should contain two notes
        self.assertGreaterEqual(len(data["timeline"]), 2)
