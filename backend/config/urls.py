from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from django.views.generic import RedirectView
from django.views.static import serve

from bookings import views as booking_views
from driver_requests import views as driver_request_views
from vehicles import views as vehicle_views
from corporate_requests import views as corporate_requests_views
from blogs import views as blog_views
from contact_messages import views as contact_message_views
from site_settings import views as site_settings_views
from testimonials import views as testimonial_views
from destinations import views as destination_views
from config.views import custom_404

handler404 = 'config.views.custom_404'

urlpatterns = [
    # PUBLIC APIs
    path('api/vehicles/', vehicle_views.vehicle_api, name='vehicle_api'),
    path('api/bookings/', booking_views.create_booking, name='create_booking'),
    path('api/driver-requests/', driver_request_views.create_driver_request, name='create_driver_request'),
    path('api/corporate-requests/', corporate_requests_views.create_corporate_request, name='create_corporate_request'),
    path('api/blogs/', blog_views.blog_api, name='blog_api'),
    path('api/contact-messages/', contact_message_views.create_contact_message, name='create_contact_message'),
    path('api/site-settings/', site_settings_views.settings_api),
    path('api/testimonials/', testimonial_views.testimonial_api),
    path('api/destinations/', destination_views.destination_api),

    # CUSTOM DASHBOARD
    path('dashboard/vehicles/', include('vehicles.urls')),
    path('dashboard/bookings/', include('bookings.urls')),
    path('dashboard/driver-requests/', include('driver_requests.urls')),
    path('dashboard/corporate-requests/', include('corporate_requests.urls')),
    path('dashboard/blogs/', include('blogs.urls')),
    path('dashboard/contact-messages/', include('contact_messages.urls')),
    path('dashboard/settings/', include('site_settings.urls')),
    path('dashboard/testimonials/', include('testimonials.urls')),
    path('dashboard/destinations/', include('destinations.urls')),
    path('dashboard/', include('dashboard.urls')),
]

if settings.DEBUG:
    FRONTEND_DIR = settings.BASE_DIR.parent

    urlpatterns += [
        # FRONTEND PAGES
        path('', serve, {'document_root': FRONTEND_DIR, 'path': 'index.html'}),
        path('index.html', RedirectView.as_view(url='/', permanent=False)),
        path('about.html', serve, {'document_root': FRONTEND_DIR, 'path': 'about.html'}),
        path('contact.html', serve, {'document_root': FRONTEND_DIR, 'path': 'contact.html'}),
        path('corporate.html', serve, {'document_root': FRONTEND_DIR, 'path': 'corporate.html'}),
        path('hire-driver.html', serve, {'document_root': FRONTEND_DIR, 'path': 'hire-driver.html'}),
        path('blog.html', serve, {'document_root': FRONTEND_DIR, 'path': 'blog.html'}),
        path('blog-detail.html', serve, {'document_root': FRONTEND_DIR, 'path': 'blog-detail.html'}),

        # FRONTEND ASSETS
        path('css/<path:path>', serve, {'document_root': FRONTEND_DIR / 'css'}),
        path('js/<path:path>', serve, {'document_root': FRONTEND_DIR / 'js'}),
        path('images/<path:path>', serve, {'document_root': FRONTEND_DIR / 'images'}),
        path('components/<path:path>', serve, {'document_root': FRONTEND_DIR / 'components'}),
    ]

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    # LOCAL CUSTOM 404 — ALWAYS LAST
    urlpatterns += [
        path('<path:path>', custom_404),
    ]