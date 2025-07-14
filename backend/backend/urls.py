"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from rest_framework.routers import DefaultRouter
from movies.views import SessionViewSet
from tickets.views import TicketViewSet
from screens.views import ScreenViewSet
from django.urls import path, include
from django.contrib import admin

router = DefaultRouter()
router.register(r"tickets", TicketViewSet, basename="ticket")
router.register(r"screens", ScreenViewSet, basename="screen")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/auth/", include("users.urls")),
    path("api/movies/", include("movies.urls")),
    path("admin/", admin.site.urls),
]
