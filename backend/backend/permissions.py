# movies/permissions.py
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):

    def has_permission(self, request, view):
        # SAFE_METHODS = GET, HEAD, OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True

        # For writes, require both authentication and your custom is_admin flag
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "is_admin", False))
