from django.apps import AppConfig


class InsightsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "insights"

    def ready(self):
        # Import signal handlers
        from . import signals  # noqa: F401
