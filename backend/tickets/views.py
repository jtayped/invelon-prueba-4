from django.shortcuts import render
from .models import Ticket
from .serializers import TicketSerializer
from rest_framework import viewsets, permissions


# Create your views here.
class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [permissions.AllowAny]  # tighten later

    def get_queryset(self):
        return (
            Ticket.objects.filter(user=self.request.user)
            if self.request.user.is_authenticated
            else Ticket.objects.none()
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status=Ticket.Status.PURCHASED)
