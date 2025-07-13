from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = "username"

    def __str__(self):
        return self.email
