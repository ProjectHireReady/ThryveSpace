from django.contrib import admin
from .models import Insight

# Register your models here.


@admin.register(Insight)
class InsightAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "type", "created_at")
    list_filter = ("type", "created_at")
    search_fields = ("user__email", "content")
    ordering = ("-created_at",)
