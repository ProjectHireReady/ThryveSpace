# backend/contact/throttles.py
from ipware import get_client_ip
from rest_framework.throttling import SimpleRateThrottle


class ContactUserOrIPThrottle(SimpleRateThrottle):
    scope = "contact"

    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            ident = f"user:{request.user.pk}"
        else:
            # Use django-ipware to get IP safely
            client_ip, _ = get_client_ip(request)
            ident = f"ip:{client_ip or 'unknown'}"

        return self.cache_format % {"scope": self.scope, "ident": ident}
