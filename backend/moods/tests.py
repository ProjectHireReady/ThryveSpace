from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from moods.models import Mood, MoodCategory
from django.contrib.auth import get_user_model
from django.test import override_settings # <--- NEW IMPORT
import uuid
import json


class MoodAPITests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # 1. Setup Required Foreign Key Objects (MoodCategory)
        cls.category_neutral = MoodCategory.objects.create(
            value="neutral", 
            label="Neutral", 
            icon="https://test.cloudinary.com/neutral.svg"
        )
        cls.category_negative = MoodCategory.objects.create(
            value="negative", 
            label="Negative", 
            icon="https://test.cloudinary.com/negative.svg"
        )
        
        cls.initial_count = Mood.objects.count()
        
        # 2. Setup Moods using correct model fields and FK instances
        cls.active_mood = Mood.objects.create(
            id=uuid.uuid4(),
            name="Surprised",
            emoji_char="😮",           
            icon="https://active.svg", 
            category=cls.category_neutral,  
            is_active=True,
        )
        cls.inactive_mood = Mood.objects.create(
            id=uuid.uuid4(),
            name="Angry",
            emoji_char="😠",           
            icon="https://test.cloudinary.com/angry.svg", 
            category=cls.category_negative, 
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
        
        self.assertIsInstance(data, dict)
        self.assertIn("categories", data)
        self.assertIn("moods", data)

        moods_list = data["moods"]
        self.assertEqual(len(moods_list), self.initial_count + 1)
        
        mood_names = [mood['name'] for mood in moods_list]
        self.assertIn(self.active_mood.name, mood_names)
        self.assertNotIn(self.inactive_mood.name, mood_names)
        
        active_mood_data = next(
            (m for m in moods_list if m['name'] == self.active_mood.name), 
            None
        )

        self.assertIsNotNone(active_mood_data)
        self.assertEqual(active_mood_data["icon"], self.active_mood.icon) 
        self.assertEqual(active_mood_data["emoji"], self.active_mood.emoji_char) 
        self.assertEqual(active_mood_data["category"], self.active_mood.category.value)

    # 🟢 FINAL FIX: Use @override_settings to ensure only essential middleware is active
    @override_settings(MIDDLEWARE=[
        'django.middleware.security.SecurityMiddleware',
        'django.middleware.common.CommonMiddleware',
    ])
    def test_endpoint_caching_etag_304(self):
        """
        Tests ETag generation and 304 Not Modified response using If-None-Match header.
        """
        # Ensure client is logged out, although @override_settings should cover this now.
        self.client.logout()

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
        # This is the assertion that must pass now
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
        User = get_user_model()
        
        superuser = User.objects.create_superuser(
            "admin@example.com", 
            "pass1234",          
            username="admin"     
        )
        
        self.client.login(username="admin@example.com", password="pass1234")

        response = self.client.get("/admin/", follow=True)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "Moods")

        response = self.client.get("/admin/moods/mood/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "Select mood to change")