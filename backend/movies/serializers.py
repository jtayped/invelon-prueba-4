from rest_framework import serializers
from .models import Movie, Session
from screens.serializers import ScreenSerializer
from screens.models import Screen


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = "__all__"


class SessionSerializer(serializers.ModelSerializer):
    movie = serializers.PrimaryKeyRelatedField(queryset=Movie.objects.all())
    screen = serializers.PrimaryKeyRelatedField(queryset=Screen.objects.all())

    class Meta:
        model = Session
        fields = ["id", "movie", "screen", "starts_at", "price"]

    def create(self, validated_data):
        return super().create(validated_data)
