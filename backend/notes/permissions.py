from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.user.is_authenticated:
            return obj.user == request.user

        # TODO: Handle guest UUIDs here.
        # This requires a 'guest_uuid' field on the Note model
        # and a mechanism to identify guests (e.g., via session or custom header).
        return False