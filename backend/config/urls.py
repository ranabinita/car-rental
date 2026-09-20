from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.views.generic import RedirectView
from vehicles import views as vehicle_views
from bookings import views as booking_views

urlpatterns = [
    path('', RedirectView.as_view(
        pattern_name='dashboard:home',
        permanent=False
    )),
    path('api/vehicles/', vehicle_views.vehicle_api, name='vehicle_api'),
    path('api/bookings/', booking_views.create_booking, name='create_booking'),
    path('backend/vehicles/', include('vehicles.urls')),
    path('backend/bookings/', include('bookings.urls')),
    path('backend/', include('dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )