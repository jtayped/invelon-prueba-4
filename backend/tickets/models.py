from django.db import models
from django.conf import settings
from movies.models import Session, Movie
from screens.models import Seat
from backend.settings import AUTH_USER_MODEL


class Ticket(models.Model):
    movie = models.ForeignKey(
        Movie, related_name="movie", on_delete=models.CASCADE
    )
    session = models.ForeignKey(
        Session, related_name="tickets", on_delete=models.CASCADE
    )
    seat = models.ForeignKey(Seat, related_name="tickets", on_delete=models.PROTECT)
    user = models.ForeignKey(
        AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    price = models.DecimalField(max_digits=6, decimal_places=2, default=9.99)
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("session", "seat")

    def __str__(self):
        return f"{self.session} — {self.seat.label}"
