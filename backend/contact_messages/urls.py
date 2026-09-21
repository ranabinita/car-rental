from django.urls import path
from . import views

app_name = 'contact_messages'

urlpatterns = [
    path('', views.message_list, name='list'),
    path('<int:pk>/', views.message_detail, name='detail'),
    path('<int:pk>/read/', views.message_read, name='read'),
    path('<int:pk>/resolve/', views.message_resolve, name='resolve'),
    path('<int:pk>/delete/', views.message_delete, name='delete'),
]