from rest_framework import viewsets, filters, status
from .models import Screen, Seat
from tickets.models import Ticket
from .serializers import ScreenSerializer
from django.shortcuts import get_object_or_404
from movies.models import Session
from backend.permissions import IsAdmin
from rest_framework.response import Response
from django.db.models import Exists, OuterRef


class ScreenViewSet(viewsets.ModelViewSet):
    queryset = Screen.objects.all().order_by("name")
    serializer_class = ScreenSerializer
    permission_classes = [IsAdmin]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["name", "rows"]

    def retrieve(self, request, *args, **kwargs):
        screen = self.get_object()

        session_id = request.query_params.get("session_id")
        if session_id is not None:
            # 1. Fetch session or 404
            session = get_object_or_404(Session, pk=session_id)

            # 2. Annotate every seat with occupied=True/False
            seats = (
                Seat.objects.filter(screen=screen)
                .annotate(
                    occupied=Exists(
                        Ticket.objects.filter(session=session, seat=OuterRef("pk"))
                    )
                )
                .order_by("row", "number")
                .values("id", "row", "number", "occupied")
            )

            # 3. Return payload
            return Response(
                {
                    "id": screen.id,
                    "name": screen.name,
                    "rows": screen.rows,
                    "seats_per_row": screen.seats_per_row,
                    "seats": list(seats),
                },
                status=status.HTTP_200_OK,
            )

        # No session_id → default ScreenSerializer
        serializer = self.get_serializer(
            screen, context={**self.get_serializer_context(), "session": None}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
