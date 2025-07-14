import secrets
from django.db import models, IntegrityError


def _rand32():
    return secrets.randbelow(2**31 - 1) + 1


class RandomAutoField(models.AutoField):
    """
    An AutoField that, instead of a sequence, picks a random 32-bit int
    on save(). Retries on collision up to 5 times.
    """

    description = "Random 32-bit integer primary key"

    def pre_save(self, model_instance, add):
        # only on creation, and only if no PK was manually set
        if add and getattr(model_instance, self.attname) is None:
            for _ in range(5):
                val = _rand32()
                setattr(model_instance, self.attname, val)
                try:
                    # this will attempt to INSERT with our chosen PK
                    return super().pre_save(model_instance, add)
                except IntegrityError:
                    # collision → try again
                    setattr(model_instance, self.attname, None)
            raise IntegrityError(
                "Could not generate a unique random 32-bit PK after 5 tries"
            )
        return super().pre_save(model_instance, add)
