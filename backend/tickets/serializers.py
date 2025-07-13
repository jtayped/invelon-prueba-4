from rest_framework import serializers
from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = "__all__"
        read_only_fields = ("status", "purchased_at")

    def validate(self, data):
        if Ticket.objects.filter(
            session=data["session"], seat_number=data["seat_number"]
        ).exists():
            raise serializers.ValidationError("Seat already taken.")
        return data
