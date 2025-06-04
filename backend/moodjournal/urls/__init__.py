from django.urls import path

urlpatterns = []

from django.urls import path, include

urlpatterns = [
    path('notes/', include('moodjournal.notes.urls')),
]