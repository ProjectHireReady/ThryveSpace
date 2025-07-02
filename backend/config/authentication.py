from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import exceptions

class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication that is exempt from CSRF checks.
    Used for API endpoints where CSRF token isn't provided by clients (e.g., Postman).
    """
    def enforce_csrf(self, request):
        return  # To not enforce CSRF for API clients
