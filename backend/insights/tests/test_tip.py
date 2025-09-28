# insights/tests/test_tipy.py
from django.core.cache import cache
from datetime import datetime, timedelta, time
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

from notes.models import Note
from moods.models import Mood

User = get_user_model()


def at_local(day, hour=9, minute=0):
    tz = timezone.get_current_timezone()
    dt = datetime.combine(day, time(hour, minute))
    return dt.replace(tzinfo=tz)


class WeeklyTipTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(email="utip@example.com", password="pass1234")
        self.other = User.objects.create_user(email="uother@example.com", password="pass1234")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

        # moods by category
        self.m_very_neg = Mood.objects.create(name="very sad", emoji="😞", category="very negative")
        self.m_neg = Mood.objects.create(name="sad", emoji="☹️", category="negative")
        self.m_neu = Mood.objects.create(name="ok", emoji="😐", category="neutral")
        self.m_pos = Mood.objects.create(name="happy", emoji="🙂", category="positive")

        # target week (Mon..Sun)
        self.monday = timezone.localdate() - timedelta(days=timezone.localdate().weekday())

    def _note(self, user, day_offset, mood):
        n = Note.objects.create(user=user, mood=mood, note="x")
        n.created_at = at_local(self.monday + timedelta(days=day_offset), 9, 5)
        n.save()
        return n

    def test_low_mood_streak_tip(self):
        # 3 consecutive days negative for self.user
        self._note(self.user, 0, self.m_neg)  # Mon
        self._note(self.user, 1, self.m_neg)  # Tue
        self._note(self.user, 2, self.m_neg)  # Wed
        # Noise from other user should not affect
        self._note(self.other, 0, self.m_pos)

        url = reverse("mood_tip") + "?week_offset=0"
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["type"], "tip")
        self.assertIn("low mood", data["message"].lower())

    def test_declining_trend_tip(self):
        # early week better, late week worse
        self._note(self.user, 0, self.m_pos)  # Mon
        self._note(self.user, 1, self.m_pos)  # Tue
        self._note(self.user, 5, self.m_neg)  # Sat
        self._note(self.user, 6, self.m_neg)  # Sun

        url = reverse("mood_tip") + "?week_offset=0"
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        self.assertIn("dipped", res.json()["message"].lower())

    def test_missing_days_tip(self):
        # no notes → missing >= 3 days
        url = reverse("mood_tip") + "?week_offset=0"
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        msg = res.json()["message"].lower()
        self.assertTrue("skipped a few days" in msg or "check-in" in msg or "check-in" in msg)
