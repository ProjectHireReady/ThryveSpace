# backend/contact/views.py
import logging
from django.conf import settings
from django.core.mail import EmailMessage, get_connection
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .serializers import ContactSerializer
from .throttles import ContactUserOrIPThrottle

logger = logging.getLogger(__name__)

class ContactView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ContactUserOrIPThrottle]

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"ok": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        subject = f"[ThryveSpace] Contact form: {data['name']}"
        body = (
            "New contact form submission\n\n"
            f"Name: {data['name']}\n"
            f"Email: {data['email']}\n\n"
            "Message:\n"
            f"{data['message']}\n"
        )

        to_email = getattr(settings, "CONTACT_INBOX", "hello@thryvespace.com")
        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@thryvespace.com")

        try:
            connection = get_connection()  # uses EMAIL_* settings
            msg = EmailMessage(
                subject=subject,
                body=body,
                from_email=from_email,
                to=[to_email],
                reply_to=[data["email"]],  # important
                connection=connection,
            )
            msg.send(fail_silently=False)
            return Response({"ok": True, "message": "Thanks for reaching out! We’ve received your message."})
        except Exception as e:
            logger.exception("Contact form send failed: %s", e)
            return Response(
                {"ok": False, "message": "Failed to send message. Please try again later."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
