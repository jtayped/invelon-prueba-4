from django.contrib import admin
from movies.models import Movie, Session
from tickets.models import Ticket


# Register your models here.
@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ("title", "duration_min", "active")
    list_filter = ("active",)


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ("movie", "starts_at", "screen")
    list_filter = ("screen", "starts_at")


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("session", "seat_number", "status", "user")
    list_filter = ("status", "session__movie")
    search_fields = ("user__username", "seat_number")
