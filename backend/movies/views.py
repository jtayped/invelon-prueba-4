from rest_framework import viewsets, filters, generics, permissions, status
from .models import Movie, Session
from screens.models import Seat
from tickets.models import Ticket
from tickets.serializers import TicketSerializer
from .serializers import MovieSerializer, SessionSerializer
from backend.permissions import IsAdmin
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction


class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [permissions.AllowAny]


class MovieDetailView(generics.RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [permissions.AllowAny]


class MovieCreateView(generics.CreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdmin]


class MovieUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdmin]


class MovieDeleteView(generics.DestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdmin]


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    # default: only admins get the standard endpoints
    permission_classes = [IsAdmin]

    @action(
        detail=True,
        methods=["post"],
        url_path="buy",
        permission_classes=[permissions.IsAuthenticated],
    )
    def buy(self, request, pk=None):
        """
        POST /api/sessions/{pk}/buy/
        Body: { "seat_ids": [1, 2, 3] }
        """
        session = self.get_object()
        seat_ids = request.data.get("seat_ids")
        if not isinstance(seat_ids, list) or not seat_ids:
            return Response(
                {"detail": "You must provide a non-empty list of seat_ids."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 1) Fetch & validate seats belong to this session's screen
        seats = Seat.objects.filter(id__in=seat_ids, screen=session.screen)
        if seats.count() != len(seat_ids):
            return Response(
                {"detail": "One or more seat_ids are invalid for this screen."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2) Check for existing tickets
        already = Ticket.objects.filter(session=session, seat__in=seats).values_list(
            "seat_id", flat=True
        )
        if already:
            return Response(
                {"detail": f"Seats already booked: {list(already)}"},
                status=status.HTTP_409_CONFLICT,
            )

        # 3) Create tickets atomically
        tickets_to_create = [
            Ticket(
                session=session,
                movie=session.movie,
                seat=seat,
                user=request.user,
                price=session.price,
            )
            for seat in seats
        ]
        with transaction.atomic():
            Ticket.objects.bulk_create(tickets_to_create)

        # 4) Serialize & return
        serializer = TicketSerializer(
            tickets_to_create, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
