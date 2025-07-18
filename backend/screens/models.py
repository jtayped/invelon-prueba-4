from django.db import models

class Screen(models.Model):
    name = models.CharField(max_length=50, unique=True)
    # Optional: simple grid layout
    rows = models.PositiveSmallIntegerField(
        help_text="Number of rows (e.g. A–Z → 26 rows)"
    )
    seats_per_row = models.PositiveSmallIntegerField(
        help_text="Seats in each row (e.g. 20)"
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    def total_seats(self) -> int:
        return self.rows * self.seats_per_row

    def create_seats(self):
        """
        Call this once (e.g. in a migration or admin action) to populate
        Seat objects for this screen.
        """
        from .models import Seat

        # Rows A, B, C... → 1→'A', 2→'B', etc.
        for row_num in range(1, self.rows + 1):
            row_letter = chr(64 + row_num)
            for seat_num in range(1, self.seats_per_row + 1):
                label = f"{row_letter}-{seat_num}"
                Seat.objects.get_or_create(
                    screen=self, row=row_num, number=seat_num, label=label
                )


class Seat(models.Model):
    screen = models.ForeignKey(Screen, related_name="seats", on_delete=models.CASCADE)
    row = models.PositiveSmallIntegerField()
    number = models.PositiveSmallIntegerField()
    label = models.CharField(
        max_length=5,
        help_text="E.g. 'B-12'; automatically generated by Screen.create_seats()",
    )

    class Meta:
        unique_together = ("screen", "label")
        ordering = ["screen", "row", "number"]

    def __str__(self):
        return f"{self.screen.name} {self.label}"
