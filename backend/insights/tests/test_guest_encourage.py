from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse


class GuestEncourageTests(APITestCase):
    def test_guest_encourage_returns_prompt_version(self):
        url = reverse("guest_encourage")  
        payload = {
            "note": "I'm feeling anxious.",
            "fingerprint": "test-guest-1234"
        }

        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("prompt_version", response.data)
        self.assertEqual(response.data["prompt_version"], "v1")
