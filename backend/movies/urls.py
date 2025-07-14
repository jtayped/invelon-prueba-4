# movies/urls.py

from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import (
    MovieListView,
    MovieDetailView,
    MovieCreateView,
    MovieUpdateView,
    MovieDeleteView,
    SessionViewSet,
)

router = SimpleRouter()
router.register(r"sessions", SessionViewSet, basename="session")

urlpatterns = [
    path("", MovieListView.as_view(), name="movie-list"),
    path("<int:pk>/", MovieDetailView.as_view(), name="movie-detail"),
    path("create/", MovieCreateView.as_view(), name="movie-create"),
    path("<int:pk>/edit/", MovieUpdateView.as_view(), name="movie-update"),
    path("<int:pk>/delete/", MovieDeleteView.as_view(), name="movie-delete"),
]

urlpatterns += router.urls
