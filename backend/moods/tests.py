from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from moods.models import Mood
import uuid


class MoodAPITests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create some moods
        cls.initial_count = Mood.objects.count()
        cls.active_mood = Mood.objects.create(
            id=uuid.uuid4(),
            name="Surprised",
            emoji="😮",
            category="neutral",
            is_active=True,
        )
        cls.inactive_mood = Mood.objects.create(
            id=uuid.uuid4(),
            name="Angry",
            emoji="😠",
            category="negative",
            is_active=False,
        )

    def test_list_only_active_moods(self):
        """
        GET /api/v1/moods/ should return only moods where is_active=True
        """
        url = reverse("mood-list")  # name in your router, adjust if needed
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        # Should return exactly one mood
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), self.initial_count + 1)
        self.assertEqual(data[self.initial_count]["name"], self.active_mood.name)
        self.assertEqual(data[self.initial_count]["emoji"], self.active_mood.emoji)
        self.assertEqual(data[self.initial_count]["category"], self.active_mood.category)

    def test_endpoint_caching(self):
        """
        Calling the endpoint twice within cache window should hit cache.
        Note: This is a simplistic check; for real cache tests, you may need to
        inspect headers or mock the cache backend.
        """
        url = reverse("mood-list")
        first = self.client.get(url)
        second = self.client.get(url)
        # At minimum, both calls return the same payload
        self.assertEqual(first.content, second.content)

    def test_admin_access_requires_authentication(self):
        """
        Ensure that unauthenticated users cannot access /admin/
        (should redirect to login)
        """
        response = self.client.get("/admin/")
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertIn("/admin/login/", response.url)

    def test_superuser_can_login_and_see_mood_model(self):
        """
        Create a superuser, log in via the test client,
        and verify the Mood model is listed on the admin index.
        """
        # Create and log in superuser
        from django.contrib.auth import get_user_model

        User = get_user_model()
        superuser = User.objects.create_superuser(
            "admin", "admin@example.com", "pass1234"
        )
        self.client.login(username="admin", password="pass1234")

        # Fetch admin index
        response = self.client.get("/admin/")
        self.assertContains(response, "Moods")  # should see the app label

        # Fetch mood changelist
        response = self.client.get("/admin/moods/mood/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "Select mood to change")
