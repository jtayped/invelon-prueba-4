from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters
from .models import Movie, Session
from .serializers import MovieSerializer, SessionSerializer


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.filter(active=True)
    serializer_class = MovieSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title"]


class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SessionSerializer
    filter_backends = [filters.OrderingFilter]
    ordering = ["starts_at"]

    def get_queryset(self):
        qs = Session.objects.select_related("movie")
        movie_id = self.request.query_params.get("movie")
        return qs.filter(movie_id=movie_id) if movie_id else qs
