from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = "Create a new user with is_admin=True"

    def add_arguments(self, parser):
        parser.add_argument(
            "--username", "-u", required=True, help="Username for the new user"
        )
        parser.add_argument(
            "--email", "-e", required=True, help="Email address for the new user"
        )
        parser.add_argument(
            "--password", "-p", required=True, help="Password for the new user"
        )

    def handle(self, *args, **options):
        username = options["username"]
        email = options["email"]
        password = options["password"]

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.ERROR(f'User "{username}" already exists.'))
            return

        # Create the user (adjust for your UserManager API if different)
        user = User.objects.create_user(username=username, email=email, password=password)

        # Set your admin flag (and, if you want, staff/superuser for Django admin access)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save()

        self.stdout.write(self.style.SUCCESS(f'Admin user "{username}" created successfully.'))
