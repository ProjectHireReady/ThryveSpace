from django.contrib import admin
from .models import Mood

@admin.register(Mood)
class MoodAdmin(admin.ModelAdmin):
    """
    Admin interface for managing moods.
    """
    list_display = ('id', 'name', 'emoji', 'category', 'is_active')
    search_fields = ('name', 'category')
    list_filter = ('category', 'is_active')
    ordering = ('-id',)
