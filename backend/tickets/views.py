# tickets/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.permissions import IsAdmin
from .models import Ticket
from .serializers import TicketSerializer


class TicketViewSet(viewsets.ModelViewSet):
    """
    - GET /tickets/           → all tickets (admin only)
    - GET /tickets/{pk}/      → retrieve any ticket (admin only)
    - POST/PUT/DELETE /tickets/ → admin only
    - GET /tickets/my/        → your tickets (any authenticated user)
    """

    queryset = Ticket.objects.select_related("session", "session__movie", "seat")
    serializer_class = TicketSerializer
    permission_classes = [IsAdmin]  # default: only admins can use standard actions

    @action(
        detail=False,
        methods=["get"],
        url_path="my",
        permission_classes=[IsAuthenticated],  # override: any logged-in user
    )
    def my(self, request):
        """
        GET /tickets/my/
        Return *all* tickets belonging to the current user.
        """
        qs = self.queryset.filter(user=request.user)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
