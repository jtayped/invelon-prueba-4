from django.db import models

# Create your models here.
from django.conf import settings
from apps.movies.models import Session


class Ticket(models.Model):
    class Status(models.TextChoices):
        RESERVED = "reserved"
        PURCHASED = "purchased"

    session = models.ForeignKey(
        Session, related_name="tickets", on_delete=models.CASCADE
    )
    seat_number = models.CharField(max_length=5)  # “B-12”
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.RESERVED
    )
    price = models.DecimalField(max_digits=6, decimal_places=2, default=9.99)
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("session", "seat_number")  # no double-booking

    def __str__(self):
        return f"{self.session} — {self.seat_number}"
