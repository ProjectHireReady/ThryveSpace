from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from moods.models import Mood
import uuid
import json


class MoodAPITests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.initial_count = Mood.objects.count()
        
        # FIX 1: Ensure 'icon' is used for model creation
        cls.active_mood = Mood.objects.create(
            id=uuid.uuid4(),
            name="Surprised",
            icon="😮",  
            category="neutral",
            is_active=True,
        )
        cls.inactive_mood = Mood.objects.create(
            id=uuid.uuid4(),
            name="Angry",
            icon="😠",  
            category="negative",
            is_active=False,
        )
        cls.url = reverse("moods_api") 

    def test_moods_api_response_structure_and_active_filtering(self):
        """
        GET /api/v1/moods/ should return a dictionary with 'categories' and 'moods'
        and the 'moods' list should only contain active moods.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.json()
        
        # 1. Check for the correct top-level keys
        self.assertIsInstance(data, dict)
        self.assertIn("categories", data)
        self.assertIn("moods", data)

        # 2. Check active mood filtering (should only see the active one)
        moods_list = data["moods"]
        
        # Check that the number of active moods is initial_count + 1
        self.assertEqual(len(moods_list), self.initial_count + 1)
        
        # Check that the names and icons of the moods match the active one
        mood_names = [mood['name'] for mood in moods_list]
        self.assertIn(self.active_mood.name, mood_names)
        self.assertNotIn(self.inactive_mood.name, mood_names)
        
        # Find the specific mood data for assertion
        active_mood_data = next(
            (m for m in moods_list if m['name'] == self.active_mood.name), 
            None
        )

        self.assertIsNotNone(active_mood_data)
        self.assertEqual(active_mood_data["icon"], self.active_mood.icon) 
        self.assertEqual(active_mood_data["category"], self.active_mood.category)

    def test_endpoint_caching_etag_304(self):
        """
        Tests ETag generation and 304 Not Modified response using If-None-Match header.
        """
        # 1. First request: Establish ETag
        first_response = self.client.get(self.url)
        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        self.assertIn("ETag", first_response.headers)
        
        etag = first_response.headers["ETag"]
        original_content = first_response.content

        # 2. Second request with If-None-Match: Expect 304
        second_response = self.client.get(
            self.url,
            HTTP_IF_NONE_MATCH=etag
        )
        self.assertEqual(second_response.status_code, status.HTTP_304_NOT_MODIFIED)
        self.assertEqual(second_response.content, b'')

        # 3. Third request: Data change invalidates ETag, expect 200
        self.active_mood.name = "Surprised (Updated)"
        self.active_mood.save()
        
        third_response = self.client.get(
            self.url,
            HTTP_IF_NONE_MATCH=etag
        )
        self.assertEqual(third_response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(third_response.content, original_content)
        self.assertIn("ETag", third_response.headers)

    def test_admin_access_requires_authentication(self):
        """
        Ensure that unauthenticated users cannot access /admin/ (should redirect to login)
        """
        response = self.client.get("/admin/")
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertIn("/admin/login/", response.url)

    def test_superuser_can_login_and_see_mood_model(self):
        """
        Create a superuser, log in via the test client,
        and verify the Mood model is listed on the admin index.
        """
        from django.contrib.auth import get_user_model

        User = get_user_model()
        
        # FIX 2: Corrected create_superuser arguments
        superuser = User.objects.create_superuser(
            "admin@example.com", # Email positionally
            "pass1234",          # Password positionally
            username="admin"     # Pass Username by keyword (if needed)
        )
        
        # 🟢 FINAL FIX 3: Log in using the email address as the username 
        # (assuming email is the USERNAME_FIELD).
        self.client.login(username="admin@example.com", password="pass1234")

        # FIX 4: Add follow=True to handle the redirect after successful login
        response = self.client.get("/admin/", follow=True)
        
        # Check the final status code after the redirect chain
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "Moods")

        # Fetch mood changelist
        response = self.client.get("/admin/moods/mood/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "Select mood to change")