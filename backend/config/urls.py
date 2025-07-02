from django.contrib import admin
from django.urls import path, include

# Import spectacular views
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/moods/', include('moods.urls')),
    path('api/v1/notes/', include('notes.urls')),
    path('api/v1/auth/', include('users.urls')),

    # API schema generation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Swagger UI and ReDoc views
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]