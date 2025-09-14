# backend/contact/throttles.py
from rest_framework.throttling import SimpleRateThrottle

class ContactUserOrIPThrottle(SimpleRateThrottle):
    scope = "contact"

    def get_cache_key(self, request, view):
        # Authenticated → throttle by user id
        if request.user and request.user.is_authenticated:
            ident = f"user:{request.user.pk}"
        else:
            # Anonymous → throttle by IP (consider X-Forwarded-For if behind proxy)
            xff = request.META.get("HTTP_X_FORWARDED_FOR")
            ip = (xff.split(",")[0].strip() if xff else request.META.get("REMOTE_ADDR"))
            ident = f"ip:{ip or 'unknown'}"
        return self.cache_format % {
            "scope": self.scope,
            "ident": ident
        }
