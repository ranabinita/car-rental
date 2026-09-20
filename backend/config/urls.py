from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from django.views.generic import RedirectView

from bookings import views as booking_views
from driver_requests import views as driver_request_views
from vehicles import views as vehicle_views


urlpatterns = [
    path('',RedirectView.as_view(pattern_name='dashboard:home',permanent=False)),
    # PUBLIC APIs
    path('api/vehicles/',vehicle_views.vehicle_api,name='vehicle_api'),
    path('api/bookings/',booking_views.create_booking,name='create_booking'),
    path('api/driver-requests/',driver_request_views.create_driver_request,name='create_driver_request'),
    # CUSTOM BACKEND
    path('backend/vehicles/',include('vehicles.urls')),
    path('backend/bookings/',include('bookings.urls')),
    path('backend/driver-requests/',include('driver_requests.urls')),
    path('backend/',include('dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)