from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token

User = get_user_model()


class MeEndpointTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="strongpassword123",
            first_name="Old",
            last_name="Name",
        )
        self.token = Token.objects.create(user=self.user)
        self.url = reverse("user_me")

    def authenticate(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_requires_authentication(self):
        """Guests should be denied access"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_profile(self):
        """Authenticated user should retrieve their profile"""
        self.authenticate()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["first_name"], "Old")
        self.assertEqual(response.data["last_name"], "Name")
        self.assertIn("id", response.data)

    def test_update_profile_valid(self):
        """User can update first and last name"""
        self.authenticate()
        payload = {"first_name": "New", "last_name": "Person"}
        response = self.client.put(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "New")
        self.assertEqual(self.user.last_name, "Person")

    def test_partial_update_profile(self):
        """PATCH should allow updating only one field"""
        self.authenticate()
        payload = {"first_name": "Partial"}
        response = self.client.patch(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Partial")
        self.assertEqual(self.user.last_name, "Name")  # unchanged

    def test_invalid_fields_rejected(self):
        """Ensure unexpected fields raise validation error"""
        self.authenticate()
        payload = {"email": "hacker@example.com"}  # not updatable here
        response = self.client.patch(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
