from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('login/', views.backend_login, name='login'),
    path('logout/', views.backend_logout, name='logout'),
    path('', views.dashboard_home, name='home'),
]