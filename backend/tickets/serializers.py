from rest_framework import serializers
from .models import Ticket
from movies.serializers import SessionSerializer, MovieSerializer
from screens.serializers import SeatSerializer
from users.serializers import UserSerializer


class TicketSerializer(serializers.ModelSerializer):
    # automatically set from request.user, not passed in by client
    user = UserSerializer(read_only=True)
    session = SessionSerializer(read_only=True)
    movie = MovieSerializer(read_only=True)
    seat = SeatSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = (
            "id",
            "session",
            "seat",
            "price",
            "purchased_at",
            "user",
            "movie",
            "user",
        )
        read_only_fields = ("purchased_at",)

    def validate(self, data):
        if Ticket.objects.filter(session=data["session"], seat=data["seat"]).exists():
            raise serializers.ValidationError("Seat already taken.")
        return data
