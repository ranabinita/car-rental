from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from django.views.generic import RedirectView

from bookings import views as booking_views
from driver_requests import views as driver_request_views
from vehicles import views as vehicle_views
from corporate_requests import views as corporate_requests_views
from blogs import views as blog_views
from contact_messages import views as contact_message_views


urlpatterns = [
    path('',RedirectView.as_view(pattern_name='dashboard:home',permanent=False)),
    # PUBLIC APIs
    path('api/vehicles/',vehicle_views.vehicle_api,name='vehicle_api'),
    path('api/bookings/',booking_views.create_booking,name='create_booking'),
    path('api/driver-requests/',driver_request_views.create_driver_request,name='create_driver_request'),
    path('api/corporate-requests/',corporate_requests_views.create_corporate_request,name='create_corporate_request'),
    path('api/blogs/', blog_views.blog_api, name='blog_api'),
    path('api/contact-messages/', contact_message_views.create_contact_message, name='create_contact_message'),
    # CUSTOM BACKEND
    path('backend/vehicles/',include('vehicles.urls')),
    path('backend/bookings/',include('bookings.urls')),
    path('backend/driver-requests/',include('driver_requests.urls')),
    path('backend/',include('dashboard.urls')),
    path('backend/corporate-requests/',include('corporate_requests.urls')),
    path('backend/blogs/', include('blogs.urls')),
    path('backend/contact-messages/', include('contact_messages.urls')),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)