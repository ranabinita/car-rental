from django.urls import path
from . import views

app_name = 'destinations'

urlpatterns = [
    path('', views.destination_list, name='list'),
    path('add/', views.destination_add, name='add'),
    path('<int:pk>/', views.destination_detail, name='detail'),
    path('<int:pk>/edit/', views.destination_edit, name='edit'),
    path('<int:pk>/delete/', views.destination_delete, name='delete'),
]