from django.urls import path
from . import views

app_name = 'bookings'

urlpatterns = [
    path('', views.booking_list, name='list'),
    path('<int:pk>/', views.booking_detail, name='detail'),
    path('<int:pk>/confirm/', views.booking_confirm, name='confirm'),
    path('<int:pk>/complete/', views.booking_complete, name='complete'),
    path('<int:pk>/cancel/', views.booking_cancel, name='cancel'),
]