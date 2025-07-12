from django.db import models


# Create your models here.
class Movie(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    duration_min = models.PositiveSmallIntegerField()  # runtime
    rating = models.CharField(max_length=5, blank=True)  # e.g. “PG-13”
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Session(models.Model):
    movie = models.ForeignKey(Movie, related_name="sessions", on_delete=models.CASCADE)
    starts_at = models.DateTimeField()
    screen = models.PositiveSmallIntegerField()
    seats_total = models.PositiveSmallIntegerField(default=100)

    class Meta:
        ordering = ["starts_at"]
        indexes = [models.Index(fields=["starts_at"])]

    def __str__(self):
        return f"{self.movie} — {self.starts_at:%d %b %H:%M}"
