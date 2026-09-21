from django.urls import path
from . import views

app_name = 'testimonials'

urlpatterns = [
    path('', views.testimonial_list, name='list'),
    path('add/', views.testimonial_add, name='add'),
    path('<int:pk>/edit/', views.testimonial_edit, name='edit'),
    path('<int:pk>/delete/', views.testimonial_delete, name='delete'),
    path('<int:pk>/', views.testimonial_detail, name='detail'),
]