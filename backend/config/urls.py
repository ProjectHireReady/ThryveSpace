"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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

from django.contrib import admin
from django.urls import path, include
from notes.views import NoteMigrationAPIView
from rest_framework.authtoken.views import obtain_auth_token
from notes.views import NoteMigrationAPIView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/moods/", include("moods.urls")),
    path("api/v1/notes/", include("notes.urls")),
    path("api/v1/auth/", include("users.urls")),
    path("api/v1/insights/", include("insights.urls")),
    path('api/v1/notes/migrate/', NoteMigrationAPIView.as_view(), name='notes-migrate'),
    path("django-rq/", include("django_rq.urls")),
    path("messages/", include("kindness.urls")),
]
