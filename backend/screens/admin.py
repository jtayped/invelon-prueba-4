from django.contrib import admin
from .models import Screen, Seat


class SeatInline(admin.TabularInline):
    model = Seat
    fields = ("label", "row", "number")
    readonly_fields = ("label", "row", "number")
    extra = 0
    can_delete = False
    show_change_link = True


@admin.register(Screen)
class ScreenAdmin(admin.ModelAdmin):
    list_display = ("name", "rows", "seats_per_row", "total_seats")
    search_fields = ("name",)
    ordering = ("name",)
    inlines = [SeatInline]
    actions = ["create_seats_action"]

    def create_seats_action(self, request, queryset):
        """
        Admin action to call Screen.create_seats() for selected Screen(s).
        """
        created = 0
        for screen in queryset:
            screen.create_seats()
            created += 1
        self.message_user(
            request,
            f"Created seats for {created} screen{'s' if created != 1 else ''}.",
        )

    create_seats_action.short_description = "Populate seats for selected screens"


@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ("screen", "label", "row", "number")
    list_filter = ("screen",)
    search_fields = ("label",)
    ordering = ("screen__name", "row", "number")
