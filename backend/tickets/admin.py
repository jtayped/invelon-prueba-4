from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "session",
        "movie",
        "seat",
        "user",
        "price",
        "purchased_at",
    )
    list_filter = (
        "session",
        "movie",
        "user",
        "purchased_at",
    )
    search_fields = (
        "session__movie__title",
        "session__id",
        "seat__label",
        "user__username",
        "user__email",
    )
    ordering = ("-purchased_at",)
    date_hierarchy = "purchased_at"
    raw_id_fields = (
        "session",
        "movie",
        "seat",
        "user",
    )
