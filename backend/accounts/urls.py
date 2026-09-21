from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('csrf/', views.csrf_token, name='csrf'),
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('me/', views.current_user, name='me'),
]