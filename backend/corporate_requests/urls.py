from django.urls import path
from . import views

app_name = 'corporate_requests'

urlpatterns = [
    path('', views.request_list, name='list'),
    path('<int:pk>/', views.request_detail, name='detail'),
    path('<int:pk>/confirm/', views.request_confirm, name='confirm'),
    path('<int:pk>/complete/', views.request_complete, name='complete'),
    path('<int:pk>/cancel/', views.request_cancel, name='cancel'),
]