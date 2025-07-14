from rest_framework import serializers
from django.db.models import Exists, OuterRef
from .models import Screen, Seat
from tickets.models import Ticket


class ScreenSerializer(serializers.ModelSerializer):
    seats = serializers.SerializerMethodField()

    class Meta:
        model = Screen
        fields = ("id", "name", "rows", "seats_per_row", "seats")

    def get_seats(self, screen):
        # pull the Session instance from context (we’ll inject it below)
        session = self.context.get("session")
        qs = screen.seats.all().order_by("row", "number")

        if session:
            # annotate each seat with occupied=True/False
            qs = qs.annotate(
                occupied=Exists(
                    Ticket.objects.filter(session=session, seat=OuterRef("pk"))
                )
            )
        else:
            # if no session, default to False
            qs = qs.annotate(occupied=Exists(Ticket.objects.none()))

        return SeatAvailabilitySerializer(qs, many=True).data


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ("row", "number", "label")


class SeatAvailabilitySerializer(serializers.ModelSerializer):
    occupied = serializers.BooleanField(read_only=True)

    class Meta:
        model = Seat
        fields = ("row", "number", "label", "occupied")
