# backend/contact/throttles.py
from rest_framework.throttling import SimpleRateThrottle

class ContactUserOrIPThrottle(SimpleRateThrottle):
    scope = "contact"

    def get_cache_key(self, request, view):
        # Authenticated → throttle by user id
        if request.user and request.user.is_authenticated:
            ident = f"user:{request.user.pk}"
        else:
            # Only trust REMOTE_ADDR (not X-Forwarded-For) to avoid spoofing
            ip = request.META.get("REMOTE_ADDR")
            ident = f"ip:{ip or 'unknown'}"
        return self.cache_format % {
            "scope": self.scope,
            "ident": ident
        }
