from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Screen


@receiver(post_save, sender=Screen)
def make_seats_on_create(sender, instance: Screen, created: bool, **kwargs):
    if created:
        instance.create_seats()
