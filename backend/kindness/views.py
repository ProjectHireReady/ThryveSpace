# kindness/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from django.utils import timezone
from .services import get_kindness_message

try:
    # Use real service if present
    from .services import get_kindness_message
except ImportError:
    # Fallback until services.py exists: always return no_message
    def get_kindness_message(user):
        return None, "not_implemented"


class KindnessMessageView(APIView):
    authentication_classes = [TokenAuthentication]  
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        msg, reason = get_kindness_message(request.user)
        if msg is None:
            return Response({"no_message": True, "reason": reason})
        return Response(
            {
                "message": msg,
                "meta": {"source": "rule_based", "last_sent_at": timezone.now().isoformat()},
            }
        )
