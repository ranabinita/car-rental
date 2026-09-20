from django.urls import path
from . import views

app_name = 'blogs'

urlpatterns = [
    path('', views.blog_list, name='list'),
    path('add/', views.blog_add, name='add'),
    path('<int:pk>/', views.blog_detail, name='detail'),
    path('<int:pk>/edit/', views.blog_edit, name='edit'),
    path('<int:pk>/delete/', views.blog_delete, name='delete'),
]