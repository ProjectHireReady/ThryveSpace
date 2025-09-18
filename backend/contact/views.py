# backend/contact/views.py

import logging
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, get_connection
from django.utils.html import escape  # ✅ Protect against XSS
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

        # ✅ Escape all user input for HTML safety
        escaped_name = escape(data["name"])
        escaped_email = escape(data["email"])
        escaped_message = escape(data["message"]).replace("\n", "<br>")

        subject = f"[ThryveSpace] Contact form: {escaped_name}"
        body = (
            "New contact form submission\n\n"
            f"Name: {data['name']}\n"
            f"Email: {data['email']}\n\n"
            "Message:\n"
            f"{data['message']}\n"
        )

        html_body = f"""
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {escaped_name}</p>
        <p><strong>Email:</strong> {escaped_email}</p>
        <p><strong>Message:</strong></p>
        <p>{escaped_message}</p>
        """

        to_email = getattr(settings, "CONTACT_INBOX", "hello@thryvespace.com")
        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@thryvespace.com")

        try:
            connection = get_connection()  # Uses Django's EMAIL_* settings
            msg = EmailMultiAlternatives(
                subject=subject,
                body=body,  # Plain text version (can be raw)
                from_email=from_email,
                to=[to_email],
                reply_to=[data["email"]],
                connection=connection,
            )
            msg.attach_alternative(html_body, "text/html")
            msg.send(fail_silently=False)

            return Response({
                "ok": True,
                "message": "Thanks for reaching out! We’ve received your message."
            })
        except Exception as e:
            logger.exception("❌ Contact form send failed: %s", e)
            return Response(
                {"ok": False, "message": "Failed to send message. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
